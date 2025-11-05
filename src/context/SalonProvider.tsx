"use client";

import React, { createContext, useContext, ReactNode, useMemo, useEffect, useState } from 'react';
import type { Service, Product, Worker, Sale } from '@/lib/types';
import { useFirestore, useCollection } from '@/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { useUser } from '@/firebase';

interface SalonContextType {
  services: Service[];
  products: Product[];
  workers: Worker[];
  sales: Sale[];
  loading: boolean;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addWorker: (worker: Omit<Worker, 'id' | 'customers' | 'sales'>) => Promise<void>;
  updateWorker: (worker: Worker) => Promise<void>;
  archiveWorker: (id: string) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'total'>) => Promise<Sale>;
  getSaleById: (id: string) => Sale | undefined;
  getTodaysSales: () => number;
  getTodaysCustomers: () => number;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider = ({ children }: { children: ReactNode }) => {
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();

  const servicesCollection = useMemo(() => user ? collection(firestore, 'services') : null, [firestore, user]);
  const productsCollection = useMemo(() => user ? collection(firestore, 'products') : null, [firestore, user]);
  const baseWorkersCollection = useMemo(() => user ? collection(firestore, 'workers') : null, [firestore, user]);
  const salesCollection = useMemo(() => user ? collection(firestore, 'sales') : null, [firestore, user]);

  const { data: services = [], loading: servicesLoading } = useCollection<Service>(servicesCollection);
  const { data: products = [], loading: productsLoading } = useCollection<Product>(productsCollection);
  const { data: baseWorkers = [], loading: workersLoading } = useCollection<Worker>(baseWorkersCollection);
  const { data: sales = [], loading: salesLoading } = useCollection<Sale>(salesCollection);
  
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    if(!workersLoading && !salesLoading) {
      const workerSales = new Map<string, {sales: number, customers: number}>();
      
      sales.forEach(sale => {
        const stats = workerSales.get(sale.workerId) || { sales: 0, customers: 0 };
        stats.sales += sale.total;
        stats.customers += 1;
        workerSales.set(sale.workerId, stats);
      });

      const updatedWorkers = baseWorkers.map(worker => ({
        ...worker,
        sales: workerSales.get(worker.id)?.sales || 0,
        customers: workerSales.get(worker.id)?.customers || 0,
      }));
      
      setWorkers(updatedWorkers);
    }
  }, [baseWorkers, sales, workersLoading, salesLoading])


  const loading = userLoading || servicesLoading || productsLoading || workersLoading || salesLoading;

  const addService = async (service: Omit<Service, 'id'>) => {
    if (!servicesCollection) return;
    await addDoc(servicesCollection, service);
  };

  const updateService = async (updatedService: Service) => {
    if (!servicesCollection) return;
    const { id, ...data } = updatedService;
    await updateDoc(doc(servicesCollection, id), data);
  };

  const deleteService = async (id: string) => {
    if (!servicesCollection) return;
    await deleteDoc(doc(servicesCollection, id));
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!productsCollection) return;
    await addDoc(productsCollection, product);
  };

  const updateProduct = async (updatedProduct: Product) => {
    if (!productsCollection) return;
    const { id, ...data } = updatedProduct;
    await updateDoc(doc(productsCollection, id), data);
  };

  const deleteProduct = async (id: string) => {
    if (!productsCollection) return;
    await deleteDoc(doc(productsCollection, id));
  };

  const addWorker = async (worker: Omit<Worker, 'id' | 'customers' | 'sales'>) => {
    if (!baseWorkersCollection) return;
    await addDoc(baseWorkersCollection, { ...worker, sales: 0, customers: 0 });
  };

  const updateWorker = async (updatedWorker: Worker) => {
    if (!baseWorkersCollection) return;
    const { id, ...data } = updatedWorker;
    await updateDoc(doc(baseWorkersCollection, id), data);
  };

  const archiveWorker = async (id: string) => {
    if (!baseWorkersCollection) return;
    await updateDoc(doc(baseWorkersCollection, id), { archived: true });
  };


  const addSale = async (saleData: Omit<Sale, 'id' | 'createdAt' | 'total'>): Promise<Sale> => {
    if (!salesCollection || !productsCollection) {
      throw new Error("Collections not ready");
    }
  
    const servicesCost = saleData.serviceIds.reduce((acc, id) => {
      const service = services.find(s => s.id === id);
      return acc + (service?.price || 0);
    }, 0);
  
    const productsCost = saleData.productIds.reduce((acc, item) => {
      const product = products.find(p => p.id === item.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);
  
    const subtotal = servicesCost + productsCost;
    const total = subtotal - (subtotal * (saleData.discount / 100));
  
    const newSaleData = {
      ...saleData,
      createdAt: serverTimestamp(),
      total,
    };
    
    const saleRef = await addDoc(salesCollection, newSaleData);
  
    const batch = writeBatch(firestore);
      
    // Update product stock
    saleData.productIds.forEach(item => {
      const productRef = doc(productsCollection, item.id);
      batch.update(productRef, {
        stock: increment(-item.quantity)
      });
    });
  
    await batch.commit();

    return { ...saleData, id: saleRef.id, createdAt: new Date(), total };
  };

  const getSaleById = (id: string) => sales.find(r => r.id === id);
  
  const getTodaysSales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return sales.filter(r => {
        const createdAt = (r.createdAt as Timestamp).toDate();
        return createdAt >= today && createdAt < tomorrow;
    }).reduce((sum, r) => sum + r.total, 0);
  }

  const getTodaysCustomers = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return sales.filter(r => {
        const createdAt = (r.createdAt as Timestamp).toDate();
        return createdAt >= today && createdAt < tomorrow;
    }).length;
  }

  const value = {
    services, products, workers, sales, loading,
    addService, updateService, deleteService,
    addProduct, updateProduct, deleteProduct,
    addWorker, updateWorker, archiveWorker,
    addSale, getSaleById,
    getTodaysSales, getTodaysCustomers
  };

  return (
    <SalonContext.Provider value={value}>
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (context === undefined) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};


"use client";

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
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
  increment,
  runTransaction
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
  updateSale: (saleId: string, oldSale: Sale, newSaleData: Omit<Sale, 'id' | 'createdAt' | 'total'>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
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

  const workers = useMemo(() => {
    const workerStats = new Map<string, {sales: number, customers: number}>();
    
    sales.forEach(sale => {
      if(sale.workerId) {
        const stats = workerStats.get(sale.workerId) || { sales: 0, customers: 0 };
        stats.sales += sale.total;
        stats.customers += 1;
        workerStats.set(sale.workerId, stats);
      }
    });

    return baseWorkers.map(worker => ({
      ...worker,
      sales: workerStats.get(worker.id)?.sales || 0,
      customers: workerStats.get(worker.id)?.customers || 0,
    }));
  }, [baseWorkers, sales]);


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

  const updateSale = async (saleId: string, oldSale: Sale, newSaleData: Omit<Sale, 'id' | 'createdAt' | 'total'>) => {
    if (!salesCollection || !productsCollection) {
        throw new Error("Collections not ready");
    }

    await runTransaction(firestore, async (transaction) => {
        const saleRef = doc(salesCollection, saleId);

        // 1. Calculate stock changes
        const stockChanges = new Map<string, number>();

        // Add back old quantities
        oldSale.productIds.forEach(item => {
            stockChanges.set(item.id, (stockChanges.get(item.id) || 0) + item.quantity);
        });

        // Subtract new quantities
        newSaleData.productIds.forEach(item => {
            stockChanges.set(item.id, (stockChanges.get(item.id) || 0) - item.quantity);
        });

        // 2. Apply stock changes
        for (const [productId, change] of stockChanges.entries()) {
            if (change !== 0) {
                const productRef = doc(productsCollection, productId);
                transaction.update(productRef, { stock: increment(change) });
            }
        }

        // 3. Calculate new total
        const servicesCost = newSaleData.serviceIds.reduce((acc, id) => {
            const service = services.find(s => s.id === id);
            return acc + (service?.price || 0);
        }, 0);

        const productsCost = newSaleData.productIds.reduce((acc, item) => {
            const product = products.find(p => p.id === item.id);
            return acc + (product?.price || 0) * item.quantity;
        }, 0);

        const subtotal = servicesCost + productsCost;
        const total = subtotal - (subtotal * (newSaleData.discount / 100));

        // 4. Update the sale document
        transaction.update(saleRef, { ...newSaleData, total });
    });
  };
  
  const deleteSale = async (id: string) => {
    if (!salesCollection || !productsCollection) return;
    
    const saleToDelete = sales.find(s => s.id === id);
    if (!saleToDelete) return;

    const batch = writeBatch(firestore);

    // Restock products
    saleToDelete.productIds.forEach(item => {
        const productRef = doc(productsCollection, item.id);
        batch.update(productRef, { stock: increment(item.quantity) });
    });

    // Delete sale
    const saleRef = doc(salesCollection, id);
    batch.delete(saleRef);
    
    await batch.commit();
  };

  const getSaleById = (id: string) => sales.find(r => r.id === id);
  
  const getTodaysSales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return sales.filter(r => {
        const createdAt = r.createdAt as Timestamp | Date;
        const date = createdAt instanceof Date ? createdAt : createdAt.toDate();
        return date >= today && date < tomorrow;
    }).reduce((sum, r) => sum + r.total, 0);
  }

  const getTodaysCustomers = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return sales.filter(r => {
        const createdAt = r.createdAt as Timestamp | Date;
        const date = createdAt instanceof Date ? createdAt : createdAt.toDate();
        return date >= today && date < tomorrow;
    }).length;
  }

  const value = {
    services, products, workers, sales, loading,
    addService, updateService, deleteService,
    addProduct, updateProduct, deleteProduct,
    addWorker, updateWorker, archiveWorker,
    addSale, updateSale, deleteSale, getSaleById,
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

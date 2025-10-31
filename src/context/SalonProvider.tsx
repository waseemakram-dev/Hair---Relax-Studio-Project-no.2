"use client";

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import type { Service, Product, Worker, Receipt } from '@/lib/types';
import { useFirestore, useCollection } from '@/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp,
  increment
} from 'firebase/firestore';
import { useUser } from '@/firebase';

interface SalonContextType {
  services: Service[];
  products: Product[];
  workers: Worker[];
  receipts: Receipt[];
  loading: boolean;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addWorker: (worker: Omit<Worker, 'id'>) => Promise<void>;
  updateWorker: (worker: Worker) => Promise<void>;
  archiveWorker: (id: string) => Promise<void>;
  addReceipt: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'total'>) => Promise<Receipt>;
  getReceiptById: (id: string) => Receipt | undefined;
  getTodaysSales: () => number;
  getTodaysCustomers: () => number;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider = ({ children }: { children: ReactNode }) => {
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();

  const servicesCollection = useMemo(() => user ? collection(firestore, 'services') : null, [firestore, user]);
  const productsCollection = useMemo(() => user ? collection(firestore, 'products') : null, [firestore, user]);
  const workersCollection = useMemo(() => user ? collection(firestore, 'workers') : null, [firestore, user]);
  const receiptsCollection = useMemo(() => user ? collection(firestore, 'receipts') : null, [firestore, user]);

  const { data: services = [], loading: servicesLoading } = useCollection<Service>(servicesCollection);
  const { data: products = [], loading: productsLoading } = useCollection<Product>(productsCollection);
  const { data: workers = [], loading: workersLoading } = useCollection<Worker>(workersCollection);
  const { data: receipts = [], loading: receiptsLoading } = useCollection<Receipt>(receiptsCollection);

  const loading = userLoading || servicesLoading || productsLoading || workersLoading || receiptsLoading;

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

  const addWorker = async (worker: Omit<Worker, 'id'>) => {
    if (!workersCollection) return;
    await addDoc(workersCollection, worker);
  };

  const updateWorker = async (updatedWorker: Worker) => {
    if (!workersCollection) return;
    const { id, ...data } = updatedWorker;
    await updateDoc(doc(workersCollection, id), data);
  };

  const archiveWorker = async (id: string) => {
    if (!workersCollection) return;
    await updateDoc(doc(workersCollection, id), { archived: true });
  };


  const addReceipt = async (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'total'>): Promise<Receipt> => {
    if (!receiptsCollection || !workersCollection || !productsCollection) {
      throw new Error("Collections not ready");
    }
  
    const servicesCost = receiptData.serviceIds.reduce((acc, id) => {
      const service = services.find(s => s.id === id);
      return acc + (service?.price || 0);
    }, 0);
  
    const productsCost = receiptData.productIds.reduce((acc, item) => {
      const product = products.find(p => p.id === item.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);
  
    const subtotal = servicesCost + productsCost;
    const total = subtotal - (subtotal * (receiptData.discount / 100));
  
    const newReceiptData = {
      ...receiptData,
      createdAt: serverTimestamp(),
      total,
    };
    
    const receiptRef = await addDoc(receiptsCollection, newReceiptData);
  
    const batch = writeBatch(firestore);
  
    // Update worker stats
    const workerRef = doc(workersCollection, receiptData.workerId);
    batch.update(workerRef, {
      customers: increment(1),
      sales: increment(total)
    });
  
    // Update product stock
    receiptData.productIds.forEach(item => {
      const productRef = doc(productsCollection, item.id);
      batch.update(productRef, {
        stock: increment(-item.quantity)
      });
    });
  
    await batch.commit();

    return { ...receiptData, id: receiptRef.id, createdAt: new Date(), total };
  };

  const getReceiptById = (id: string) => receipts.find(r => r.id === id);
  
  const getTodaysSales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return receipts.filter(r => {
        const createdAt = (r.createdAt as Timestamp).toDate();
        return createdAt >= today && createdAt < tomorrow;
    }).reduce((sum, r) => sum + r.total, 0);
  }

  const getTodaysCustomers = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return receipts.filter(r => {
        const createdAt = (r.createdAt as Timestamp).toDate();
        return createdAt >= today && createdAt < tomorrow;
    }).length;
  }

  const value = {
    services, products, workers, receipts, loading,
    addService, updateService, deleteService,
    addProduct, updateProduct, deleteProduct,
    addWorker, updateWorker, archiveWorker,
    addReceipt, getReceiptById,
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

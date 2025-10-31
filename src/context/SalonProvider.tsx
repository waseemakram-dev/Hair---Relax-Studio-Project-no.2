"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Service, Product, Worker, Receipt } from '@/lib/types';
import { initialServices, initialProducts, initialWorkers } from '@/lib/data';

interface SalonContextType {
  services: Service[];
  products: Product[];
  workers: Worker[];
  receipts: Receipt[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addReceipt: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'total'>) => Receipt;
  getReceiptById: (id: string) => Receipt | undefined;
  getTodaysSales: () => number;
  getTodaysCustomers: () => number;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const addService = (service: Omit<Service, 'id'>) => {
    setServices([...services, { ...service, id: crypto.randomUUID() }]);
  };

  const updateService = (updatedService: Service) => {
    setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts([...products, { ...product, id: crypto.randomUUID() }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addReceipt = (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'total'>) => {
    // Calculate total
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

    const newReceipt: Receipt = {
      ...receiptData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      total,
    };
    
    setReceipts(prev => [newReceipt, ...prev]);

    // Update worker stats
    setWorkers(workers.map(w => {
      if (w.id === newReceipt.workerId) {
        return { ...w, customers: w.customers + 1, sales: w.sales + total };
      }
      return w;
    }));

    // Update product stock
    newReceipt.productIds.forEach(item => {
      setProducts(prevProducts => prevProducts.map(p => {
        if (p.id === item.id) {
          return { ...p, stock: p.stock - item.quantity };
        }
        return p;
      }));
    });

    return newReceipt;
  };

  const getReceiptById = (id: string) => receipts.find(r => r.id === id);
  
  const getTodaysSales = () => {
    const today = new Date();
    return receipts.filter(r => r.createdAt.toDateString() === today.toDateString())
      .reduce((sum, r) => sum + r.total, 0);
  }

  const getTodaysCustomers = () => {
      const today = new Date();
      return receipts.filter(r => r.createdAt.toDateString() === today.toDateString()).length;
  }

  return (
    <SalonContext.Provider value={{
      services, products, workers, receipts,
      addService, updateService, deleteService,
      addProduct, updateProduct, deleteProduct,
      addReceipt, getReceiptById,
      getTodaysSales, getTodaysCustomers
    }}>
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

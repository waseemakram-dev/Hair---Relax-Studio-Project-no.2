import type { Timestamp } from 'firebase/firestore';

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold?: number;
}

export interface Worker {
  id:string;
  name: string;
  customers: number;
  sales: number;
  archived?: boolean;
}

export interface Receipt {
  id: string;
  customerName: string;
  workerId: string;
  serviceIds: string[];
  productIds: { id: string; quantity: number }[];
  discount: number;
  total: number;
  createdAt: Timestamp | Date;
}

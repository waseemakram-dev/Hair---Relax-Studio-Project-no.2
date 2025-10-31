import type { Service, Product, Worker } from './types';

// This file now contains only the initial data structure for workers, 
// which will be created if they don't exist in Firestore.
// Services and Products are now fully managed in Firestore.

export const initialServices: Service[] = [];
export const initialProducts: Product[] = [];

export const initialWorkers: Worker[] = [
  { id: 'w1', name: 'Portion 1', customers: 0, sales: 0 },
  { id: 'w2', name: 'Portion 2', customers: 0, sales: 0 },
  { id: 'w3', name: 'Portion 3', customers: 0, sales: 0 },
];

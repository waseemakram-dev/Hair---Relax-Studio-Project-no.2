import type { Service, Product, Worker } from './types';

export const initialServices: Service[] = [
  { id: '1', name: 'Haircut', price: 25 },
  { id: '2', name: 'Facial', price: 50 },
  { id: '3', name: 'Massage', price: 75 },
  { id: '4', name: 'Manicure', price: 30 },
  { id: '5', name: 'Pedicure', price: 40 },
  { id: '6', name: 'Hair Color', price: 80 },
];

export const initialProducts: Product[] = [
  { id: 'p1', name: 'Shampoo', price: 15, stock: 50 },
  { id: 'p2', name: 'Conditioner', price: 15, stock: 45 },
  { id: 'p3', name: 'Hair Gel', price: 10, stock: 8 },
  { id: 'p4', name: 'Face Mask', price: 20, stock: 30 },
  { id: 'p5', name: 'Lotion', price: 12, stock: 12 },
];

export const initialWorkers: Worker[] = [
  { id: 'w1', name: 'Portion 1', customers: 0, sales: 0 },
  { id: 'w2', name: 'Portion 2', customers: 0, sales: 0 },
  { id: 'w3', name: 'Portion 3', customers: 0, sales: 0 },
];

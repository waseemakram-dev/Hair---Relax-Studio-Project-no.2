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
}

export interface Worker {
  id: string;
  name: string;
  customers: number;
  sales: number;
}

export interface Receipt {
  id: string;
  customerName: string;
  workerId: string;
  serviceIds: string[];
  productIds: { id: string; quantity: number }[];
  discount: number;
  total: number;
  createdAt: Date;
}

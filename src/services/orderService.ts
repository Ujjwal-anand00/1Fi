import type { DeliveryAddress, Order } from '../types/order';
import { registerEmiPlanFromOrder } from './emiDuesService';

let laptopAsset: any = undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  laptopAsset = require('../../assets/products/laptop.jpg');
} catch {
  laptopAsset = undefined;
}

// Default initial seeded order for OrbitBook Air matching EMI Dues dashboard
const seedInitialOrder: Order = {
  orderId: '1FI-ORD-108422',
  productId: 'orbitbook-air-14',
  productName: 'OrbitBook Air 14 Laptop',
  productImage: {
    type: 'asset',
    source: laptopAsset,
    label: 'Laptop',
    backgroundColor: '#F5F5F7',
  },
  variant: '16 GB RAM • 512 GB SSD',
  quantity: 1,
  productPrice: 64999,
  productAmount: 64999,
  emiPlan: '12 Months EMI',
  emiMonths: 12,
  monthlyEmi: 5768.67,
  interestAmount: 4225,
  processingFee: 699,
  totalPayable: 69923,
  deliveryAddress: {
    fullName: 'Rahul Sharma',
    mobileNumber: '9876543210',
    addressLine1: 'Flat 402, Lotus Heights',
    addressLine2: '12th Main, Indiranagar',
    addressLine: 'Flat 402, Lotus Heights, 12th Main, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
  },
  paymentMethod: 'upi',
  orderStatus: 'Confirmed',
  createdAt: '2026-07-05T10:30:00.000Z',
  expectedDelivery: '9 Jul 2026',
};

// In-memory persistent order storage
const ordersStore: Order[] = [seedInitialOrder];

// Default customer delivery address
export const defaultDeliveryAddress: DeliveryAddress = {
  fullName: 'Rahul Sharma',
  mobileNumber: '9876543210',
  addressLine1: 'Flat 402, Lotus Heights',
  addressLine2: '12th Main, Indiranagar',
  addressLine: 'Flat 402, Lotus Heights, 12th Main, Indiranagar',
  city: 'Bengaluru',
  state: 'Karnataka',
  pinCode: '560038',
};

// Generate realistic unique 1Fi Order ID
export function generateOrderId(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `1FI-ORD-${randomDigits}`;
}

// Compute expected delivery date (4 days from today)
export function getExpectedDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 4);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// Persist order in store & register active EMI plan
export async function createOrder(
  orderData: Omit<Order, 'orderId' | 'createdAt' | 'orderStatus' | 'expectedDelivery'> & {
    productPrice?: number;
    productAmount?: number;
  }
): Promise<Order> {
  const price = orderData.productPrice ?? orderData.productAmount ?? 0;
  const newOrder: Order = {
    ...orderData,
    productPrice: price,
    productAmount: price,
    orderId: generateOrderId(),
    orderStatus: 'Confirmed',
    createdAt: new Date().toISOString(),
    expectedDelivery: getExpectedDeliveryDate(),
  };

  ordersStore.unshift(newOrder);

  // Automatically register in EMI Dues service
  registerEmiPlanFromOrder(newOrder);

  return newOrder;
}

// Retrieve single order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  const found = ordersStore.find((order) => order.orderId === orderId);
  return found ?? null;
}

// Retrieve all customer orders
export async function getOrders(): Promise<Order[]> {
  return [...ordersStore];
}

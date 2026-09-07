import type { DeliveryAddress, Order } from '../types/order';
import { defaultDeliveryAddress, seedInitialOrder } from '../data/orderSeedData';
import { registerEmiPlanFromOrder } from './emiDuesService';

export { defaultDeliveryAddress, seedInitialOrder };

// In-memory persistent order storage
const ordersStore: Order[] = [seedInitialOrder];

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

  // Replace initial mock seed order when the user places their first real order
  const seedIndex = ordersStore.findIndex((o) => o.orderId === seedInitialOrder.orderId);
  if (seedIndex !== -1) {
    ordersStore.splice(seedIndex, 1);
  }

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

import type { DeliveryAddress, Order } from '../types/order';

// In-memory order storage
const ordersStore: Order[] = [];

// Default verified customer delivery address
export const defaultDeliveryAddress: DeliveryAddress = {
  fullName: 'Rahul Sharma',
  mobileNumber: '9876543210',
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

// Persist order in store
export async function createOrder(orderData: Omit<Order, 'orderId' | 'createdAt' | 'orderStatus' | 'expectedDelivery'>): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    orderId: generateOrderId(),
    orderStatus: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    expectedDelivery: getExpectedDeliveryDate(),
  };

  ordersStore.unshift(newOrder);
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

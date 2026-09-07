import type { DeliveryAddress, Order } from '../types/order';

let laptopAsset: any = undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  laptopAsset = require('../../assets/products/laptop.jpg');
} catch {
  laptopAsset = undefined;
}

// Single Source of Truth for customer delivery address
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

// Single Source of Truth seeded order for OrbitBook Air matching EMI Dues dashboard
export const seedInitialOrder: Order = {
  orderId: '1FI-ORD-108422',
  productId: 'orbitbook-air-14',
  productName: 'OrbitBook Air 14 Laptop',
  productImage: {
    type: 'asset',
    source: laptopAsset,
    label: 'Laptop',
    backgroundColor: '#F5F5F7',
  },
  variant: '8 GB RAM • 512 GB SSD',
  quantity: 1,
  productPrice: 64999,
  productAmount: 64999,
  emiPlan: '12 Months EMI',
  emiMonths: 12,
  monthlyEmi: 5768.67,
  interestAmount: 4225,
  processingFee: 699,
  totalPayable: 69923,
  deliveryAddress: defaultDeliveryAddress,
  paymentMethod: 'upi',
  orderStatus: 'Confirmed',
  createdAt: '2026-07-05T10:30:00.000Z',
  expectedDelivery: '9 Jul 2026',
};

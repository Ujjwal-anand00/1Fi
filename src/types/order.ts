import type { ProductImage } from './marketplace';

export type DeliveryAddress = {
  fullName: string;
  mobileNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
};

export type PaymentMethod = 'upi' | 'card' | 'netbanking';

export type EmiCalculation = {
  principal: number;
  interestAmount: number;
  processingFee: number;
  totalPayable: number;
  monthlyEmi: number;
  months: number;
  isNoCost: boolean;
  interestRate: number;
};

export type Order = {
  orderId: string;
  productId: string;
  productName: string;
  productImage: ProductImage;
  variant: string;
  color?: string;
  storage?: string;
  quantity: number;
  productAmount: number;
  emiPlan: string;
  emiMonths: number;
  monthlyEmi: number;
  interestAmount: number;
  processingFee: number;
  totalPayable: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  orderStatus: 'CONFIRMED' | 'PROCESSING' | 'DELIVERED';
  createdAt: string;
  expectedDelivery: string;
};

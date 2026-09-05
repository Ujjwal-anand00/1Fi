import type { ProductImage } from './marketplace';
import type { PaymentMethod } from './order';

export type InstallmentStatus = 'Paid' | 'Due Soon' | 'Upcoming' | 'Overdue';

export type Installment = {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
};

export type ActiveEmiPlan = {
  planId: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: ProductImage;
  variant: string;
  purchasePrice: number;
  processingFee: number;
  interestAmount: number;
  totalPayable: number;
  monthlyEmi: number;
  totalInstallments: number;
  paidInstallments: number;
  amountPaid: number;
  remainingAmount: number;
  nextDueDate: string;
  nextDueAmount: number;
  nextDueStatus: InstallmentStatus;
  startDate: string;
  endDate: string;
  schedule: Installment[];
};

export type EmiOverviewSummary = {
  totalOutstanding: number;
  nextEmiDueAmount: number;
  nextDueDate: string;
  activePlansCount: number;
  totalOriginalAmount: number;
  totalAmountPaid: number;
  overallRepaymentProgress: number; // 0 to 1
};

export type UpcomingPayment = {
  id: string;
  planId: string;
  orderId: string;
  productName: string;
  productImage: ProductImage;
  variant: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  dueDate: string;
  status: InstallmentStatus;
};

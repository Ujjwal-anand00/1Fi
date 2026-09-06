import type { ActiveEmiPlan, EmiOverviewSummary, EmiPaymentReceipt, EmiPaymentResult, Installment, InstallmentStatus, UpcomingPayment } from '../types/emi';
import type { Order, PaymentMethod } from '../types/order';

// In-memory active EMI plans store
let activeEmiPlansStore: ActiveEmiPlan[] = [];

// Listeners for reactive updates
type EmiUpdateListener = () => void;
const listeners: Set<EmiUpdateListener> = new Set();

export function subscribeToEmiUpdates(listener: EmiUpdateListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener errors
    }
  });
}

// Generate monthly installment dates starting from a base date
function generateDueDates(startDate: Date, totalMonths: number): string[] {
  const dates: string[] = [];
  for (let i = 1; i <= totalMonths; i++) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + i);
    d.setDate(5); // Consistent 5th of the month due date
    dates.push(
      d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
  }
  return dates;
}

// Seed initial active EMI plan matching the user's specification
function initSeedPlans() {
  if (activeEmiPlansStore.length > 0) return;

  const startDate = new Date('2026-07-05');
  const dueDates = generateDueDates(startDate, 12);
  const monthlyEmi = 5768.67;
  const totalPayable = 69224; // 12 * 5768.67 approx
  const paidCount = 2;
  const paidAmount = Math.round(monthlyEmi * paidCount * 100) / 100;
  const remainingAmount = Math.round((totalPayable - paidAmount) * 100) / 100;

  const schedule: Installment[] = [];
  for (let i = 1; i <= 12; i++) {
    if (i <= paidCount) {
      schedule.push({
        installmentNumber: i,
        dueDate: dueDates[i - 1],
        amount: monthlyEmi,
        status: 'Paid',
        paidAt: i === 1 ? '2026-08-05' : '2026-09-05',
        paymentMethod: 'upi',
      });
    } else if (i === paidCount + 1) {
      schedule.push({
        installmentNumber: i,
        dueDate: '5 Oct 2026',
        amount: monthlyEmi,
        status: 'Due Soon',
      });
    } else {
      schedule.push({
        installmentNumber: i,
        dueDate: dueDates[i - 1],
        amount: monthlyEmi,
        status: 'Upcoming',
      });
    }
  }

  let laptopAsset: any = undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    laptopAsset = require('../../assets/products/laptop.jpg');
  } catch {
    laptopAsset = undefined;
  }

  const initialPlan: ActiveEmiPlan = {
    planId: 'emi-plan-orbitbook-1',
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
    purchasePrice: 64999,
    processingFee: 699,
    interestAmount: 4225,
    totalPayable: 69923,
    monthlyEmi: 5768.67,
    totalInstallments: 12,
    paidInstallments: 2,
    amountPaid: 11537.34,
    remainingAmount: 57686.7,
    nextDueDate: '5 Oct 2026',
    nextDueAmount: 5768.67,
    nextDueStatus: 'Due Soon',
    startDate: '5 Aug 2026',
    endDate: '5 Jul 2027',
    schedule,
  };

  activeEmiPlansStore = [initialPlan];
}

initSeedPlans();

// Create and register a new active EMI plan directly from a completed Marketplace order
export function registerEmiPlanFromOrder(order: Order): ActiveEmiPlan {
  const existing = activeEmiPlansStore.find((p) => p.orderId === order.orderId);
  if (existing) return existing;

  const totalMonths = order.emiMonths || 3;
  const startDate = new Date(order.createdAt || Date.now());
  const dueDates = generateDueDates(startDate, totalMonths);

  const schedule: Installment[] = [];
  for (let i = 1; i <= totalMonths; i++) {
    schedule.push({
      installmentNumber: i,
      dueDate: dueDates[i - 1],
      amount: order.monthlyEmi,
      status: i === 1 ? 'Due Soon' : 'Upcoming',
    });
  }

  const newPlan: ActiveEmiPlan = {
    planId: `emi-plan-${order.orderId}`,
    orderId: order.orderId,
    productId: order.productId,
    productName: order.productName,
    productImage: order.productImage,
    variant: order.variant,
    purchasePrice: order.productPrice || order.productAmount,
    processingFee: order.processingFee,
    interestAmount: order.interestAmount,
    totalPayable: order.totalPayable,
    monthlyEmi: order.monthlyEmi,
    totalInstallments: totalMonths,
    paidInstallments: 0,
    amountPaid: 0,
    remainingAmount: order.totalPayable,
    nextDueDate: dueDates[0] || 'Next Month',
    nextDueAmount: order.monthlyEmi,
    nextDueStatus: 'Due Soon',
    startDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    endDate: dueDates[dueDates.length - 1] || 'Upcoming',
    schedule,
  };

  activeEmiPlansStore.unshift(newPlan);
  notifyListeners();
  return newPlan;
}

// Retrieve high-level summary overview
export async function getEmiOverview(): Promise<EmiOverviewSummary> {
  initSeedPlans();
  const plans = activeEmiPlansStore.filter((p) => p.remainingAmount > 0);

  const totalOutstanding = plans.reduce((acc, p) => acc + p.remainingAmount, 0);
  const totalOriginalAmount = activeEmiPlansStore.reduce((acc, p) => acc + p.totalPayable, 0);
  const totalAmountPaid = activeEmiPlansStore.reduce((acc, p) => acc + p.amountPaid, 0);

  // Find next upcoming due plan
  const nextPlan = plans[0];
  const nextEmiDueAmount = nextPlan ? nextPlan.nextDueAmount : 0;
  const nextDueDate = nextPlan ? nextPlan.nextDueDate : 'None';

  const overallRepaymentProgress =
    totalOriginalAmount > 0 ? Math.min(1, Math.max(0, totalAmountPaid / totalOriginalAmount)) : 0;

  return {
    totalOutstanding: Math.round(totalOutstanding * 100) / 100,
    nextEmiDueAmount: Math.round(nextEmiDueAmount * 100) / 100,
    nextDueDate,
    activePlansCount: plans.length,
    totalOriginalAmount: Math.round(totalOriginalAmount * 100) / 100,
    totalAmountPaid: Math.round(totalAmountPaid * 100) / 100,
    overallRepaymentProgress,
  };
}

// Retrieve active EMI plans list
export async function getActiveEmiPlans(): Promise<ActiveEmiPlan[]> {
  initSeedPlans();
  return [...activeEmiPlansStore];
}

// Retrieve single plan by planId or orderId
export async function getEmiPlanById(planIdOrOrderId: string): Promise<ActiveEmiPlan | null> {
  initSeedPlans();
  const found = activeEmiPlansStore.find(
    (p) => p.planId === planIdOrOrderId || p.orderId === planIdOrOrderId
  );
  return found ?? null;
}

// Retrieve chronological upcoming payments across all active plans
export async function getUpcomingPayments(): Promise<UpcomingPayment[]> {
  initSeedPlans();
  const payments: UpcomingPayment[] = [];

  for (const plan of activeEmiPlansStore) {
    for (const inst of plan.schedule) {
      if (inst.status !== 'Paid') {
        payments.push({
          id: `${plan.planId}-inst-${inst.installmentNumber}`,
          planId: plan.planId,
          orderId: plan.orderId,
          productName: plan.productName,
          productImage: plan.productImage,
          variant: plan.variant,
          installmentNumber: inst.installmentNumber,
          totalInstallments: plan.totalInstallments,
          amount: inst.amount,
          dueDate: inst.dueDate,
          status: inst.status,
        });
      }
    }
  }

  // Sort: Due Soon first, then Upcoming
  return payments.sort((a, b) => {
    if (a.status === 'Due Soon' && b.status !== 'Due Soon') return -1;
    if (b.status === 'Due Soon' && a.status !== 'Due Soon') return 1;
    return 0;
  });
}

// Pay a single EMI installment and generate official transaction receipt
export async function payEmiInstallment(
  planId: string,
  installmentNumber: number,
  paymentMethod: PaymentMethod = 'upi',
  options?: { shouldFail?: boolean }
): Promise<EmiPaymentResult> {
  if (options?.shouldFail) {
    throw new Error('Payment was declined by issuing bank. Please check your mandate and try again.');
  }

  const planIndex = activeEmiPlansStore.findIndex((p) => p.planId === planId);
  if (planIndex === -1) {
    throw new Error('EMI plan not found. Please refresh and try again.');
  }

  const plan = activeEmiPlansStore[planIndex];
  const targetInstallment = plan.schedule.find((i) => i.installmentNumber === installmentNumber);

  if (!targetInstallment) {
    throw new Error(`Installment ${installmentNumber} was not found on this plan.`);
  }

  if (targetInstallment.status === 'Paid') {
    throw new Error(`Installment ${installmentNumber} has already been paid.`);
  }

  const previousOutstanding = plan.remainingAmount;
  const paymentDate = new Date().toISOString();
  const transactionId = `1FI-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  // Mark target installment as Paid
  const updatedSchedule = plan.schedule.map((inst) => {
    if (inst.installmentNumber === installmentNumber) {
      return {
        ...inst,
        status: 'Paid' as const,
        paidAt: paymentDate,
        paymentMethod,
      };
    }
    return inst;
  });

  const newlyPaidInstallments = updatedSchedule.filter((i) => i.status === 'Paid').length;
  const newAmountPaid = Math.round((plan.amountPaid + targetInstallment.amount) * 100) / 100;
  const newRemainingAmount =
    newlyPaidInstallments >= plan.totalInstallments
      ? 0
      : Math.max(0, Math.round((plan.remainingAmount - targetInstallment.amount) * 100) / 100);

  // Find next unpaid installment
  const nextUnpaid = updatedSchedule.find((i) => i.status !== 'Paid');
  let nextDueDate = 'Completed';
  let nextDueAmount = 0;
  let nextDueStatus: InstallmentStatus = 'Paid';

  if (nextUnpaid) {
    nextDueDate = nextUnpaid.dueDate;
    nextDueAmount = nextUnpaid.amount;
    nextDueStatus = 'Due Soon';
    nextUnpaid.status = 'Due Soon';
  }

  const updatedPlan: ActiveEmiPlan = {
    ...plan,
    schedule: updatedSchedule,
    paidInstallments: newlyPaidInstallments,
    amountPaid: newAmountPaid,
    remainingAmount: newRemainingAmount,
    nextDueDate,
    nextDueAmount,
    nextDueStatus,
  };

  activeEmiPlansStore[planIndex] = updatedPlan;
  notifyListeners();

  const receipt: EmiPaymentReceipt = {
    transactionId,
    planId: plan.planId,
    orderId: plan.orderId,
    productName: plan.productName,
    productImage: plan.productImage,
    variant: plan.variant,
    installmentNumber,
    totalInstallments: plan.totalInstallments,
    amountPaid: targetInstallment.amount,
    paymentMethod,
    paymentDate,
    previousOutstanding,
    updatedOutstanding: newRemainingAmount,
    nextDueDate,
    nextDueAmount,
  };

  return {
    plan: updatedPlan,
    receipt,
  };
}

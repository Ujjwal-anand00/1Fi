import type { ActiveEmiPlan, EmiOverviewSummary, EmiPaymentReceipt, EmiPaymentResult, Installment, InstallmentStatus, UpcomingPayment } from '../types/emi';
import type { Order, PaymentMethod } from '../types/order';
import { seedInitialOrder } from '../data/orderSeedData';

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

// Parse human date strings like "5 Oct 2026" deterministically
export function parseDueDate(dateStr: string): number {
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthsMap: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const monthKey = parts[1].toLowerCase().slice(0, 3);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthsMap[monthKey] !== undefined && !isNaN(year)) {
      return new Date(year, monthsMap[monthKey], day).getTime();
    }
  }
  return 0;
}

// Seed initial active EMI plan derived directly from the single source of truth seedInitialOrder
function initSeedPlans() {
  if (activeEmiPlansStore.length > 0) return;

  const totalMonths = seedInitialOrder.emiMonths || 12;
  const startDate = new Date('2026-07-05');
  const dueDates = generateDueDates(startDate, totalMonths);
  const monthlyEmi = seedInitialOrder.monthlyEmi; // 5768.67
  const totalPayable = seedInitialOrder.totalPayable; // 69923
  const paidCount = 2;
  const amountPaid = Math.round(monthlyEmi * paidCount * 100) / 100; // 11537.34
  // Mathematical reconciliation: remaining amount = total payable - amount already paid
  const remainingAmount = Math.max(0, Math.round((totalPayable - amountPaid) * 100) / 100); // 58385.66

  const schedule: Installment[] = [];
  for (let i = 1; i <= totalMonths; i++) {
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

  const initialPlan: ActiveEmiPlan = {
    planId: 'emi-plan-orbitbook-1',
    orderId: seedInitialOrder.orderId,
    productId: seedInitialOrder.productId,
    productName: seedInitialOrder.productName,
    productImage: seedInitialOrder.productImage,
    variant: seedInitialOrder.variant,
    purchasePrice: seedInitialOrder.productPrice || seedInitialOrder.productAmount,
    processingFee: seedInitialOrder.processingFee,
    interestAmount: seedInitialOrder.interestAmount,
    totalPayable,
    monthlyEmi,
    totalInstallments: totalMonths,
    paidInstallments: paidCount,
    amountPaid,
    remainingAmount,
    nextDueDate: '5 Oct 2026',
    nextDueAmount: monthlyEmi,
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
  // Remove initial mock seed plan when the user places their first real order
  const seedIndex = activeEmiPlansStore.findIndex((p) => p.orderId === seedInitialOrder.orderId);
  if (seedIndex !== -1) {
    activeEmiPlansStore.splice(seedIndex, 1);
  }

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

  // Find plan with the earliest next due date among active plans
  let nextPlan: ActiveEmiPlan | null = null;
  if (plans.length > 0) {
    const sorted = [...plans].sort((a, b) => parseDueDate(a.nextDueDate) - parseDueDate(b.nextDueDate));
    nextPlan = sorted[0];
  }

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

  // Sort strictly chronologically by actual due date ascending.
  // Status ("Due Soon" / "Upcoming") is a display badge only and does NOT alter chronological order.
  // If two payments have the same due date, use deterministic secondary ordering (planId, then installmentNumber).
  return payments.sort((a, b) => {
    const dateA = parseDueDate(a.dueDate);
    const dateB = parseDueDate(b.dueDate);
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    if (a.planId !== b.planId) {
      return a.planId.localeCompare(b.planId);
    }
    return a.installmentNumber - b.installmentNumber;
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
  // Mathematical reconciliation: remaining amount = total payable - amount already paid
  const newRemainingAmount =
    newlyPaidInstallments >= plan.totalInstallments
      ? 0
      : Math.max(0, Math.round((plan.totalPayable - newAmountPaid) * 100) / 100);

  // Find next unpaid installment
  const nextUnpaid = updatedSchedule.find((i) => i.status !== 'Paid');
  let nextDueDate = 'Completed';
  let nextDueAmount = 0;
  let nextDueStatus: InstallmentStatus = 'Paid';

  const finalSchedule = updatedSchedule.map((inst) => {
    if (nextUnpaid && inst.installmentNumber === nextUnpaid.installmentNumber) {
      nextDueDate = inst.dueDate;
      nextDueAmount = inst.amount;
      nextDueStatus = 'Due Soon';
      return {
        ...inst,
        status: 'Due Soon' as const,
      };
    }
    return inst;
  });

  const updatedPlan: ActiveEmiPlan = {
    ...plan,
    schedule: finalSchedule,
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

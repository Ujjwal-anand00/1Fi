import type { EmiPlan } from '../types/marketplace';
import type { EmiCalculation } from '../types/order';

// Mathematically consistent dynamic EMI calculation using current variant price
export function calculateEmiDetails(productPrice: number, plan: EmiPlan): EmiCalculation {
  const principal = productPrice;
  const months = plan.durationMonths > 0 ? plan.durationMonths : 1;
  const processingFee = plan.processingFee ?? 0;
  const isNoCost = plan.interestRate === 0;

  let interestAmount = 0;
  let totalPayable = principal + processingFee;
  let rawMonthly = principal / months;

  if (!isNoCost && plan.interestRate > 0) {
    // Annual interest rate calculated for the exact tenure
    interestAmount = Math.round(principal * (plan.interestRate / 100) * (months / 12));
    totalPayable = principal + interestAmount + processingFee;
    rawMonthly = (principal + interestAmount) / months;
  }

  // Preserve precision up to 2 decimal places
  const monthlyEmi = Math.round(rawMonthly * 100) / 100;

  return {
    principal,
    interestAmount,
    processingFee,
    totalPayable,
    monthlyEmi,
    months,
    isNoCost,
    interestRate: plan.interestRate,
  };
}

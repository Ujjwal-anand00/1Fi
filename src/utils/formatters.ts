// Currency and display formatters

export function formatINR(amount: number): string {
  if (Number.isInteger(amount)) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

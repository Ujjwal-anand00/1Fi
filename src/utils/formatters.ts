// Currency and display formatters

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Helper function to format numbers as Indian Rupee (₹) currency with Indian numbering system.
 * Example:
 * formatCurrency(1500) -> "₹1,500"
 * formatCurrency(25000) -> "₹25,000"
 * formatCurrency(125000) -> "₹1,25,000"
 * formatCurrency(1250000) -> "₹12,50,000"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₹0";
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
}

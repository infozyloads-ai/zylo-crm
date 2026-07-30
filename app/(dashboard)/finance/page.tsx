import { FinanceManager } from "@/features/finance/components/finance-manager";

export const metadata = {
  title: "Finance Management | Zylo CRM",
  description: "Track invoices, quotations, payment settlements, expenses, and profit reports",
};

export default function FinancePage() {
  return <FinanceManager />;
}

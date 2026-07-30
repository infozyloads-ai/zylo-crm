export type InvoiceStatus =
  | "paid"
  | "pending"
  | "partially_paid"
  | "overdue"
  | "cancelled";

export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "converted";

export type PaymentMethod =
  | "bank_transfer"
  | "credit_card"
  | "stripe"
  | "paypal"
  | "cash";

export type ExpenseCategory =
  | "software"
  | "salaries"
  | "marketing"
  | "office_supplies"
  | "travel"
  | "utilities"
  | "other";

export type FinanceTab =
  | "overview"
  | "invoices"
  | "quotations"
  | "payments"
  | "expenses"
  | "reports";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  project_name: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grand_total: number;
  paid_amount: number;
  outstanding_balance: number;
  notes?: string | null;
  created_at: string;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  client_name: string;
  project_name: string;
  issue_date: string;
  status: QuotationStatus;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grand_total: number;
  notes?: string | null;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  invoice_id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_reference: string;
  payment_date: string;
  notes?: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  vendor: string;
  amount: number;
  expense_date: string;
  receipt_url?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface FinanceActivity {
  id: string;
  user_id?: string | null;
  author_name: string;
  activity_type: string;
  description: string;
  created_at: string;
}

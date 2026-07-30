import { z } from "zod";

export const invoiceSchema = z.object({
  invoice_number: z.string().trim().min(1, "Invoice number is required"),
  client_name: z.string().trim().min(1, "Client name is required"),
  project_name: z.string().trim().min(1, "Project name is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  due_date: z.string().min(1, "Due date is required"),
  status: z.enum(["paid", "pending", "partially_paid", "overdue", "cancelled"]),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  discount: z.number().min(0),
  grand_total: z.number().min(0),
  notes: z.string().trim().optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const quotationSchema = z.object({
  quotation_number: z.string().trim().min(1, "Quotation number is required"),
  client_name: z.string().trim().min(1, "Client name is required"),
  project_name: z.string().trim().min(1, "Project name is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  status: z.enum(["draft", "sent", "accepted", "declined", "converted"]),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  discount: z.number().min(0),
  grand_total: z.number().min(0),
  notes: z.string().trim().optional(),
});

export type QuotationFormData = z.infer<typeof quotationSchema>;

export const paymentSchema = z.object({
  invoice_id: z.string().min(1, "Invoice selection is required"),
  invoice_number: z.string().min(1),
  client_name: z.string().min(1),
  amount: z.number().min(0.01, "Payment amount must be greater than 0"),
  payment_method: z.enum([
    "bank_transfer",
    "credit_card",
    "stripe",
    "paypal",
    "cash",
  ]),
  transaction_reference: z.string().trim().min(1, "Reference string required"),
  payment_date: z.string().min(1, "Payment date is required"),
  notes: z.string().trim().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const expenseSchema = z.object({
  title: z.string().trim().min(1, "Expense title is required"),
  category: z.enum([
    "software",
    "salaries",
    "marketing",
    "office_supplies",
    "travel",
    "utilities",
    "other",
  ]),
  vendor: z.string().trim().min(1, "Vendor name is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  expense_date: z.string().min(1, "Expense date is required"),
  receipt_url: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

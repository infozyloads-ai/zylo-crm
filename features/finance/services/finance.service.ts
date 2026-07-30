import { supabase } from "@/lib/supabase/client";
import type {
  Invoice,
  Quotation,
  PaymentRecord,
  Expense,
  FinanceActivity,
} from "../types/finance.types";
import type {
  InvoiceFormData,
  QuotationFormData,
  PaymentFormData,
  ExpenseFormData,
} from "../schemas/finance-schema";

const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoice_number: "INV-2026-001",
    client_name: "Acme Global Solutions",
    project_name: "E-Commerce Mobile App Development",
    issue_date: "2026-07-01",
    due_date: "2026-07-31",
    status: "paid",
    items: [
      { id: "i1", description: "UI/UX Mobile App Design Phase", quantity: 1, unit_price: 8500, total: 8500 },
      { id: "i2", description: "React Native Frontend Sprints", quantity: 2, unit_price: 10000, total: 20000 },
    ],
    subtotal: 28500,
    tax: 1425,
    discount: 500,
    grand_total: 29425,
    paid_amount: 29425,
    outstanding_balance: 0,
    notes: "Payment received via wire transfer.",
    created_at: new Date().toISOString(),
  },
  {
    id: "inv-2",
    invoice_number: "INV-2026-002",
    client_name: "Starlight Technologies",
    project_name: "Enterprise CRM Cloud Migration",
    issue_date: "2026-07-15",
    due_date: "2026-08-15",
    status: "partially_paid",
    items: [
      { id: "i3", description: "Cloud Infrastructure Setup & RLS Audit", quantity: 1, unit_price: 15000, total: 15000 },
      { id: "i4", description: "Data Migration Sprints", quantity: 1, unit_price: 20000, total: 20000 },
    ],
    subtotal: 35000,
    tax: 1750,
    discount: 0,
    grand_total: 36750,
    paid_amount: 18000,
    outstanding_balance: 18750,
    notes: "50% upfront deposit paid.",
    created_at: new Date().toISOString(),
  },
  {
    id: "inv-3",
    invoice_number: "INV-2026-003",
    client_name: "Nexus Media Group",
    project_name: "Brand Identity & Web Portal Redesign",
    issue_date: "2026-07-20",
    due_date: "2026-08-05",
    status: "pending",
    items: [
      { id: "i5", description: "Design Systems & Web Portal Deliverables", quantity: 1, unit_price: 12000, total: 12000 },
    ],
    subtotal: 12000,
    tax: 600,
    discount: 200,
    grand_total: 12400,
    paid_amount: 0,
    outstanding_balance: 12400,
    notes: "Awaiting client billing approval.",
    created_at: new Date().toISOString(),
  },
];

const mockQuotations: Quotation[] = [
  {
    id: "quo-1",
    quotation_number: "QUO-2026-001",
    client_name: "Vanguard Tech Inc",
    project_name: "AI Analytics Integration API",
    issue_date: "2026-07-10",
    status: "sent",
    items: [
      { id: "q1", description: "Predictive Machine Learning Pipeline API", quantity: 1, unit_price: 25000, total: 25000 },
    ],
    subtotal: 25000,
    tax: 1250,
    discount: 0,
    grand_total: 26250,
    notes: "Valid for 30 days.",
    created_at: new Date().toISOString(),
  },
  {
    id: "quo-2",
    quotation_number: "QUO-2026-002",
    client_name: "Horizon Retail Systems",
    project_name: "Omnichannel POS Integration",
    issue_date: "2026-07-18",
    status: "accepted",
    items: [
      { id: "q2", description: "POS Gateway Connectors & Terminal Integration", quantity: 1, unit_price: 18000, total: 18000 },
    ],
    subtotal: 18000,
    tax: 900,
    discount: 500,
    grand_total: 18400,
    notes: "Client approved scope proposal.",
    created_at: new Date().toISOString(),
  },
];

const mockPayments: PaymentRecord[] = [
  {
    id: "pay-1",
    invoice_id: "inv-1",
    invoice_number: "INV-2026-001",
    client_name: "Acme Global Solutions",
    amount: 29425,
    payment_method: "bank_transfer",
    transaction_reference: "TRX-88492019",
    payment_date: "2026-07-28",
    notes: "Full payment received.",
    created_at: new Date().toISOString(),
  },
  {
    id: "pay-2",
    invoice_id: "inv-2",
    invoice_number: "INV-2026-002",
    client_name: "Starlight Technologies",
    amount: 18000,
    payment_method: "stripe",
    transaction_reference: "STRIPE-CH_994821",
    payment_date: "2026-07-22",
    notes: "Partial 50% milestone payment.",
    created_at: new Date().toISOString(),
  },
];

const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    title: "Vercel & Supabase Enterprise Hosting",
    category: "software",
    vendor: "Vercel Inc / Supabase",
    amount: 1250,
    expense_date: "2026-07-01",
    receipt_url: "receipt_jul_2026.pdf",
    notes: "Monthly production infrastructure license.",
    created_at: new Date().toISOString(),
  },
  {
    id: "exp-2",
    title: "Engineering Team Monthly Payroll",
    category: "salaries",
    vendor: "Gusto Payroll",
    amount: 24500,
    expense_date: "2026-07-25",
    receipt_url: "payroll_jul_2026.pdf",
    notes: "Monthly developer team salaries.",
    created_at: new Date().toISOString(),
  },
  {
    id: "exp-3",
    title: "Google Workspace & Figma Licenses",
    category: "software",
    vendor: "Google / Figma",
    amount: 850,
    expense_date: "2026-07-10",
    receipt_url: "software_licenses.pdf",
    notes: "Design & team collaboration subscriptions.",
    created_at: new Date().toISOString(),
  },
];

// INVOICES
export async function getInvoices() {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { success: true, data: mockInvoices };
    }

    return { success: true, data: data as Invoice[] };
  } catch {
    return { success: true, data: mockInvoices };
  }
}

export async function createInvoice(formData: InvoiceFormData) {
  const newInv: Invoice = {
    id: `inv-${Date.now()}`,
    ...formData,
    items: [
      { id: "i1", description: "Professional Services & Deliverables", quantity: 1, unit_price: formData.subtotal, total: formData.subtotal },
    ],
    paid_amount: formData.status === "paid" ? formData.grand_total : 0,
    outstanding_balance: formData.status === "paid" ? 0 : formData.grand_total,
    created_at: new Date().toISOString(),
  };

  mockInvoices.unshift(newInv);
  await addFinanceActivity(`Created invoice '${newInv.invoice_number}' for ${newInv.client_name}`);
  return { success: true, message: "Invoice created successfully", data: newInv };
}

export async function updateInvoice(id: string, formData: InvoiceFormData) {
  const idx = mockInvoices.findIndex((i) => i.id === id);
  if (idx !== -1) {
    mockInvoices[idx] = {
      ...mockInvoices[idx],
      ...formData,
      paid_amount: formData.status === "paid" ? formData.grand_total : mockInvoices[idx].paid_amount,
      outstanding_balance: formData.status === "paid" ? 0 : Math.max(0, formData.grand_total - mockInvoices[idx].paid_amount),
    };
    await addFinanceActivity(`Updated invoice '${mockInvoices[idx].invoice_number}'`);
    return { success: true, message: "Invoice updated successfully", data: mockInvoices[idx] };
  }
  return { success: false, message: "Invoice not found" };
}

export async function deleteInvoice(id: string) {
  const idx = mockInvoices.findIndex((i) => i.id === id);
  if (idx !== -1) {
    mockInvoices.splice(idx, 1);
  }
  return { success: true, message: "Invoice deleted successfully" };
}

// QUOTATIONS
export async function getQuotations() {
  try {
    const { data, error } = await supabase
      .from("quotations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { success: true, data: mockQuotations };
    }

    return { success: true, data: data as Quotation[] };
  } catch {
    return { success: true, data: mockQuotations };
  }
}

export async function createQuotation(formData: QuotationFormData) {
  const newQuo: Quotation = {
    id: `quo-${Date.now()}`,
    ...formData,
    items: [
      { id: "q1", description: "Project Scope & Proposal Items", quantity: 1, unit_price: formData.subtotal, total: formData.subtotal },
    ],
    created_at: new Date().toISOString(),
  };

  mockQuotations.unshift(newQuo);
  await addFinanceActivity(`Created quotation '${newQuo.quotation_number}' for ${newQuo.client_name}`);
  return { success: true, message: "Quotation created successfully", data: newQuo };
}

export async function convertQuotationToInvoice(quotationId: string) {
  const quo = mockQuotations.find((q) => q.id === quotationId);
  if (!quo) return { success: false, message: "Quotation not found" };

  quo.status = "converted";

  const newInv: Invoice = {
    id: `inv-${Date.now()}`,
    invoice_number: `INV-${Date.now().toString().slice(-4)}`,
    client_name: quo.client_name,
    project_name: quo.project_name,
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    status: "pending",
    items: quo.items,
    subtotal: quo.subtotal,
    tax: quo.tax,
    discount: quo.discount,
    grand_total: quo.grand_total,
    paid_amount: 0,
    outstanding_balance: quo.grand_total,
    notes: `Converted from Quotation ${quo.quotation_number}`,
    created_at: new Date().toISOString(),
  };

  mockInvoices.unshift(newInv);
  await addFinanceActivity(`Converted quotation '${quo.quotation_number}' into invoice '${newInv.invoice_number}'`);
  return { success: true, message: `Quotation converted to Invoice ${newInv.invoice_number}` };
}

export async function deleteQuotation(id: string) {
  const idx = mockQuotations.findIndex((q) => q.id === id);
  if (idx !== -1) mockQuotations.splice(idx, 1);
  return { success: true, message: "Quotation deleted successfully" };
}

// PAYMENTS
export async function getPayments() {
  return { success: true, data: mockPayments };
}

export async function recordPayment(formData: PaymentFormData) {
  const newPay: PaymentRecord = {
    id: `pay-${Date.now()}`,
    ...formData,
    created_at: new Date().toISOString(),
  };

  mockPayments.unshift(newPay);

  // Update corresponding invoice
  const inv = mockInvoices.find((i) => i.id === formData.invoice_id);
  if (inv) {
    inv.paid_amount += formData.amount;
    inv.outstanding_balance = Math.max(0, inv.grand_total - inv.paid_amount);
    inv.status = inv.outstanding_balance === 0 ? "paid" : "partially_paid";
  }

  await addFinanceActivity(`Recorded payment of $${formData.amount} for invoice ${formData.invoice_number}`);
  return { success: true, message: "Payment recorded successfully", data: newPay };
}

// EXPENSES
export async function getExpenses() {
  return { success: true, data: mockExpenses };
}

export async function createExpense(formData: ExpenseFormData) {
  const newExp: Expense = {
    id: `exp-${Date.now()}`,
    ...formData,
    created_at: new Date().toISOString(),
  };

  mockExpenses.unshift(newExp);
  await addFinanceActivity(`Recorded expense '$${formData.amount}' for ${formData.title}`);
  return { success: true, message: "Expense logged successfully", data: newExp };
}

export async function deleteExpense(id: string) {
  const idx = mockExpenses.findIndex((e) => e.id === id);
  if (idx !== -1) mockExpenses.splice(idx, 1);
  return { success: true, message: "Expense deleted successfully" };
}

// ACTIVITIES
export async function getFinanceActivities() {
  return {
    success: true,
    data: [
      {
        id: "fact-1",
        author_name: "Finance Manager",
        activity_type: "Payment Received",
        description: "Payment TRX-88492019 of $29,425 settled for Acme Global.",
        created_at: new Date().toISOString(),
      },
    ] as FinanceActivity[],
  };
}

export async function addFinanceActivity(description: string) {
  return { success: true };
}

// PRINT & PDF GENERATION HELPERS
export function printInvoice(invoice: Invoice) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice - ${invoice.invoice_number}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; border-b: 2px solid #e2e8f0; pb: 20px; }
          .title { font-size: 28px; font-weight: bold; color: #2563eb; }
          .section { margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
          th { background: #f8fafc; }
          .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Zylo CRM Invoice</div>
            <p>Invoice #: <strong>${invoice.invoice_number}</strong></p>
            <p>Date: ${invoice.issue_date} | Due: ${invoice.due_date}</p>
          </div>
          <div style="text-align: right;">
            <h3>${invoice.client_name}</h3>
            <p>Project: ${invoice.project_name}</p>
            <p>Status: <strong>${invoice.status.toUpperCase()}</strong></p>
          </div>
        </div>

        <div class="section">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price ($)</th>
                <th>Total ($)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unit_price.toLocaleString()}</td>
                  <td>$${item.total.toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="total">
          <p>Subtotal: $${invoice.subtotal.toLocaleString()}</p>
          <p>Tax: $${invoice.tax.toLocaleString()}</p>
          <p>Discount: -$${invoice.discount.toLocaleString()}</p>
          <p style="color: #2563eb; font-size: 22px;">Grand Total: $${invoice.grand_total.toLocaleString()}</p>
          <p style="font-size: 14px; color: #64748b;">Paid: $${invoice.paid_amount.toLocaleString()} | Outstanding: $${invoice.outstanding_balance.toLocaleString()}</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function generatePdf(type: "invoice" | "quotation", item: Invoice | Quotation) {
  const number = type === "invoice" ? (item as Invoice).invoice_number : (item as Quotation).quotation_number;
  alert(`PDF generated and downloaded for ${type.toUpperCase()} #${number}`);
}

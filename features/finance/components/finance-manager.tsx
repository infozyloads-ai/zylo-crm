"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  FileText,
  FileCode2,
  CreditCard,
  BarChart3,
  RefreshCw,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  Invoice,
  Quotation,
  PaymentRecord,
  Expense,
  FinanceTab,
} from "../types/finance.types";
import {
  getInvoices,
  getQuotations,
  getPayments,
  getExpenses,
} from "../services/finance.service";
import { FinanceKpiCards } from "./finance-kpi-cards";
import { InvoiceListTable } from "./invoice-list-table";
import { InvoiceDialog } from "./invoice-dialog";
import { QuotationListTable } from "./quotation-list-table";
import { QuotationDialog } from "./quotation-dialog";
import { PaymentListTable } from "./payment-list-table";
import { PaymentDialog } from "./payment-dialog";
import { ExpenseListTable } from "./expense-list-table";
import { ExpenseDialog } from "./expense-dialog";
import { FinanceReportsView } from "./finance-reports-view";

export function FinanceManager() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("overview");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoiceToEdit, setSelectedInvoiceToEdit] = useState<Invoice | null>(null);

  const [quotationDialogOpen, setQuotationDialogOpen] = useState(false);
  const [selectedQuotationToEdit, setSelectedQuotationToEdit] = useState<Quotation | null>(null);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);

  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const loadAllFinanceData = useCallback(async () => {
    setLoading(true);
    const [invRes, quoRes, payRes, expRes] = await Promise.all([
      getInvoices(),
      getQuotations(),
      getPayments(),
      getExpenses(),
    ]);

    if (invRes.success) setInvoices(invRes.data);
    if (quoRes.success) setQuotations(quoRes.data);
    if (payRes.success) setPayments(payRes.data);
    if (expRes.success) setExpenses(expRes.data);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadAllFinanceData();
  }, [loadAllFinanceData]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Finance Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track client invoices, quotations, payment settlements, expenses, and profit reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={loadAllFinanceData}
            className="rounded-xl"
            title="Refresh finance data"
          >
            <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            onClick={() => {
              setSelectedInvoiceToEdit(null);
              setInvoiceDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Finance Navigation Tabs */}
      <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex flex-wrap items-center gap-1.5 border border-slate-200 dark:border-slate-800">
        <Button
          variant={activeTab === "overview" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("overview")}
          className="text-xs font-semibold rounded-xl"
        >
          <DollarSign className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
          Finance Overview
        </Button>

        <Button
          variant={activeTab === "invoices" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("invoices")}
          className="text-xs font-semibold rounded-xl"
        >
          <FileText className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
          Invoices ({invoices.length})
        </Button>

        <Button
          variant={activeTab === "quotations" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("quotations")}
          className="text-xs font-semibold rounded-xl"
        >
          <FileCode2 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
          Quotations ({quotations.length})
        </Button>

        <Button
          variant={activeTab === "payments" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("payments")}
          className="text-xs font-semibold rounded-xl"
        >
          <CreditCard className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
          Payments ({payments.length})
        </Button>

        <Button
          variant={activeTab === "expenses" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("expenses")}
          className="text-xs font-semibold rounded-xl"
        >
          <CreditCard className="h-3.5 w-3.5 mr-1.5 text-red-600" />
          Expenses ({expenses.length})
        </Button>

        <Button
          variant={activeTab === "reports" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("reports")}
          className="text-xs font-semibold rounded-xl"
        >
          <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
          Profit Reports
        </Button>
      </div>

      {/* KPI Cards (Always visible on overview) */}
      {(activeTab === "overview" || activeTab === "reports") && (
        <FinanceKpiCards invoices={invoices} expenses={expenses} />
      )}

      {/* Tab Content Views */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <InvoiceListTable
            invoices={invoices}
            onRefresh={loadAllFinanceData}
            onOpenCreate={() => {
              setSelectedInvoiceToEdit(null);
              setInvoiceDialogOpen(true);
            }}
            onOpenEdit={(inv) => {
              setSelectedInvoiceToEdit(inv);
              setInvoiceDialogOpen(true);
            }}
            onRecordPaymentClick={(inv) => {
              setSelectedInvoiceForPayment(inv);
              setPaymentDialogOpen(true);
            }}
          />
        </div>
      )}

      {activeTab === "invoices" && (
        <InvoiceListTable
          invoices={invoices}
          onRefresh={loadAllFinanceData}
          onOpenCreate={() => {
            setSelectedInvoiceToEdit(null);
            setInvoiceDialogOpen(true);
          }}
          onOpenEdit={(inv) => {
            setSelectedInvoiceToEdit(inv);
            setInvoiceDialogOpen(true);
          }}
          onRecordPaymentClick={(inv) => {
            setSelectedInvoiceForPayment(inv);
            setPaymentDialogOpen(true);
          }}
        />
      )}

      {activeTab === "quotations" && (
        <QuotationListTable
          quotations={quotations}
          onRefresh={loadAllFinanceData}
          onOpenCreate={() => {
            setSelectedQuotationToEdit(null);
            setQuotationDialogOpen(true);
          }}
        />
      )}

      {activeTab === "payments" && <PaymentListTable payments={payments} />}

      {activeTab === "expenses" && (
        <ExpenseListTable
          expenses={expenses}
          onRefresh={loadAllFinanceData}
          onOpenCreate={() => setExpenseDialogOpen(true)}
        />
      )}

      {activeTab === "reports" && (
        <FinanceReportsView invoices={invoices} expenses={expenses} />
      )}

      {/* Dialog Modals */}
      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoiceToEdit={selectedInvoiceToEdit}
        onSuccess={loadAllFinanceData}
      />

      <QuotationDialog
        open={quotationDialogOpen}
        onOpenChange={setQuotationDialogOpen}
        quotationToEdit={selectedQuotationToEdit}
        onSuccess={loadAllFinanceData}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        selectedInvoice={selectedInvoiceForPayment}
        onSuccess={loadAllFinanceData}
      />

      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        onSuccess={loadAllFinanceData}
      />
    </div>
  );
}

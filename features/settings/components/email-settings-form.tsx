"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Send, FileCode2, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { smtpSettingsSchema, type SmtpSettingsFormData } from "../schemas/settings-schema";
import {
  getSmtpSettings,
  updateSmtpSettings,
  sendTestEmail,
  getEmailTemplates,
} from "../services/settings.service";
import type { EmailTemplate } from "../types/settings.types";

export function EmailSettingsForm() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testEmailAddr, setTestEmailAddr] = useState("test@zylo.com");
  const [sendingTest, setSendingTest] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SmtpSettingsFormData>({
    resolver: zodResolver(smtpSettingsSchema),
  });

  useEffect(() => {
    loadSmtpAndTemplates();
  }, []);

  const loadSmtpAndTemplates = async () => {
    const [smtpRes, tplRes] = await Promise.all([getSmtpSettings(), getEmailTemplates()]);
    if (smtpRes.success) reset(smtpRes.data);
    if (tplRes.success) setTemplates(tplRes.data);
  };

  const onSubmit = async (data: SmtpSettingsFormData) => {
    const res = await updateSmtpSettings(data);
    if (res.success) toast.success(res.message);
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingTest(true);
    const res = await sendTestEmail(testEmailAddr);
    setSendingTest(false);

    if (res.success) {
      toast.success(res.message);
      setTestDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SMTP Server Configuration Form */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                SMTP Mail Server Configuration
              </CardTitle>
              <CardDescription>
                Configure outgoing transactional mail server for lead updates & invoices.
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTestDialogOpen(true)}
              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Send Test Email
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="host">SMTP Server Host *</Label>
                <Input id="host" placeholder="smtp.sendgrid.net" disabled={isSubmitting} {...register("host")} />
                {errors.host && <p className="text-xs text-red-500 font-medium">{errors.host.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port *</Label>
                <Input id="port" type="number" disabled={isSubmitting} {...register("port", { valueAsNumber: true })} />
                {errors.port && <p className="text-xs text-red-500 font-medium">{errors.port.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">SMTP Username *</Label>
                <Input id="username" disabled={isSubmitting} {...register("username")} />
                {errors.username && <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">SMTP Password / API Key</Label>
                <Input id="password" type="password" placeholder="••••••••••••" disabled={isSubmitting} {...register("password")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="security">Security Encryption</Label>
                <select
                  id="security"
                  className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  disabled={isSubmitting}
                  {...register("security")}
                >
                  <option value="TLS">TLS (Recommended)</option>
                  <option value="SSL">SSL</option>
                  <option value="None">None (Unencrypted)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender_email">Sender Email Address *</Label>
                <Input id="sender_email" type="email" disabled={isSubmitting} {...register("sender_email")} />
                {errors.sender_email && <p className="text-xs text-red-500 font-medium">{errors.sender_email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender_name">Sender Display Name *</Label>
                <Input id="sender_name" disabled={isSubmitting} {...register("sender_name")} />
                {errors.sender_name && <p className="text-xs text-red-500 font-medium">{errors.sender_name.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save SMTP Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Transactional Email Templates Editor */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileCode2 className="h-5 w-5 text-indigo-600" />
            Transactional Email Templates
          </CardTitle>
          <CardDescription>
            System email templates for automated customer outreach.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{tpl.name}</h4>
                  <span className="text-xs text-slate-400 font-mono">Template ID: {tpl.id}</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Subject: {tpl.subject}</div>
                <pre className="text-xs p-3 rounded-lg bg-white dark:bg-slate-950 font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                  {tpl.body}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Email Modal */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Send Test Transactional Email</DialogTitle>
            <DialogDescription>
              Verify your SMTP mail server settings by sending a test message.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendTest} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="test_email">Target Email Address</Label>
              <Input
                id="test_email"
                type="email"
                value={testEmailAddr}
                onChange={(e) => setTestEmailAddr(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setTestDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={sendingTest} className="bg-blue-600 hover:bg-blue-700 text-white">
                {sendingTest ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Test Email
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { orgSettingsSchema, type OrgSettingsFormData } from "../schemas/settings-schema";
import { getOrganizationSettings, updateOrganizationSettings } from "../services/settings.service";

export function OrgSettingsForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrgSettingsFormData>({
    resolver: zodResolver(orgSettingsSchema),
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await getOrganizationSettings();
    if (res.success && res.data) {
      reset({
        company_name: res.data.company_name,
        logo_url: res.data.logo_url || "",
        favicon_url: res.data.favicon_url || "",
        business_email: res.data.business_email,
        phone: res.data.phone || "",
        website: res.data.website || "",
        address: res.data.address || "",
        tax_number: res.data.tax_number || "",
        currency: res.data.currency,
        timezone: res.data.timezone,
        language: res.data.language,
        date_format: res.data.date_format,
      });
    }
  };

  const onSubmit = async (data: OrgSettingsFormData) => {
    const res = await updateOrganizationSettings(data);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error("Failed to save organization settings");
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Organization & Company Settings
        </CardTitle>
        <CardDescription>
          Configure company branding, contact details, currency, timezone, and localization formats.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Name, Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input id="company_name" disabled={isSubmitting} {...register("company_name")} />
              {errors.company_name && (
                <p className="text-xs text-red-500 font-medium">{errors.company_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_email">Business Email *</Label>
              <Input id="business_email" type="email" disabled={isSubmitting} {...register("business_email")} />
              {errors.business_email && (
                <p className="text-xs text-red-500 font-medium">{errors.business_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" disabled={isSubmitting} {...register("phone")} />
            </div>
          </div>

          {/* Logo URL, Favicon URL & Website */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Company Logo URL</Label>
              <Input id="logo_url" placeholder="https://..." disabled={isSubmitting} {...register("logo_url")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favicon_url">Favicon URL</Label>
              <Input id="favicon_url" placeholder="https://..." disabled={isSubmitting} {...register("favicon_url")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website Domain</Label>
              <Input id="website" placeholder="https://zylo.com" disabled={isSubmitting} {...register("website")} />
            </div>
          </div>

          {/* Address & Tax Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Physical Address</Label>
              <Input id="address" disabled={isSubmitting} {...register("address")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_number">Tax / VAT ID Number</Label>
              <Input id="tax_number" disabled={isSubmitting} {...register("tax_number")} />
            </div>
          </div>

          {/* Currency, Timezone, Language & Date Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <select
                id="currency"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("currency")}
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="INR (₹)">INR (₹)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone *</Label>
              <select
                id="timezone"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("timezone")}
              >
                <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time)</option>
                <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                <option value="UTC+00:00 (London)">UTC+00:00 (London)</option>
                <option value="UTC+05:30 (India)">UTC+05:30 (India)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <select
                id="language"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("language")}
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_format">Date Format *</Label>
              <select
                id="date_format"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("date_format")}
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Organization Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

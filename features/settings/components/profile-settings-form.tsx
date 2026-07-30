"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Lock, ShieldCheck, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  profileSettingsSchema,
  passwordChangeSchema,
  type ProfileSettingsFormData,
  type PasswordChangeFormData,
} from "../schemas/settings-schema";
import {
  getProfileSettings,
  updateProfileSettings,
  changeUserPassword,
} from "../services/settings.service";

export function ProfileSettingsForm() {
  const [twoFactor, setTwoFactor] = useState(true);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: errProfile, isSubmitting: subProfile },
  } = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
  });

  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: errPass, isSubmitting: subPass },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getProfileSettings();
    if (res.success && res.data) {
      resetProfile({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || "",
        profile_photo: res.data.profile_photo || "",
        two_factor_enabled: res.data.two_factor_enabled,
      });
      setTwoFactor(res.data.two_factor_enabled);
    }
  };

  const onSaveProfile = async (data: ProfileSettingsFormData) => {
    const res = await updateProfileSettings({ ...data, two_factor_enabled: twoFactor });
    if (res.success) {
      toast.success("User profile settings updated");
    } else {
      toast.error("Failed to update profile settings");
    }
  };

  const onChangePassword = async (data: PasswordChangeFormData) => {
    const res = await changeUserPassword(data);
    if (res.success) {
      toast.success("Password changed successfully");
      resetPass({ current_password: "", new_password: "", confirm_password: "" });
    } else {
      toast.error("Password update failed", { description: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            User Account & Profile Settings
          </CardTitle>
          <CardDescription>
            Update personal account details, avatar photo, and security settings.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" disabled={subProfile} {...regProfile("name")} />
                {errProfile.name && (
                  <p className="text-xs text-red-500 font-medium">{errProfile.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" disabled={subProfile} {...regProfile("email")} />
                {errProfile.email && (
                  <p className="text-xs text-red-500 font-medium">{errProfile.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" disabled={subProfile} {...regProfile("phone")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile_photo">Profile Photo URL</Label>
                <Input id="profile_photo" placeholder="https://..." disabled={subProfile} {...regProfile("profile_photo")} />
              </div>
            </div>

            {/* 2FA Security Status */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Two-Factor Authentication (2FA)
                </div>
                <p className="text-xs text-slate-500">
                  Protect your account with authenticator codes & SMS fallback.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={twoFactor ? "secondary" : "outline"} className={twoFactor ? "bg-emerald-50 text-emerald-700" : ""}>
                  {twoFactor ? "Enabled & Active" : "Disabled"}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className="text-xs rounded-xl"
                >
                  {twoFactor ? "Disable 2FA" : "Enable 2FA"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={subProfile} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                {subProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Form */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            Security & Password Change
          </CardTitle>
          <CardDescription>
            Update your account password securely via Supabase Auth.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="current_password">Current Password *</Label>
              <Input id="current_password" type="password" disabled={subPass} {...regPass("current_password")} />
              {errPass.current_password && (
                <p className="text-xs text-red-500 font-medium">{errPass.current_password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password *</Label>
                <Input id="new_password" type="password" disabled={subPass} {...regPass("new_password")} />
                {errPass.new_password && (
                  <p className="text-xs text-red-500 font-medium">{errPass.new_password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password *</Label>
                <Input id="confirm_password" type="password" disabled={subPass} {...regPass("confirm_password")} />
                {errPass.confirm_password && (
                  <p className="text-xs text-red-500 font-medium">{errPass.confirm_password.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={subPass} variant="outline" className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50">
                {subPass ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

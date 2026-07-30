"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas/forgot-password-schema";
import { resetPassword } from "../services/auth.service";

export function ForgotPasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setErrorMessage(null);
    setIsSuccess(false);

    const res = await resetPassword(data.email);

    if (!res.success) {
      setErrorMessage(res.message);
      toast.error("Failed to send reset link", {
        description: res.message,
      });
      return;
    }

    setIsSuccess(true);
    toast.success("Reset link sent!", {
      description: res.message,
    });
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
        <p className="text-slate-500">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {errorMessage && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <p className="text-sm text-green-600 font-medium">
              Password reset link has been dispatched to your email address.
            </p>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }), "w-full h-11 rounded-xl")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 font-semibold rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-blue-600 hover:underline font-medium"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

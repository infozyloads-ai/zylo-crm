"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginSchema, type LoginSchema } from "../schemas/login-schema";
import { login } from "../services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setErrorMessage(null);

    const response = await login(data.identifier, data.password);

    if (!response.success) {
      setErrorMessage(response.message);
      toast.error("Authentication failed", {
        description: response.message,
      });
      return;
    }

    toast.success("Welcome back!", {
      description: "You have signed in successfully.",
    });

    router.push("/dashboard");
  };

  return (
    <Card className="w-full shadow-2xl border border-slate-200 dark:border-slate-800 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
      <CardHeader className="space-y-3 pb-4">
        {/* Mobile Logo Branding */}
        <div className="flex items-center gap-3 lg:hidden mb-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600/20 p-1 border border-blue-500/30 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Zylo CRM Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">
            Zylo CRM
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Sign In
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter credentials to access your CRM workspace
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
            <Lock className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {errorMessage && (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertDescription className="text-xs font-medium">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Identifier Input */}
          <div className="space-y-1.5">
            <Label htmlFor="identifier" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email or Phone Number
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="e.g. admin@zyload.com"
              disabled={isSubmitting}
              className="h-10 text-sm rounded-xl"
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-xs text-red-500 font-medium">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <Label htmlFor="password font-bold text-xs">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="pr-10 h-10 text-sm rounded-xl"
                disabled={isSubmitting}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center space-x-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    className="rounded-md"
                  />
                )}
              />
              <Label
                htmlFor="rememberMe"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            <Link
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-700 font-semibold text-xs"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 font-bold text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
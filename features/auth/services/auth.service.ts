import { supabase } from "@/lib/supabase/client";
import type { AuthResponse } from "../types/auth.types";

export async function login(
  identifier: string,
  password: string
): Promise<AuthResponse> {
  try {
    const isEmail = identifier.includes("@");
    const credentials = isEmail
      ? { email: identifier, password }
      : { phone: identifier, password };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (data.session?.access_token && typeof window !== "undefined") {
      document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=604800; SameSite=Lax`;
    }

    return {
      success: true,
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email ?? "",
        phone: data.user.phone ?? "",
      },
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Password reset instructions have been sent to your email.",
    };
  } catch {
    return {
      success: false,
      message: "Unable to process password reset. Please try again.",
    };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (typeof window !== "undefined") {
      document.cookie =
        "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Logged out successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Failed to sign out. Please try again.",
    };
  }
}
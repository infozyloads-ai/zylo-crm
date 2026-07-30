import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,}$/;

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or phone number is required")
    .refine(
      (val) => emailRegex.test(val) || phoneRegex.test(val),
      "Please enter a valid email address or phone number"
    ),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  rememberMe: z.boolean(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
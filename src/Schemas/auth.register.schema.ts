import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  }).strict().refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

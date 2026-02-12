import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }).strict(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
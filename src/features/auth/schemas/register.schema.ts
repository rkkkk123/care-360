import { z } from "zod";

export const registerSchema = z.object({
  role: z.enum(["patient", "doctor", "pharmacy"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // path of error
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

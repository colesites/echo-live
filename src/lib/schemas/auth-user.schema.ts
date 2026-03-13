import { z } from "zod";

export const authUserSchema = z.object({
  fullName: z.string().min(1).optional(),
  primaryEmail: z.string().email().optional(),
  imageUrl: z.string().url().optional(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

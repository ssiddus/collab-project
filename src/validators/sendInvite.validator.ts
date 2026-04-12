import { z } from "zod";

export const sendInviteSchema = z.object({
  email: z.string().trim().email("Invalid email address")
})


export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Invite token is required"),
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
})


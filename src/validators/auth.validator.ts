import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organisationName: z.string().trim().min(1, "Organisation name is required")
})


export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required")
})

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"])
})

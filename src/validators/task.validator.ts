import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string().uuid("Invalid project ID"),
  assignedTo: z.string().uuid("Invalid user Id").optional()
})

export const updateTaskSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  assignedTo: z.string().email().optional()
})



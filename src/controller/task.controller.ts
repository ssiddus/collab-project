import { createTaskService } from "../services/task.service";
import { AuthRequest } from "../types/auth.types";
import { Response } from "express";

export const createTask = async (req: AuthRequest, res: Response) => {

  try {
    const { title, description, projectId } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({
        message: "Required Fields are missing"
      })
    }
    const result = await createTaskService(req.user!, {
      title,
      description,
      projectId
    })
    return res.status(201).json({
      message: "Task created Successfully",
      data: result
    })

  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Something went wrong"
    })
  }
}



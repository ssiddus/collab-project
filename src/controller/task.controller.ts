import { createTaskService, getTasksByOrgService, getTaskByIdService, updateTaskService, deleteTaskService } from "../services/task.service";
import { AuthRequest } from "../types/auth.types";
import { NextFunction, Response } from "express";

export const createTaskController = async (req: AuthRequest, res: Response, next: NextFunction) => {

  try {
    const { title, description, projectId, assignedTo } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({
        message: "Required Fields are missing"
      })
    }
    const result = await createTaskService(req.user!, {
      title,
      description,
      projectId,
      assignedTo
    })
    return res.status(201).json({
      message: "Task created Successfully",
      data: result
    })

  } catch (error: any) {
    next(error)
  }
}


export const getTasksByOrgController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await getTasksByOrgService(req.user!.orgId, page, limit);

    return res.status(200).json({ message: "Tasks fetched Successfully", data: result })

  } catch (error: any) {
    next(error)
  }
}

export const getTaskByIdController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id as string;
    const orgId = req.user!.orgId;
    const result = await getTaskByIdService(taskId, orgId);
    return res.status(200).json({
      message: "Task fetched Successfully",
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

export const updateTaskController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const taskId = req.params.id as string;
    if (!data.title && !data.description && !data.status && !data.assignedTo) {
      return res.status(400).json({
        message: "At least one field is required to update"
      })
    }
    const result = await updateTaskService(taskId, req.user!, data);
    return res.status(200).json({
      message: "Task Updated Successfully",
      data: result
    })

  } catch (error: any) {
    next(error)
  }
}

export const deleteTaskController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id as string;
    await deleteTaskService(taskId, req.user!);

    return res.status(200).json({
      message: "Task Deleted Successfully",
    })
  } catch (error: any) {
    next(error)
  }

}

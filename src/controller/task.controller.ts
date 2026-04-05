import { createTaskService, getTasksByOrgService, getTaskByIdService, updateTaskService, deleteTaskService } from "../services/task.service";
import { AuthRequest } from "../types/auth.types";
import { Response } from "express";

export const createTaskController = async (req: AuthRequest, res: Response) => {

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


export const getTasksByOrgController = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getTasksByOrgService(req.user!.orgId);

    return res.status(200).json({ message: "Tasks fetched Successfully", data: result })

  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Something went wrong"
    })
  }
}

export const getTaskByIdController = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const orgId = req.user!.orgId;
    const result = await getTaskByIdService(taskId, orgId);
    return res.status(200).json({
      message: "Task fetched Successfully",
      data: result
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || " Something went wrong"
    })
  }
}

export const updateTaskController = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const orgId = req.user!.orgId;
    const taskId = req.params.id as string;
    if (!data.title && !data.description && !data.status) {
      return res.status(400).json({
        message: "At least one field is required to update"
      })
    }
    const result = await updateTaskService(taskId, orgId, data);
    return res.status(200).json({
      message: "Task Updated Successfully",
      data: result
    })

  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Something went wrong"
    })
  }
}

export const deleteTaskController = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const orgId = req.user!.orgId;
    const result = await deleteTaskService(taskId, orgId);

    return res.status(200).json({
      message: "Task Deleted Successfully",
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Something went wrong"
    })
  }

}

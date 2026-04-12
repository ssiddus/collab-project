import { createTaskRepository, getTasksByOrgRepository, getTaskByIdRepository, updateTaskRepository, deleteTaskRepository } from "../repositories/task.repository"
import { UpdateTaskInput } from "../repositories/task.repository"
import { getUserByUserId } from "../repositories/user.repository"
import { TokenPayload } from "../types/auth.types"
import { getProjectByIdService } from "./project.service"
import { StatusTask } from "@prisma/client"
import { AppError } from "../middleware/error.middleware"

type CreateTaskInput = {
  title: string
  description?: string
  projectId: string
  assignedTo?: string
}

export const createTaskService = async (user: TokenPayload, data: CreateTaskInput) => {
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new AppError("Unauthorized: Only Owner or Admin can create tasks", 403)
  }

  let assignedToId: string | undefined
  const project = await getProjectByIdService(data.projectId, user.orgId);
  if (!project) {
    throw new AppError("Project not Found", 404)
  }
  if (data.assignedTo) {
    const assignee = await getUserByUserId(user.orgId, data.assignedTo);
    if (!assignee) {
      throw new AppError("Assigned User not found in your organization", 404)
    }
    assignedToId = assignee.id
  }
  return createTaskRepository({
    title: data.title,
    description: data.description,
    projectId: data.projectId,
    createdBy: user.userId,
    assignedTo: assignedToId
  });
}

export const getTasksByOrgService = async (orgId: string, page: number, limit: number) => {
  return getTasksByOrgRepository(orgId, page, limit);
}

export const getTaskByIdService = async (taskId: string, orgId: string) => {
  if (!taskId) {
    throw new AppError("Task Id is required not Found", 404)
  }
  const task = await getTaskByIdRepository(taskId, orgId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;

}


export const updateTaskService = async (taskId: string, user: TokenPayload, data: UpdateTaskInput) => {
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new AppError("Unauthorized: Only Owner or Admin can update tasks", 403)
  }

  await getTaskByIdService(taskId, user.orgId);

  if (data.status && !Object.values(StatusTask).includes(data.status)) {
    throw new AppError("Invalid Status value", 400)
  }

  if (data.status) {
    data.status = StatusTask[data.status as keyof typeof StatusTask]
  }
  return updateTaskRepository(taskId, data);

}

export const deleteTaskService = async (taskId: string, user: TokenPayload) => {
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new AppError("Unauthorized: Only Owner or Admin can delete tasks", 403)
  }


  await getTaskByIdService(taskId, user.orgId)

  return deleteTaskRepository(taskId);
}

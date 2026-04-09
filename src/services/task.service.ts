import { createTaskRepository, getTasksByOrgRepository, getTaskByIdRepository, updateTaskRepository, deleteTaskRepository } from "../repositories/task.repository"
import { UpdateTaskInput } from "../repositories/task.repository"
import { getUserByUserId } from "../repositories/user.repository"
import { TokenPayload } from "../types/auth.types"
import { getProjectByIdService } from "./project.service"
import { StatusTask } from "@prisma/client"

type CreateTaskInput = {
  title: string
  description?: string
  projectId: string
  assignedTo?: string
}

export const createTaskService = async (user: TokenPayload, data: CreateTaskInput) => {
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new Error("Unauthorized: Only Owner or Admin can create tasks")
  }

  let assignedToId: string | undefined
  const project = await getProjectByIdService(data.projectId, user.orgId);
  if (!project) {
    throw new Error("Project not Found or unauthorized")
  }
  if (data.assignedTo) {
    const assignee = await getUserByUserId(user.orgId, data.assignedTo);
    if (!assignee) {
      throw new Error("Assigned User not found in your organization")
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
    throw new Error("Task Id is required not Found")
  }
  const task = await getTaskByIdRepository(taskId, orgId);
  if (!task) {
    throw new Error("Task not found or unauthorized");
  }

  return task;

}


export const updateTaskService = async (taskId: string, user: TokenPayload, data: UpdateTaskInput) => {
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new Error("Unauthorized: Only Owner or Admin can update tasks")
  }

  await getTaskByIdService(taskId, user.orgId);

  if (data.status && !Object.values(StatusTask).includes(data.status)) {
    throw new Error("Invalid Status value")
  }

  if (data.status) {
    data.status = StatusTask[data.status as keyof typeof StatusTask]
  }
  return updateTaskRepository(taskId, data);

}

export const deleteTaskService = async (taskId: string, user: TokenPayload) => {
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new Error("Unauthorized: Only Owner or Admin can delete tasks")
  }

  if (!taskId) {
    throw new Error("Task Id is required not Found")
  }

  await getTaskByIdService(taskId, user.orgId)

  return deleteTaskRepository(taskId);
}

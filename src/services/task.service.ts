import { createTaskRepository, getTasksByOrgRepository, getTaskByIdRepository, updateTaskRepository, deleteTaskRepository } from "../repositories/task.repository"
import { UpdateTaskInput } from "../repositories/task.repository"
import { TokenPayload } from "../types/auth.types"
import { getProjectByIdService } from "./project.service"
import { StatusTask } from "@prisma/client"

type CreateTaskInput = {
  title: string
  description?: string
  projectId: string

}

export const createTaskService = async (user: TokenPayload, data: CreateTaskInput) => {
  const project = await getProjectByIdService(data.projectId, user.orgId);
  if (!project) {
    throw new Error("Project not Found or unauthorized")
  }

  return createTaskRepository({
    title: data.title,
    description: data.description,
    projectId: data.projectId,
    createdBy: user.userId
  });
}

export const getTasksByOrgService = async (orgId: string) => {
  return getTasksByOrgRepository(orgId);
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


export const updateTaskService = async (taskId: string, orgId: string, data: UpdateTaskInput) => {
  await getTaskByIdService(taskId, orgId);
  const validStatusOptions = ["TODO", "INPROGRESS", "COMPLETED"];

  if (data.status && !validStatusOptions.includes(data.status)) {
    throw new Error("Invalid Status value")
  }

  data.status = StatusTask[data.status as keyof typeof StatusTask]

  return updateTaskRepository(taskId, data);

}

export const deleteTaskService = async (taskId: string, orgId: string) => {
  if (!taskId) {
    throw new Error("Task Id is required not Found")
  }
  await getTaskByIdService(taskId, orgId)

  return deleteTaskRepository(taskId);
}

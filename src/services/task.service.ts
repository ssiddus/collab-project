import { createTask } from "../repositories/task.repository"
import { TokenPayload } from "../types/auth.types"
import { getProjectByIdService } from "./project.service"

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

  return createTask({
    title: data.title,
    description: data.description,
    projectId: data.projectId,
    createdBy: user.userId
  });
}

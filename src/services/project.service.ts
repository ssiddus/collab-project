import { getProjectById, getProjects, ProjectInput } from "../repositories/project.repository"
import { AppError } from "../middleware/error.middleware"
import { TokenPayload } from "../types/auth.types";
import { createProject } from "../repositories/project.repository";
import { Project } from "@prisma/client";

export const createProjectService = async (data: ProjectInput, user: TokenPayload) => {
  const { name, description, status } = data;
  const { orgId, userId } = user;
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new AppError("Unauthorized: Only Owner or Admin can create project", 403)
  }

  return createProject({
    name,
    description,
    status,
    orgId,
    createdBy: userId
  })

}

export const getProjectService = async (user: TokenPayload, page: number, limit: number) => {
  if (!user.orgId) {
    throw new AppError("Invalid request", 401)
  }
  return getProjects(user.orgId, page, limit);
}

export const getProjectByIdService = async (id: string, orgId: string): Promise<Project | null> => {
  if (!id || !orgId) {
    throw new AppError("Invalid request", 400)
  }
  return getProjectById(id, orgId);
}


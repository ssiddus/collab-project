import { getProjectById, getProjects, ProjectInput } from "../repositories/project.repository"
import { TokenPayload } from "../types/auth.types";
import { createProject } from "../repositories/project.repository";
import { Project } from "@prisma/client";

export const createProjectService = async (data: ProjectInput, user: TokenPayload) => {
  const { name, description, status } = data;
  const { orgId, userId } = user;
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new Error("Unauthorized: Only Owner or Admin can create project")
  }
  if (!name || !status) {
    throw new Error("Missing required fields!");
  }

  return createProject({
    name,
    description,
    status,
    orgId,
    createdBy: userId
  })

}

export const getProjectService = async (user: TokenPayload) => {
  if (!user.orgId) {
    throw new Error("Invalid request")
  }
  return getProjects(user.orgId);
}

export const getProjectByIdService = async (id: string, orgId: string): Promise<Project | null> => {
  if (!id || !orgId) {
    throw new Error("Invalid request")
  }
  return getProjectById(id, orgId);
}


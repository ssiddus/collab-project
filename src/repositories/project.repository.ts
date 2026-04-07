import prisma from "../utils/prisma";
import { Status, Project } from "@prisma/client";

export interface ProjectInput {
  name: string,
  description: string,
  status: Status,
  orgId: string,
  createdBy: string
}

export const createProject = async (input: ProjectInput) => {
  return prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      status: input.status,
      orgId: input.orgId,
      createdBy: input.createdBy
    }
  })
}
export const getProjects = async (orgId: string) => {
  return prisma.project.findMany({
    where: { orgId }
  })
}

export const getProjectById = async (id: string, orgId: string): Promise<Project | null> => {

  return prisma.project.findFirst({
    where: {
      id,
      orgId
    }
  })
}

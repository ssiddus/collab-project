import { Task } from '@prisma/client'
import prisma from '../utils/prisma'

type TaskInput = {
  title: string
  description?: string
  projectId: string
  createdBy: string
}
export const createTask = async (data: TaskInput): Promise<Task> => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      createdBy: data.createdBy
    }
  })
}

export const getTasksByOrg = async (orgId: string) => {
  return prisma.task.findMany({
    where: {
      project: {
        orgId: orgId
      }
    }
  })
}

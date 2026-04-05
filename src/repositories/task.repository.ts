import { StatusTask, Task } from '@prisma/client'
import prisma from '../utils/prisma'

type TaskInput = {
  title: string
  description?: string
  projectId: string
  createdBy: string
}

export type UpdateTaskInput = {
  title?: string,
  description?: string,
  status?: StatusTask,
}
export const createTaskRepository = async (data: TaskInput): Promise<Task> => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      createdBy: data.createdBy
    }
  })
}

export const getTasksByOrgRepository = async (orgId: string): Promise<Task[]> => {
  return prisma.task.findMany({
    where: {
      project: {
        orgId: orgId
      }
    }
  })
}

export const getTaskByIdRepository = async (taskId: string, orgId: string): Promise<Task | null> => {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        orgId: orgId
      }
    }
  })
}

export const updateTaskRepository = async (taskId: string, data: UpdateTaskInput): Promise<Task> => {
  return prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      title: data.title,
      description: data.description,
      status: data.status
    }
  })

}

export const deleteTaskRepository = async (taskId: string) => {
  return prisma.task.delete({
    where: {
      id: taskId
    }
  })
}

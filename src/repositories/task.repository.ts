import { StatusTask, Task } from '@prisma/client'
import prisma from '../utils/prisma'

type TaskInput = {
  title: string,
  description?: string,
  projectId: string,
  createdBy: string,
  assignedTo?: string
}

export type UpdateTaskInput = {
  title?: string,
  description?: string,
  status?: StatusTask,
  assignedTo?: string
}
export const createTaskRepository = async (data: TaskInput): Promise<Task> => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      createdBy: data.createdBy,
      assignedTo: data.assignedTo
    }
  })
}

export const getTasksByOrgRepository = async (orgId: string, page: number, limit: number): Promise<Task[]> => {
  return prisma.task.findMany({
    where: {
      project: {
        orgId: orgId
      }
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        }
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
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
      status: data.status,
      assignedTo: data.assignedTo
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

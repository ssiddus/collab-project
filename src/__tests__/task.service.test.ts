import { createTaskService, deleteTaskService, getTaskByIdService, updateTaskService } from "../services/task.service"
import { createTaskRepository, deleteTaskRepository, getTaskByIdRepository, updateTaskRepository } from "../repositories/task.repository"
import { getUserByUserId } from "../repositories/user.repository"
import { getProjectByIdService } from "../services/project.service"

jest.mock("../repositories/task.repository")
jest.mock("../repositories/user.repository")
jest.mock("../services/project.service")

const mockCreateTask = createTaskRepository as jest.MockedFunction<typeof createTaskRepository>
const mockGetTaskById = getTaskByIdRepository as jest.MockedFunction<typeof getTaskByIdRepository>
const mockUpdateTask = updateTaskRepository as jest.MockedFunction<typeof updateTaskRepository>
const mockDeleteTask = deleteTaskRepository as jest.MockedFunction<typeof deleteTaskRepository>
const mockGetUserById = getUserByUserId as jest.MockedFunction<typeof getUserByUserId>
const mockGetProjectById = getProjectByIdService as jest.MockedFunction<typeof getProjectByIdService>

const ownerUser = { userId: "user-1", orgId: "org-1", role: "OWNER" as any }
const memberUser = { userId: "user-2", orgId: "org-1", role: "MEMBER" as any }

describe("createTaskService", () => {
  it("should throw 403 if user is MEMBER", async () => {
    await expect(
      createTaskService(memberUser, { title: "Task", projectId: "proj-1" })
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it("should throw 404 if project not found", async () => {
    mockGetProjectById.mockResolvedValue(null)
    await expect(
      createTaskService(ownerUser, { title: "Task", projectId: "invalid-proj" })
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it("should throw 404 if assignee not in org", async () => {
    mockGetProjectById.mockResolvedValue({ id: "proj-1" } as any)
    mockGetUserById.mockResolvedValue(null)
    await expect(
      createTaskService(ownerUser, { title: "Task", projectId: "proj-1", assignedTo: "random@test.com" })
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it("should create task successfully", async () => {
    mockGetProjectById.mockResolvedValue({ id: "proj-1" } as any)
    mockCreateTask.mockResolvedValue({ id: "task-1", title: "Task" } as any)
    const result = await createTaskService(ownerUser, { title: "Task", projectId: "proj-1" })
    expect(result).toHaveProperty("id")
  })
})

describe("getTaskByIdService", () => {
  it("should throw 404 if task not found", async () => {
    mockGetTaskById.mockResolvedValue(null)
    await expect(
      getTaskByIdService("invalid-task", "org-1")
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it("should return task if found", async () => {
    mockGetTaskById.mockResolvedValue({ id: "task-1", title: "Task" } as any)
    const result = await getTaskByIdService("task-1", "org-1")
    expect(result).toHaveProperty("id")
  })
})

describe("updateTaskService", () => {
  it("should throw 403 if user is MEMBER", async () => {
    await expect(
      updateTaskService("task-1", memberUser, { title: "Updated" })
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it("should throw 400 if status is invalid", async () => {
    mockGetTaskById.mockResolvedValue({ id: "task-1" } as any)
    await expect(
      updateTaskService("task-1", ownerUser, { status: "INVALID" as any })
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it("should update task successfully", async () => {
    mockGetTaskById.mockResolvedValue({ id: "task-1" } as any)
    mockUpdateTask.mockResolvedValue({ id: "task-1", title: "Updated" } as any)
    const result = await updateTaskService("task-1", ownerUser, { title: "Updated" })
    expect(result).toHaveProperty("id")
  })
})

describe("deleteTaskService", () => {
  it("should throw 403 if user is MEMBER", async () => {
    await expect(
      deleteTaskService("task-1", memberUser)
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it("should delete task successfully", async () => {
    mockGetTaskById.mockResolvedValue({ id: "task-1" } as any)
    mockDeleteTask.mockResolvedValue({ id: "task-1" } as any)
    const result = await deleteTaskService("task-1", ownerUser)
    expect(result).toHaveProperty("id")
  })
})

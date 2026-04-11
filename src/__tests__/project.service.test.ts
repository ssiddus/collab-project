import { createProjectService, getProjectByIdService, getProjectService } from "../services/project.service"
import { createProject, getProjectById, getProjects } from "../repositories/project.repository"

jest.mock("../repositories/project.repository")

const mockCreateProject = createProject as jest.MockedFunction<typeof createProject>
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>
const mockGetProjectById = getProjectById as jest.MockedFunction<typeof getProjectById>

const ownerUser = { userId: "user-1", orgId: "org-1", role: "OWNER" as any }
const memberUser = { userId: "user-2", orgId: "org-1", role: "MEMBER" as any }

describe("createProjectService", () => {
  it("should throw 403 if user is MEMBER", async () => {
    await expect(
      createProjectService({ name: "Project", description: "desc", status: "ACTIVE" as any, orgId: "org-1", createdBy: "user-2" }, memberUser)
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it("should throw 400 if name is missing", async () => {
    await expect(
      createProjectService({ name: "", description: "desc", status: "ACTIVE" as any, orgId: "org-1", createdBy: "user-1" }, ownerUser)
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it("should create project successfully", async () => {
    const fakeProject = { id: "proj-1", name: "Test Project", orgId: "org-1" }
    mockCreateProject.mockResolvedValue(fakeProject as any)

    const result = await createProjectService(
      { name: "Test Project", description: "desc", status: "ACTIVE" as any, orgId: "org-1", createdBy: "user-1" },
      ownerUser
    )
    expect(result).toHaveProperty("id")
    expect(result.name).toBe("Test Project")
  })
})

describe("getProjectService", () => {
  it("should throw 401 if orgId is missing", async () => {
    await expect(
      getProjectService({ userId: "1", orgId: "", role: "OWNER" as any }, 1, 10)
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it("should return projects for valid org", async () => {
    mockGetProjects.mockResolvedValue([{ id: "proj-1", name: "Project" }] as any)
    const result = await getProjectService(ownerUser, 1, 10)
    expect(result).toHaveLength(1)
  })
})

describe("getProjectByIdService", () => {
  it("should throw 400 if id is missing", async () => {
    await expect(
      getProjectByIdService("", "org-1")
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it("should return project if found", async () => {
    mockGetProjectById.mockResolvedValue({ id: "proj-1", name: "Test" } as any)
    const result = await getProjectByIdService("proj-1", "org-1")
    expect(result).toHaveProperty("id")
  })
})

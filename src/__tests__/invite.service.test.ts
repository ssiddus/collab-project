import { sendInviteService, acceptInviteService } from "../services/sendInvite.service"
import { createInviteToken, findInviteToken, markTokenasUsed } from "../repositories/emailInvite.repository"
import { createMemberService } from "../services/auth.service"
import { sendInviteEmail } from "../utils/email/gmailEmail"

jest.mock("../repositories/emailInvite.repository")
jest.mock("../services/auth.service")
jest.mock("../utils/email")

const mockCreateInviteToken = createInviteToken as jest.MockedFunction<typeof createInviteToken>
const mockFindInviteToken = findInviteToken as jest.MockedFunction<typeof findInviteToken>
const mockMarkTokenAsUsed = markTokenasUsed as jest.MockedFunction<typeof markTokenasUsed>
const mockCreateMemberService = createMemberService as jest.MockedFunction<typeof createMemberService>
const mockSendInviteEmail = sendInviteEmail as jest.MockedFunction<typeof sendInviteEmail>

const ownerUser = { userId: "user-1", orgId: "org-1", role: "OWNER" as any }
const memberUser = { userId: "user-2", orgId: "org-1", role: "MEMBER" as any }

describe("sendInviteEmail", () => {
  it("should throw 403 if user is MEMBER", async () => {
    await expect(
      sendInviteService(memberUser, "test@user.com")
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it("should send invite successfully", async () => {
    mockCreateInviteToken.mockResolvedValue({ token: "testrandomtoken", email: "somerandom@mail.com" } as any)
    mockSendInviteEmail.mockResolvedValue(undefined)
    process.env.NODE_ENV = "development"

    const result = await sendInviteService(ownerUser, "test@mail.com")
    expect(result).toHaveProperty("message", "Invite sent successfully")
  })
})

describe("acceptInviteService", () => {
  it("should throw 401 if token is invalid", async () => {
    mockFindInviteToken.mockResolvedValue(null)
    await expect(
      acceptInviteService("bad-token", "John", "john@test.com", "pass")
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it("should throw 409 if token already used", async () => {
    mockFindInviteToken.mockResolvedValue({ token: "t", used: true, expiresAt: new Date(Date.now() + 10000), email: "john@test.com", orgId: "org-1" } as any)
    await expect(
      acceptInviteService("t", "John", "john@test.com", "pass")
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it("should throw 410 if token is expired", async () => {
    mockFindInviteToken.mockResolvedValue({ token: "t", used: false, expiresAt: new Date(Date.now() - 10000), email: "john@test.com", orgId: "org-1" } as any)
    await expect(
      acceptInviteService("t", "John", "john@test.com", "pass")
    ).rejects.toMatchObject({ statusCode: 410 })
  })

  it("should throw 403 if email does not match", async () => {
    mockFindInviteToken.mockResolvedValue({ token: "t", used: false, expiresAt: new Date(Date.now() + 10000), email: "other@test.com", orgId: "org-1" } as any)
    await expect(
      acceptInviteService("t", "John", "john@test.com", "pass")
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it("should create user and return token on success", async () => {
    mockFindInviteToken.mockResolvedValue({ token: "t", used: false, expiresAt: new Date(Date.now() + 10000), email: "john@test.com", orgId: "org-1" } as any)
    mockCreateMemberService.mockResolvedValue({ id: "user-1", name: "John", email: "john@test.com", orgId: "org-1", role: "MEMBER", passwordHash: "hash", createdAt: new Date(), updatedAt: new Date() } as any)
    mockMarkTokenAsUsed.mockResolvedValue(undefined)

    const result = await acceptInviteService("t", "John", "john@test.com", "pass")
    expect(result).toHaveProperty("token")
    expect(result.user).not.toHaveProperty("passwordHash")
  })
})

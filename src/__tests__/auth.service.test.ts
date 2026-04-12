import { registerUser, loginUser } from "../services/auth.service"
import { findUserByEmail, createUserWithOrg } from "../repositories/user.repository"
import { AppError } from "../middleware/error.middleware"
import bcrypt from "bcrypt"

//mocking the entire repository to avoid real DB calls

jest.mock("../repositories/user.repository")
jest.mock("bcrypt")

//typed mocks

const mockFindUserByEmail = findUserByEmail as jest.MockedFunction<typeof findUserByEmail>
const mockCreateUserWithOrg = createUserWithOrg as jest.MockedFunction<typeof createUserWithOrg>
const mockBcyrptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>
const mockBcryptCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>

describe("registerUser", () => {

   it("should throw 409 if email already exists", async () => {
    mockFindUserByEmail.mockResolvedValue({ id: "1", email: "test@test.com" } as any)

    await expect(
      registerUser({ name: "sid", email: "test@test.com", password: "1234", organisationName: "org" })
    ).rejects.toMatchObject({ statusCode: 409, message: "User already exists" })
  })

  it("should return token and user on success", async () => {
    mockFindUserByEmail.mockResolvedValue(null)
    mockBcyrptHash.mockResolvedValue("hashedPassword" as never)
    mockCreateUserWithOrg.mockResolvedValue({
      user: {
        id: "user-1",
        name: "sid",
        email: "sid@test.com",
        passwordHash: "hashedPassword",
        orgId: "org-1",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      org: { id: "org-1", name: "Org", createdAt: new Date() }
    } as any)

    const result = await registerUser({
      name: "sid",
      email: "sid@test.com",
      password: "password123",
      organisationName: "Test org"
    })

    expect(result).toHaveProperty("token")
    expect(result.user).not.toHaveProperty("passwordHash")
    expect(result.user.email).toBe("sid@test.com")

  })

})


describe("loginUser", () => {
  it("should throw 401 if email is not found", async () => {
    mockFindUserByEmail.mockResolvedValue(null)
    await expect(
      loginUser({ email: "wrong@test.com", password: "pass" })
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it("should throw 401 if password is wrong", async () => {
    mockFindUserByEmail.mockResolvedValue({
      id: "1",
      email: "test@test.com",
      passwordHash: "hashedpass"
    } as any)
    mockBcryptCompare.mockResolvedValue(false as never)

    await expect(
      loginUser({ email: "test@test.com", password: "wrongpass" })
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it("should return token and user on valid credentials", async () => {
    mockFindUserByEmail.mockResolvedValue({
      id: "user-1",
      name: "sid",
      email: "sid@test.com",
      passwordHash: "hashedpass",
      orgId: "org-1",
      role: "OWNER",
      createdAt: new Date(),
      updatedAt: new Date()
    } as any)
    mockBcryptCompare.mockResolvedValue(true as never)

    const result = await loginUser({ email: "sid@test.com", password: "password" })

    expect(result).toHaveProperty("token")
    expect(result.user).not.toHaveProperty("passwordHash")
  })
})



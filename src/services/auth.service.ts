import { findUserByEmail, createUserWithOrg, createUserInOrg, getMembersByOrgRepository, getUserByUserId, updateUserRoleInOrg } from "../repositories/user.repository";
import { AppError } from "../middleware/error.middleware"
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { Role } from "@prisma/client";
import { TokenPayload } from "../types/auth.types";


interface RegisterInput {
  name: string;
  email: string;
  password: string;
  organisationName: string;
}

interface LoginInput {
  email: string,
  password: string
}

// Inside registerUser() the order should be
// 1.extract fields from input
// 2. validate inputs
// 3. check email exists (repository)
// 4. Hash password
// 5. call respository to create org + user (transaction)
// 6. Generate JWT
// 7. Return result

export const registerUser = async (data: RegisterInput) => {
  const { name, email, password, organisationName } = data;

  // basic validation

  if (!name || !email || !password || !organisationName) {
    throw new AppError("Missing required fields", 400);
  }

  //checks email exists or not

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  // hash password

  const hashedPassword = await bcrypt.hash(password, 10);

  // create org + user through repo

  const result = await createUserWithOrg({
    name,
    email,
    passwordHash: hashedPassword,
    organizationName: organisationName
  });

  // generateing jwt token

  const { user } = result;
  const token = generateToken({
    userId: user.id,
    orgId: user.orgId,
    role: user.role
  });

  const { passwordHash, ...safeUser } = user;
  return { token, user: safeUser };
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError("Invalid Credentials", 401);
  }
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid Credentials", 401);
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new AppError("Invalid Credentials", 401)

  }
  const token = generateToken({
    userId: user.id,
    orgId: user.orgId,
    role: user.role
  })
  const { passwordHash, ...safeUser } = user;
  return { token, user: safeUser };
}


export const createMemberService = async (name: string, email: string, password: string, orgId: string) => {
  if (!name || !password || !email) {
    throw new AppError("Missing Required fields", 400);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User already exists", 409)
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return await createUserInOrg(name, email, passwordHash, orgId);

}

export const getMembersByOrgService = async (orgId: string) => {
  return await getMembersByOrgRepository(orgId);
}

export const updateMemberRoleService = async (user: TokenPayload, memberUserId: string, role: Role) => {
  if (user.role !== "OWNER") {
    throw new AppError("unauthorized: To perform this action", 403)
  }
  if (memberUserId === user.userId) {
    throw new AppError("Owner account detected, role update rejected", 403)
  }
  if (!role || role === "OWNER" || !memberUserId) {
    throw new AppError("Invalid inputs", 400)
  }

  const validUser = await getUserByUserId(user.orgId, memberUserId);

  if (!validUser) {
    throw new AppError("User not found", 404)
  }
  return await updateUserRoleInOrg(memberUserId, role)
}

import { findUserByEmail, createUserWithOrg, createUserInOrg, getMembersByOrgRepository, getUserByUserId, updateUserRoleInOrg } from "../repositories/user.repository";
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
    throw new Error("Missing required fields");
  }

  //checks email exists or not

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
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
    throw new Error("Invalid Credentials");
  }
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new Error("Invalid Credentials")

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
    throw new Error("Missing Required fields");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists")
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return await createUserInOrg(name, email, passwordHash, orgId);

}

export const getMembersByOrgService = async (orgId: string) => {
  return await getMembersByOrgRepository(orgId);
}

export const updateMemberRoleService = async (user: TokenPayload, memberUserId: string, role: Role) => {
  if (user.role !== "OWNER") {
    throw new Error("unauthorized: To perform this action")
  }
  if (memberUserId === user.userId) {
    throw new Error("Owner account detected, role update rejected")
  }
  if (!role || role === "OWNER" || !memberUserId) {
    throw new Error("Invalid inputs")
  }

  const validUser = await getUserByUserId(user.orgId, memberUserId);

  if (!validUser) {
    throw new Error("User not found")
  }
  return await updateUserRoleInOrg(user.orgId, memberUserId, role)
}

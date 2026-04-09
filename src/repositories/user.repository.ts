import prisma from '../utils/prisma'
import { Role } from "@prisma/client"

interface CreateUserWithOrgInput {
  name: string,
  email: string,
  passwordHash: string,
  organizationName: string
}

export const findUserByEmailAndOrg = async (email: string, orgId: string) => {
  return prisma.user.findFirst({
    where: {
      email,
      orgId
    }
  })
}

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const createUserWithOrg = async (data: CreateUserWithOrgInput) => {
  return prisma.$transaction(async (tx) => {

    const org = await tx.organization.create({
      data: {
        name: data.organizationName
      }
    });

    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: "OWNER",
        orgId: org.id
      }
    });

    return { user, org };
  });
};

export const createUserInOrg = async (name: string, email: string, passwordHash: string, orgId: string) => {
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "MEMBER",
      orgId
    }
  })
}

export const updateUserRoleInOrg = async (userId: string, role: Role) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role }
  })

}

export const getMembersByOrgRepository = async (orgId: string) => {
  return prisma.user.findMany({
    where: { orgId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })
}

export const getUserByUserId = async (orgId: string, userId: string) => {
  return prisma.user.findFirst({
    where: { id: userId, orgId: orgId },
    select: {
      id: true
    }
  })
}



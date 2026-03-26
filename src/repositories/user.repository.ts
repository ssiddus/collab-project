import prisma from '../utils/prisma'

interface CreateUserWithOrgInput{
  name: string,
  email: string,
  passwordHash: string,
  organizationName: string
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

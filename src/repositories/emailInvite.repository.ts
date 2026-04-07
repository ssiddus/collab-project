import crypto from 'crypto'
import prisma from '../utils/prisma'
import { InviteToken } from "@prisma/client"


export const createInviteToken = async (email: string, orgId: string, expiresAt: Date): Promise<InviteToken> => {
  const token = crypto.randomUUID() as string
  return prisma.inviteToken.create({
    data: {
      token,
      email,
      used: false,
      expiresAt,
      org: { connect: { id: orgId } },
      createdAt: new Date()
    }
  })
}

export const findInviteToken = async (token: string): Promise<InviteToken | null> => {
  return prisma.inviteToken.findUnique({
    where: { token }
  })
}

export const markTokenasUsed = async (token: string): Promise<void> => {
  await prisma.inviteToken.update({
    where: { token },
    data: { used: true }
  })
}


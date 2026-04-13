import { createInviteToken, findInviteToken, markTokenasUsed } from "../repositories/emailInvite.repository";
import { AppError } from "../middleware/error.middleware";
import { createMemberService } from "./auth.service";
import { TokenPayload } from "../types/auth.types";
import { generateToken } from "../utils/jwt";
import { sendInviteEmail } from "../utils/email/brevoEmail";


export const sendInviteService = async (user: TokenPayload, email: string) => {
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    throw new AppError("User is not allowed to send an organization invite", 403)
  }
  const expireAt = new Date(Date.now() + 1000 * 60 * 60) //valid till 1 hour

  const token = await createInviteToken(email, user.orgId, expireAt)

  if (!token) {
    throw new AppError("Something went wrong, Please retry again!", 500)
  }
  await sendInviteEmail(email, token.token);
  if (process.env.NODE_ENV === "development") {
    return { message: "Invite sent successfully", token }
  }
  return { message: "Invite sent successfully" }
}

export const acceptInviteService = async (token: string, name: string, email: string, password: string) => {

  const validToken = await findInviteToken(token);
  if (!validToken) {
    throw new AppError("Invalid Token, Please contact the Inviter", 401)
  }
  if (validToken.used) {
    throw new AppError("Token is already used, Please contact the Inviter", 409)
  }

  const currentTime = new Date();

  if (validToken.expiresAt < currentTime) {
    throw new AppError("Invite got expired, Please contact the Inviter", 410)
  }

  if (validToken.email !== email) {
    throw new AppError("This invite was not sent to this email", 403)
  }

  const user = await createMemberService(name, email, password, validToken.orgId);

  await markTokenasUsed(token);

  const jwtToken = generateToken({
    userId: user.id,
    orgId: user.orgId,
    role: user.role
  })

  const { passwordHash: _, ...safeUser } = user

  return { token: jwtToken, user: safeUser }
}

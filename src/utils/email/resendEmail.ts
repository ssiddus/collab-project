import { Resend } from "resend"
import logger from "../logger"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendInviteEmail = async (email: string, token: string) => {
  const inviteLink = `https://collab-api-k1or.onrender.com/invite/${token}`

  if (!process.env.RESEND_API_KEY) {
    logger.warn(`RESEND_API_KEY missing. Invite link: ${inviteLink}`)
    return
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "You've been invited to join an organisation",
      text: `You have been invited to join an organisation on Collab.

      Accept invite using this link:
      ${inviteLink}

      Or send a POST request to /org/accept-invite with:
     {
      "token": "${token}",
      "name": "Your Name",
      "email": "${email}",
      "password": "yourchosenpassword"
      }

    This token expires in 1 hour.`
    })
  } catch (err: any) {
    logger.error(`Email sending failed: ${err.message}. Invite link: ${inviteLink}`)
  }
}

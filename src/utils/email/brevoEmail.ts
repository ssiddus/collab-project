import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
})

export const sendInviteEmail = async (email: string, token: string) => {
  await transporter.sendMail({
    from: process.env.BREVO_USER,
    to: email,
    subject: "You've been invited to join an organisation on Collab",
    text: `You have been invited to join an organisation.

Your invite token: ${token}

Send a POST request to /org/accept-invite with:
{
  "token": "${token}",
  "name": "Your Name",
  "email": "${email}",
  "password": "yourchosenpassword"
}

This token expires in 1 hour.`
  })
}

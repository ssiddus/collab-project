import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendInviteEmail = async (email: string, token: string) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You've been invited to join an organisation",
    text: `You have been invited to join an organisation on Collab.

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

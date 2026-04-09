import { acceptInviteService, sendInviteService } from "../services/sendInvite.service";
import { AuthRequest } from "../types/auth.types";
import { NextFunction, Request, Response } from "express"


export const sendInviteController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await sendInviteService(req.user!, email)
    return res.status(200).json({
      message: "Email Invite sent successfully",
      data: result
    })

  } catch (error: any) {
    next(error)
  }
}

export const acceptInviteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, name, password, email } = req.body

    if (!token || !name || !password || !email) {
      return res.status(400).json({
        message: "Missing required fields"
      })
    }
    const result = await acceptInviteService(token, name, email, password);

    return res.status(201).json({
      message: "Account created successfully",
      data: result
    })

  } catch (error: any) {
    next(error)

  }

}

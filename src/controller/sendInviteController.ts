import { acceptInviteService, sendInviteService } from "../services/sendInvite.service";
import { AuthRequest } from "../types/auth.types";
import { NextFunction, Request, Response } from "express"


export const sendInviteController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await sendInviteService(req.user!, email)
    return res.status(200).json({
      message: "Invite created successfully",
      data: result
    })

  } catch (error: any) {
    next(error)
  }
}

export const acceptInviteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, name, password, email } = req.body

    const result = await acceptInviteService(token, name, email, password);

    return res.status(201).json({
      message: "Account created successfully",
      data: result
    })

  } catch (error: any) {
    next(error)

  }

}

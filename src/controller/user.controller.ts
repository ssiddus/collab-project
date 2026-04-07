import { getMembersByOrgService, updateMemberRoleService } from "../services/auth.service";
import { AuthRequest } from "../types/auth.types";
import { Response } from "express"
export const getMembersByOrgController = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user!.orgId;
    const result = await getMembersByOrgService(orgId);
    return res.status(200).json({
      message: "successfully fetched members details",
      data: result
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Something went wrong"
    })
  }
}

export const updateMemberRoleController = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!
    const userId = req.params.id as string;
    const { role } = req.body;

    const result = await updateMemberRoleService(user, userId, role);

    return res.status(201).json({
      message: "Member Role updated successfully",
      data: result
    })

  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Something went Wrong"
    })
  }
}


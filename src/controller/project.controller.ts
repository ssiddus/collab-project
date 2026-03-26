import { Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import { createProjectService, getProjectByIdService, getProjectService } from '../services/project.service';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createProjectService(req.body, req.user!)
    return res.status(201).json({
      message: "Project created Successfully",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, project creation unsuccessfull"
    })
  }
}

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getProjectService(req.user!);
    return res.status(200).json({
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, No Response"
    })

  }
}

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await getProjectByIdService(id, req.user?.orgId!);
    if (!result) {
      return res.status(404).json({
        message: "Project not Found"
      })
    }
    return res.status(200).json({
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, No Response"
    })
  }
}

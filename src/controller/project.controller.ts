import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import { createProjectService, getProjectByIdService, getProjectService } from '../services/project.service';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await createProjectService(req.body, req.user!)
    return res.status(201).json({
      message: "Project created Successfully",
      data: result
    });

  } catch (error) {
    next(error)
  }
}

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getProjectService(req.user!, page, limit);
    return res.status(200).json({
      data: result
    });
  } catch (error) {
    next(error)
  }
}

export const getProjectById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const result = await getProjectByIdService(id, req.user?.orgId!);
    
    return res.status(200).json({
      data: result
    });
  } catch (error) {
    next(error)
  }
}

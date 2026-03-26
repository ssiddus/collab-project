import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'

import { createProject, getProjectById, getProjects } from '../controller/project.controller'

const router = express.Router();
router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getProjects);
router.get('/:id', authMiddleware, getProjectById);

export default router;

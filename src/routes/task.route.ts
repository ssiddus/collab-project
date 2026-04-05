import express from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import { createTaskController, deleteTaskController, getTaskByIdController, getTasksByOrgController, updateTaskController } from '../controller/task.controller';


const router = express.Router()

router.post("/", authMiddleware, createTaskController);
router.get("/", authMiddleware, getTasksByOrgController);
router.get("/:id", authMiddleware, getTaskByIdController);
router.put("/:id", authMiddleware, updateTaskController);
router.delete("/:id", authMiddleware, deleteTaskController);

export default router; 

import express from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import { createTask } from '../controller/task.controller';


const router = express.Router()

router.post("/", authMiddleware, createTask)

export default router; 

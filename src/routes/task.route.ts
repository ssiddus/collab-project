import express from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import { createTaskController, deleteTaskController, getTaskByIdController, getTasksByOrgController, updateTaskController } from '../controller/task.controller';
import { validate } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';


const router = express.Router()

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task (OWNER/ADMIN only)
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, projectId]
 *             properties:
 *               title: { type: string, example: "Design homepage" }
 *               description: { type: string }
 *               projectId: { type: string, format: uuid }
 *               assignedTo: { type: string, example: "member@company.com" }
 *     responses:
 *       201: { description: Task created }
 *       403: { description: Unauthorized }
 */
router.post("/", authMiddleware, validate(createTaskSchema), createTaskController);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for your organisation
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: List of tasks }
 */
router.get("/", authMiddleware, getTasksByOrgController);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task details }
 *       404: { description: Task not found }
 */
router.get("/:id", authMiddleware, getTaskByIdController);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task (OWNER/ADMIN only)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
 *               assignedTo: { type: string }
 *     responses:
 *       200: { description: Task updated }
 */
router.put("/:id", authMiddleware, validate(updateTaskSchema), updateTaskController);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task (OWNER/ADMIN only)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task deleted }
 */
router.delete("/:id", authMiddleware, deleteTaskController);

export default router; 

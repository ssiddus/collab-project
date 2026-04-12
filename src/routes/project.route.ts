import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'

import { createProject, getProjectById, getProjects } from '../controller/project.controller'
import { validate } from '../middleware/validate.middleware';
import { createProjectSchema } from '../validators/project.validator';

const router = express.Router();

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project (OWNER/ADMIN only)
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, status]
 *             properties:
 *               name: { type: string, example: "Website Redesign" }
 *               description: { type: string, example: "Q2 overhaul" }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *     responses:
 *       201: { description: Project created }
 *       403: { description: Unauthorized }
 */
router.post('/', authMiddleware, validate(createProjectSchema), createProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects for your organisation
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: List of projects }
 */
router.get('/', authMiddleware, getProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Project details }
 *       404: { description: Project not found }
 */
router.get('/:id', authMiddleware, getProjectById);

export default router;

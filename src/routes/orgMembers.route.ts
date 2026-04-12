
import express from 'express'

import { authMiddleware } from '../middleware/auth.middleware'

import { sendInviteController, acceptInviteController } from '../controller/sendInviteController'
import { getMembersByOrgController, updateMemberRoleController } from '../controller/user.controller';
import { validate } from '../middleware/validate.middleware';
import { acceptInviteSchema, sendInviteSchema } from '../validators/sendInvite.validator';
import { updateUserRoleSchema } from '../validators/auth.validator';

const router = express.Router();

/**
 * @swagger
 * /org/invite:
 *   post:
 *     summary: Send email invite to join organisation (OWNER/ADMIN only)
 *     tags: [Organisation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, example: "teammate@company.com" }
 *     responses:
 *       200: { description: Invite sent }
 *       403: { description: Unauthorized }
 */
router.post("/invite", authMiddleware, validate(sendInviteSchema), sendInviteController);

/**
 * @swagger
 * /org/accept-invite:
 *   post:
 *     summary: Accept organisation invite and create account
 *     tags: [Organisation]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, name, email, password]
 *             properties:
 *               token: { type: string }
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Account created, returns JWT }
 */
router.post("/accept-invite", validate(acceptInviteSchema), acceptInviteController);

/**
 * @swagger
 * /org/members:
 *   get:
 *     summary: Get all members in your organisation
 *     tags: [Organisation]
 *     responses:
 *       200: { description: List of members }
 */
router.get("/members", authMiddleware, getMembersByOrgController);

/**
 * @swagger
 * /org/{id}/role:
 *   put:
 *     summary: Update member role (OWNER only)
 *     tags: [Organisation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [ADMIN, MEMBER] }
 *     responses:
 *       200: { description: Role updated }
 *       403: { description: Unauthorized }
 */
router.put("/:id/role", authMiddleware, validate(updateUserRoleSchema), updateMemberRoleController);

export default router;

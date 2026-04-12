import express from 'express';
import { login, register } from '../controller/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user and create organisation
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, organisationName]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@company.com" }
 *               password: { type: string, example: "password123" }
 *               organisationName: { type: string, example: "Acme Corp" }
 *     responses:
 *       201: { description: User registered successfully }
 *       409: { description: User already exists }
 */
router.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "john@company.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200: { description: Login successful, returns JWT token }
 *       401: { description: Invalid credentials }
 */
router.post("/login", validate(loginSchema), login);


export default router;


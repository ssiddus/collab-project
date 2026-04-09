
import express from 'express'

import { authMiddleware } from '../middleware/auth.middleware'

import { sendInviteController, acceptInviteController } from '../controller/sendInviteController'
import { getMembersByOrgController, updateMemberRoleController } from '../controller/user.controller';

const router = express.Router();

router.post("/invite", authMiddleware, sendInviteController);
router.post("/accept-invite", acceptInviteController);
router.get("/members", authMiddleware, getMembersByOrgController);
router.put("/:id/role", authMiddleware, updateMemberRoleController);

export default router;

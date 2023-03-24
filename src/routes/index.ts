import express from 'express'
import { loginController, registerController } from '../controllers/authController';
import { alterInvitation, createGroup, inviteGroup, myCreatedGroup, viewInvitation } from '../controllers/groupController';
import { authMiddleWare } from '../middleware/auth';


const router = express.Router()

// guest route
router.post("/register", registerController)
router.post("/login", loginController)

// auth route
router.post("/group/create", authMiddleWare, createGroup)
router.post("/group/invite-user", authMiddleWare, inviteGroup)
router.get("/group/my-created-groups", authMiddleWare, myCreatedGroup)
router.get("/group/invitation", authMiddleWare, viewInvitation)
router.post("/group/invitation/alter", authMiddleWare, alterInvitation)

export default router;
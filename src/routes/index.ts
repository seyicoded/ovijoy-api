import express from 'express'
import { loginController, registerController, requestPhoneOtpController, requestEmailOtpController, changePasswordController } from '../controllers/authController';
import { createCatCategory, deleteCatCategory, editCatCategory, getCatCategory } from '../controllers/catController';
import { alterInvitation, createGroup, inviteGroup, myCreatedGroup, viewInvitation } from '../controllers/groupController';
import { authAdminMiddleWare, authMiddleWare } from '../middleware/auth';

const router = express.Router()

// guest route

// **** otp **** 
router.post("/otp/email", requestEmailOtpController);
router.post("/otp/phone", requestPhoneOtpController);

// **** auth
router.post("/register", registerController)
router.post("/login", loginController)
router.post("/change-password", changePasswordController)

// generic

// **** category **** 
router.get("/category", getCatCategory)
// admin only **** 
router.post("/category", authAdminMiddleWare, createCatCategory)
router.delete("/category/:id", authAdminMiddleWare, deleteCatCategory)
router.patch("/category/:id", authAdminMiddleWare, editCatCategory)



// auth route::old
router.post("/group/create", authMiddleWare, createGroup)
router.post("/group/invite-user", authMiddleWare, inviteGroup)
router.get("/group/my-created-groups", authMiddleWare, myCreatedGroup)
router.get("/group/invitation", authMiddleWare, viewInvitation)
router.post("/group/invitation/alter", authMiddleWare, alterInvitation)

export default router;
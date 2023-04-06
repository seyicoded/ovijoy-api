import express from 'express'
import { loginController, registerController, requestPhoneOtpController, requestEmailOtpController, changePasswordController } from '../controllers/authController';
import { createCatCategory, deleteCatCategory, editCatCategory, getCatCategory } from '../controllers/catController';
import { toggleCommentController } from '../controllers/commentController';
import { alterInvitation, createGroup, inviteGroup, myCreatedGroup, viewInvitation } from '../controllers/groupController';
import { toggleLikeController } from '../controllers/likeController';
import { createPostController, deletePostController, editPostController, getPostController } from '../controllers/postController';
import { getProfileController, updateProfileController, updateProfileImageController } from '../controllers/profileController';
import { createStatusController, deleteStatusController, editStatusController, getStatusController } from '../controllers/statusController';
import { authAdminMiddleWare, authMiddleWare } from '../middleware/auth';
import { createGiveawayController, deleteGiveawayController, editGiveawayController, getGiveawayController } from '../controllers/giveawayController';

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

// **** category **** 
router.get("/post", authMiddleWare, getPostController) 
// admin only ****
router.post("/post", authAdminMiddleWare, createPostController) 
router.patch("/post", authAdminMiddleWare, editPostController) 
router.delete("/post/:id", authAdminMiddleWare, deletePostController) 

// **** status **** 
router.get("/status", authMiddleWare, getStatusController) 
// admin only ****
router.post("/status", authAdminMiddleWare, createStatusController) 
router.patch("/status", authAdminMiddleWare, editStatusController) 
router.delete("/status/:id", authAdminMiddleWare, deleteStatusController) 

// **** category **** 
router.get("/giveaway", authMiddleWare, getGiveawayController) 
// admin only ****
router.post("/giveaway", authAdminMiddleWare, createGiveawayController) 
router.patch("/giveaway", authAdminMiddleWare, editGiveawayController) 
router.delete("/giveaway/:id", authAdminMiddleWare, deleteGiveawayController) 


// generic
// **** likes **** 
router.post("/like/:type/:id", authMiddleWare, toggleLikeController) 

// **** comment **** 
router.post("/comment/:type/:id", authMiddleWare, toggleCommentController) 


// generic
// **** profile **** 
router.post("/profile/update", authMiddleWare, updateProfileImageController) 
router.get("/profile", authMiddleWare, getProfileController) 
router.patch("/profile", authMiddleWare, updateProfileController) 





// auth route::old
router.post("/group/create", authMiddleWare, createGroup)
router.post("/group/invite-user", authMiddleWare, inviteGroup)
router.get("/group/my-created-groups", authMiddleWare, myCreatedGroup)
router.get("/group/invitation", authMiddleWare, viewInvitation)
router.post("/group/invitation/alter", authMiddleWare, alterInvitation)

export default router;
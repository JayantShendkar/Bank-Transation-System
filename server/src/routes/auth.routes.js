const express=require("express")
const authController=require("../controllers/auth.controller")

const router=express.Router()

router.post("/register",authController.userRegisterController)

router.post("/login",authController.userLoginController)

router.post("/logout",authController.userLogoutController)

const authMiddleware=require("../middlewares/auth.middleware")

router.get("/profile", authMiddleware.authMiddleware, authController.userProfileController)

module.exports=router
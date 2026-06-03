import { Router } from "express"
import { authController } from "../controllers/authController"
import { authenticate } from "../middleware/authenticate"

const router = Router()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.post("/refresh", authController.refresh)
router.patch("/profile", authenticate, authController.updateProfile)

export default router
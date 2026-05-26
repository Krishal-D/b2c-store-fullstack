import { Router } from "express"
import { authenticate } from "../middleware/authenticate"
import { paymentController } from "../controllers/paymentController"

const router = Router()

router.post("/mock-checkout", authenticate, paymentController.mockCheckout)

export default router
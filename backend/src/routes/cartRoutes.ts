import { Router } from "express"
import { cartController } from "../controllers/cartController"
import { authenticate } from "../middleware/authenticate"

const router = Router()

router.get("/", authenticate, cartController.getCartItems)

router.post("/", authenticate, cartController.addCartItem)

router.patch("/:id", authenticate, cartController.updateCartItem)

router.delete("/:id", authenticate, cartController.deleteCartItem)

export default router
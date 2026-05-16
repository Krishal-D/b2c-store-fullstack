import { Router } from "express"
import { orderController } from "../controllers/orderController"
import { authenticate } from "../middleware/authenticate"
import { authorizeAdmin } from "../middleware/authorizeAdmin"

const router = Router()

router.post("/checkout", authenticate, orderController.checkout)

router.get("/", authenticate, orderController.getOrders)
router.get("/admin/all", authenticate, authorizeAdmin, orderController.getAllOrders)
router.get("/:id/items", authenticate, orderController.getOrderItems)

export default router
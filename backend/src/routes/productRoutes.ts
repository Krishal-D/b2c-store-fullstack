import { Router } from "express"
import { productController } from "../controllers/productController"
import { authenticate } from "../middleware/authenticate"
import { authorizeAdmin } from "../middleware/authorizeAdmin"

const router = Router()

router.get("/", productController.getProducts)
router.get("/:id", productController.getProductById)

router.post("/", authenticate, authorizeAdmin, productController.createProduct)
router.patch("/:id", authenticate, authorizeAdmin, productController.updateProduct)
router.delete("/:id", authenticate, authorizeAdmin, productController.deleteProduct)

export default router
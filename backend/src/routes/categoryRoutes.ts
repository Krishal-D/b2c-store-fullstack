import { Router } from "express"
import { categoryController } from "../controllers/categoryController"
import { authenticate } from "../middleware/authenticate"
import { authorizeAdmin } from "../middleware/authorizeAdmin"

const router = Router()

router.get("/", categoryController.getCategories)

router.post(
    "/",
    authenticate,
    authorizeAdmin,
    categoryController.createCategory
)

export default router
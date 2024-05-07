import { Router } from "express";
import * as ProductController from "../controllers/product.controllers.js";
import { userApiBlock } from "../utils/utils.js";
import uploadMiddleware from "../middleware/multer/multer.middleware.js";

const router = Router();
router.get("/", ProductController.getProductList);
router.get("/:id", ProductController.getProductById);
router.delete("/:id", userApiBlock(), ProductController.deleteProduct);
router.post(
  "/",
  userApiBlock(),
  uploadMiddleware,
  ProductController.createProduct
);
router.put("/:pid", userApiBlock(), ProductController.updateProduct);

export default router;

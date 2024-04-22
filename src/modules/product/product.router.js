import { Router } from "express";
import { isAuthenticated } from "../../midleware/authintication.midleware.js";
import { isAuthorized } from "../../midleware/authrization.midleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../midleware/validation.midleware.js";
import * as productSchema from "./product.schema.js";
import * as productController from "./product.controller.js";
import * as reviewRouter from "../reviews/review.router.js"
const router = Router();
router.use("/:productId/review", reviewRouter);




router.post("/", isAuthenticated, isAuthorized('seller'), fileUpload().fields([
  { name: "defaultImage", maxCount: 1 },
  { name: "subImages", maxCount: 5 }]), validation(productSchema.createProduct), productController.createProduct
)


router.delete("/:id", isAuthenticated, isAuthorized("seller"), validation(productSchema.deleteProduct), productController.deleteProduct)

router.get("/",productController.getProduct)


export default router;
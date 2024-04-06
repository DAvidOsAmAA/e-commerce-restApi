import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";
import { isAuthenticated } from "../../midleware/authintication.midleware.js";
import { isAuthorized } from "../../midleware/authrization.midleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../midleware/validation.midleware.js";
const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandSchema.createBrand),
  brandController.createBrand
);

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandSchema.updateBrand),
  brandController.updateBrand
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(brandSchema.deleteBrand),
  brandController.deleteBrand
);



router.get("/", brandController.getAllBrand)

export default router;

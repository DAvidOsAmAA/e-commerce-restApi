import { Router } from "express";
import { isAuthenticated } from "../../midleware/authintication.midleware.js";
import { isAuthorized } from "../../midleware/authrization.midleware.js";
import * as reviewSchema from "./review.schema.js";
import * as reviewController from "./review.controller.js"
import { validation } from "../../midleware/validation.midleware.js";

const router = Router({ mergeParams: true });


router.post("/",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewSchema.addReview),
  reviewController.addReview);







export default router
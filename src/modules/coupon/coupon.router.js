import { Router } from "express";
import { isAuthenticated } from "../../midleware/authintication.midleware.js";
import { isAuthorized } from "../../midleware/authrization.midleware.js";
import { validation } from "../../midleware/validation.midleware.js";
import * as couponSchema from './coupon.schema.js';
import * as  couponController from './coupon.controller.js'
const router = Router();




router.post("/",isAuthenticated,isAuthorized("seller"),validation(couponSchema.createCoupon),couponController.createCoupon);

router.patch("/:code",isAuthenticated,isAuthorized("seller"),validation(couponSchema.updateCopoun),couponController.updateCopoun)

router.delete("/:code",isAuthenticated,isAuthorized("seller"),validation(couponSchema.deleteCoppun),couponController.deleteCoppun)

router.get("/",isAuthenticated,isAuthorized("admin"),couponController.allCoupons)

export default router
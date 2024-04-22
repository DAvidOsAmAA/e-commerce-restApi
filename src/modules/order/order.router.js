import { Router } from "express";
import { isAuthenticated } from "../../midleware/authintication.midleware.js";
import { isAuthorized } from "../../midleware/authrization.midleware.js";
import { validation } from "../../midleware/validation.midleware.js";
import * as orderSchema from "./order.schema.js";
import * as orderController from "./order.controller.js"
const router = Router();


router.post("/", isAuthenticated, isAuthorized("user"), validation(orderSchema.createOrder), orderController.createOrder)



router.patch("/:id",isAuthenticated,isAuthorized("user"),validation(orderSchema.cancelOrder),  orderController.cancelOrder)


export default router;
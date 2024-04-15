import { Router } from "express";
import { isAuthenticated } from "../../midleware/authintication.midleware.js";
import { isAuthorized } from "../../midleware/authrization.midleware.js";
import { validation } from "../../midleware/validation.midleware.js";
import * as cartController from "./cart.controller.js";
import * as cartSchema from './cart.schema.js';
const router = Router();





router.post("/",isAuthenticated,isAuthorized("user"),validation(cartSchema.addToCart),cartController.addToCart);



router.get("/",isAuthenticated,isAuthorized("user","admin"),validation(cartSchema.userCart),cartController.userCart)




router.patch("/",isAuthenticated,isAuthorized("user"),validation(cartSchema.updateCart),cartController.updateCart)



router.patch("/:productId",isAuthenticated,isAuthorized("user"),validation(cartSchema.removeFromCart),cartController.removeFromCart)


export default router;
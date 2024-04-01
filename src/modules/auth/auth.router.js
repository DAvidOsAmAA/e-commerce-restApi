import { Router } from "express";
import { validation } from "../../midleware/validation.midleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ActivateAccountSchema, registerSchema, loginSchema, forgetCodeSchema, resetPasswordSchema } from "./auth.schema.js";
import { ActivateAccount, register, login, forgetCode, resetPassword } from "./auth.controller.js";

const router = Router();


router.post("/register", validation(registerSchema), asyncHandler(register));

router.get("/activate_account/:token", validation(ActivateAccountSchema), asyncHandler(ActivateAccount))

router.post("/login", validation(loginSchema), asyncHandler(login));



router.patch("/forgetCode", validation(forgetCodeSchema),asyncHandler(forgetCode));


router.patch("/resetpassword",validation(resetPasswordSchema),asyncHandler(resetPassword))
export default router;
import joi from "joi";


export const registerSchema = joi.object({
  userName: joi.string().min(3).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmedPassword: joi.string().valid(joi.ref("password")).required()
}).required();


export const ActivateAccountSchema = joi.object({
  token: joi.string().required()
}).required()

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
}).required();

export const forgetCodeSchema = joi.object({
  email: joi.string().email().required(),
}).required()

export const resetPasswordSchema = joi.object({
  email: joi.string().email().required(),
  forgetCode: joi.string().length(5).required(),
  password: joi.string().required(),
}).required()


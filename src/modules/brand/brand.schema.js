import joi from 'joi';
import { isValidObjectId } from "../../midleware/validation.midleware.js";




export const createBrand = joi.object({
  name: joi.string().min(2).max(12).required(),
  categories: joi.array().items(joi.string().custom(isValidObjectId).required()).required()
}).required();



export const updateBrand = joi.object({
id: joi.string().custom(isValidObjectId).required(),
name: joi.string().min(2).max(12).required(),

}).required()



export const deleteBrand = joi.object({
  id: joi.string().custom(isValidObjectId).required(),
  }).required()
import joi from 'joi';
import { isValidObjectId } from "../../midleware/validation.midleware.js";


export const createProduct = joi.object({
  name: joi.string().min(2).max(20).required(),

  description: joi.string().min(10).max(200).required(),

  availableItems: joi.number().integer().optional({ convert: false }).min(1),

  price: joi.number().integer().optional({ convert: false }).min(1).required(),

  discount: joi.number().min(1).max(100),


  category: joi.string().custom(isValidObjectId).required(true),


  subcategory: joi.string().custom(isValidObjectId).required(true),

  brand: joi.string().custom(isValidObjectId).required(true),


}).required();



export const deleteProduct = joi.object({
  id: joi.string().custom(isValidObjectId).required(),
});
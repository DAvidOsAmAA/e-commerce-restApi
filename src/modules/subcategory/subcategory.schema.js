import joi from "joi";
import { isValidObjectId } from "../../midleware/validation.midleware.js";


export const createSubCategory = joi.object({
    name: joi.string().min(5).max(20).required(),
    category: joi.string().custom(isValidObjectId).required()
}).required();


export const updateSubCategory = joi.object({
    name: joi.string().min(5).max(20),
    id: joi.string().custom(isValidObjectId).required(),
    category: joi.string().custom(isValidObjectId).required()
}).required();


export const deleteSubCategory = joi.object({
    id: joi.string().custom(isValidObjectId).required(),
    category: joi.string().custom(isValidObjectId).required()
}).required();



export const getAllCategories = joi.object({
    category: joi.string().custom(isValidObjectId),
}).required()

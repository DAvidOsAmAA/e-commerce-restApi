import joi from "joi";
import { isValidObjectId } from "../../midleware/validation.midleware.js";

export const addReview = joi.object({
  productId:joi.string().custom(isValidObjectId).required(),
  comment:joi.string().required(),
  rating:joi.number().min(1).max(5).required()

}).required()
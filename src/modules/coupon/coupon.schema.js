import joi from "joi";

export const createCoupon = joi.object({
  discount: joi.number().integer().min(1).max(1).max(100).required(),
  expiredAt: joi.date().greater(Date.now()).required(),

}).required();


export const updateCopoun = joi.object({
  discount: joi.number().integer().min(1).max(100),
  expiredAt: joi.date().greater(Date.now()),
  code: joi.string().length(5).required()
}).required();



export const deleteCoppun = joi.object({
  code: joi.string().length(5).required(),
}).required()
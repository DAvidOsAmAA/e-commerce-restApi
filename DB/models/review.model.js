import { Schema, Types, model } from "mongoose";

const reviweSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdBy: { type: Types.ObjectId, ref: "User" },
  productId: { type: Types.ObjectId, ref: "Product" },
  orderId: { type: Types.ObjectId, ref: "Order" }
}, { timestamps: true });



export const Review = model("Review", reviweSchema)
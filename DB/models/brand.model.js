import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema({
  name: { type: String, required: true, min: 2, max: 12, unique: true },
  slug: { type: String, required: true, unique: true },
  image: {
    url: { type: String, required: true },
    id: { type: String, required: true }
  },
  createdBy: { type: Types.ObjectId, ref: "User" }
}, { timestamps: true });


export const Brand = model("Brand",brandSchema)
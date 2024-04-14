import { Schema, Types, model } from "mongoose";
import { Subcategory } from "./subcategory.model.js";

const categorySchema = new Schema({

  name: { type: String, required: true, unique: true, min: 5, max: 20 },

  slug: { type: String, required: true, unique: true },

  createdBy: { type: Types.ObjectId, ref: "User", required: true },

  image: { id: { type: String }, url: { type: String } },


  brands: [{ type: Types.ObjectId, ref: "Brand", required: true }],



}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

categorySchema.post("deleteOne", { document: true, query: false },async function() {

  await Subcategory.deleteMany({
    category:this._id
  })

})


categorySchema.virtual("subcategory", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "category"
})


export const Category = model("Category", categorySchema)
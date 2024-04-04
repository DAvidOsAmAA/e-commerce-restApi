import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true, min: 5, max: 20 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: { id: { type: String }, url: { type: String } }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

categorySchema.virtual("subcategory", {
    ref: "SubCategory",
    localField: "_id",
    foreignField: "category"
})


export const Category = model("Category", categorySchema)
import { nanoid } from "nanoid";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Product } from "../../../DB/models/product.model.js";

export const createProduct = asyncHandler(async (req, res, next) => {

  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("category not found"));

  const subcategory = await Subcategory.findById(req.body.category);
  if (!category) return next(new Error("subcategory not found"));


  const brand = await Brand.findById(req.body.category);
  if (!category) return next(new Error("brand not found"));


  if (!req.files)
    return next(new Error("Product image is required", { cause: 404 }));


  const cloudFolder = nanoid()

  let images = [];


  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path, { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` });
    images.push({ id: public_id, url: secure_url })
  }


  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path, { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
  )

  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images
  });


  res.json({ success: true, message: "Product created successfully" })
})
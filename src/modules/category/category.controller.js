import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";


export const createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("category image is required", { cause: 404 }))
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/category` }
  )
  await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url }
  })
  return res.json({ success: true, messgae: "category created successfully" })
})


export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("Category not found!", { cause: 404 }));
  if (req.user._id.toString() !== category.createdBy.toString()) {
    return next(new Error("not alloed to update category"))
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );
    category.image = { id: public_id, url: secure_url }
  }
  category.name = req.body.name ? req.body.name : console.log("no name");
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;
  await category.save()


  return res.json({ success: true, message: "category updated successfully" })
});


export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  const subcategories = await Category.deleteMany({ category: category._id })

  if (!category) return next(new Error("category not found", { cause: 404 }));



  if (category.createdBy.toString() !== req.user._id.toString()) {
    next(new Error("Not allowed to delete"))
  }

  await category.deleteOne();

  
  await cloudinary.uploader.destroy(category.image.id)
  return res.json({ success: true, message: "category deleted successfully" })
});


export const allCategories = asyncHandler(async (req, res, next) => {
  const results = await Category.find().populate("subcategory");
  res.json({ success: true, results })
})
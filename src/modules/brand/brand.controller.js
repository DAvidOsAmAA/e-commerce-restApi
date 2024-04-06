import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";





export const createBrand = asyncHandler(async (req, res, next) => {
  const { categories, name } = req.body;
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);

    if (!category)
      return next(new Error(`Category ${category} not found`, { cause: 404 }));
  });

  if (!req.file)
    return next(new Error("Brand image is required", { cause: 400 }));

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/brands`,
    }
  );

  await Brand.create({
    name,
    createdBy: req.user._id,
    slug: slugify(name),
    image: { url: secure_url, id: public_id },
  });

  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    category.brands.push(brand._id);
    await category.save();
  });

  return res.json({ success: true, message: "brand created successfully" });
});









export const updateBrand = asyncHandler(async (req, res, next) => {
  let brand = await Brand.findById(req.params.id);


  if (!brand) return next(new Error("Brands not found", { cause: 404 }));


  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      brand.image.id
    );

    brand.image = { secure_url, public_id };
  }


  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.name;

  await brand.save();

  res.json({ success: true, message: "Brand updated successfully" });
});





export const deleteBrand = asyncHandler(async (req, res, next) => {
  let brand = await Brand.findByIdAndDelete(req.params.id);

  if (!brand) return next(new Error("Brands not found", { cause: 404 }));

  await cloudinary.uploader.destroy(brand.image.id)

  await Category.updateMany({}, { $pull: { brands: brand._id } })

  return res.json({ success: true, messgae: "Brand deleted successfully" })

});



export const getAllBrand = asyncHandler(async (req, res, next) => {
  const result = await Brand.find();

  res.json({ success: true, message: result })
})

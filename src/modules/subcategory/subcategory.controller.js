import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js"
import { Subcategory } from "../../../DB/models/subcategory.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import cloudinary from "../../utils/cloud.js";

export const createSubCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.category);
    if (!category) return next(new Error("category not found!"))
    if (!req.file) {
        return next(new Error("Subcategory image is required", { cause: 404 }))
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory` }
    )
    await Subcategory.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        category: req.params.category
    })
    return res.json({ success: true, messgae: "subcategory created successfully" })
});


export const updateSubCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.category);
    if (!category) return next(new Error("Category not found!", { cause: 404 }));

    const subCategory = await Subcategory.findOne({ _id: req.params.id, category: req.params.category })
    if (!subCategory) return next(new Error("subcategory not found!", { cause: 404 }));


    if (req.user._id.toString() !== subCategory.createdBy.toString()) {
        return next(new Error("not alloed to update category"))
    }
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
            req.file.path,
            { public_id: subCategory.image.id }
        );
        subCategory.image = { id: public_id, url: secure_url }
    }
    subCategory.name = req.body.name ? req.body.name : console.log("no name");
    subCategory.slug = req.body.name ? slugify(req.body.name) : subCategory.slug;
    await subCategory.save()


    return res.json({ success: true, message: "subcategory updated successfully" })
});



export const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.category);
    if (!category) return next(new Error("Category not found!", { cause: 404 }));

    const subCategory = await Subcategory.findOne({ _id: req.params.id, category: req.params.category })
    if (!subCategory) return next(new Error("subcategory not found!", { cause: 404 }));

    if (subCategory.createdBy.toString() !== req.user._id.toString()) {
        next(new Error("Not allowed to delete"))
    }
    await Subcategory.deleteOne()

    await cloudinary.uploader.destroy(subCategory.image.id)
    return res.json({ success: true, message: "category deleted successfully" })
});





export const getAllSubCategory = asyncHandler(async (req, res, next) => {
    if (req.params.category) {
        const result = await Subcategory.find({ category: req.params.category })
    }
    const result = await Subcategory.find();
    return res.json({ success: true, result })
})
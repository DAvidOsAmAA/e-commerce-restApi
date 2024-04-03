import { Router } from "express";
import { isAuthenticated } from "../../midleware/authintication.midleware.js";
import { isAuthorized } from "../../midleware/authrization.midleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../midleware/validation.midleware.js";
import * as subCategoryController from "./subcategory.controller.js";
import * as subCategorySchema from "./subcategory.schema.js"
const router = Router({ mergeParams: true });




router.post("/",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload().single("subcategory"),
    validation(subCategorySchema.createSubCategory),
    subCategoryController.createSubCategory
)


router.patch("/:id",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload().single("subcategory"),
    validation(subCategorySchema.updateSubCategory),
    subCategoryController.updateSubCategory
)


router.delete("/:id",
    isAuthenticated,
    isAuthorized("admin"),
    validation(subCategorySchema.deleteSubCategory),
    subCategoryController.deleteSubCategory
);



router.get("/", validation(subCategorySchema.getAllCategories), subCategoryController.getAllSubCategory)



export default router
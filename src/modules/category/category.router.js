import { Router } from 'express';
import { isAuthenticated } from '../../midleware/authintication.midleware.js';
import { isAuthorized } from '../../midleware/authrization.midleware.js';
import { fileUpload } from '../../utils/fileUpload.js';
import { validation } from '../../midleware/validation.midleware.js';
import * as categorySchema from "./category.schema.js";
import * as categoryController from './category.controller.js'



const router = Router();


router.post("/",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload().single("category"),
    validation(categorySchema.createCtegory),
    categoryController.createCategory
)

router.patch("/:id",
    isAuthenticated,
    isAuthorized("admin"),
    validation(categorySchema.updateCategory),
    fileUpload().single("category"),
    categoryController.updateCategory
)
    


router.delete("/:id",
    isAuthenticated,
    isAuthorized("admin"),
    validation(categorySchema.deleteCategory),
    categoryController.deleteCategory
);


router.get("/", categoryController.allCategories)
















export default router
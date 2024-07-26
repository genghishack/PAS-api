import express, {Router} from "express";
import {adminGetCategory, adminGetCategoryWithProfessionals, adminListCategories} from "../handlers/category.js";

const router: Router = express.Router();

router.get('/', adminListCategories);
router.get('/:id', adminGetCategory);
router.get('/:id/professionals', adminGetCategoryWithProfessionals);

export default router;

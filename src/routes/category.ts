import express, {Router} from "express";
import {adminGetCategory, adminListCategories} from "../handlers/category.js";

const router: Router = express.Router();

router.get('/', adminListCategories);
router.get('/:id', adminGetCategory);

export default router;

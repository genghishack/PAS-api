import express, {Router} from "express";
import {adminListCategories} from "../handlers/category.js";

const router: Router = express.Router();

router.get('/', adminListCategories);

export default router;

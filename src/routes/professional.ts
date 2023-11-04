import express, {Router} from "express";
import {adminListProfessionals} from "../handlers/professional.js";

const router: Router = express.Router();

router.get('/', adminListProfessionals);
// router.post('/', adminCreateProfessional);
// router.get('/:id', getProfessionalById);

export default router;

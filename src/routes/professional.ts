import express, {Router} from "express";
import {adminListProfessionals, adminGetProfessional} from "../handlers/professional.js";

const router: Router = express.Router();

router.get('/', adminListProfessionals);
// router.post('/', adminCreateProfessional);
router.get('/:id', adminGetProfessional);

export default router;

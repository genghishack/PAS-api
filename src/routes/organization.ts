import express, {Router} from "express";
import {adminGetOrganization, adminListDeletedOrganizations, adminListOrganizations} from "../handlers/organization.js";

const router: Router = express.Router();

router.get('/', adminListOrganizations);
// router.post('/', adminCreateOrganization);
router.get('/deleted', adminListDeletedOrganizations);
router.get('/:id', adminGetOrganization);

export default router;

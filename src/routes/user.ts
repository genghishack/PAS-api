import express, {Router} from "express";
import {getUserById, listUsers} from "../handlers/user";

const router: Router = express.Router();

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:id', getUserById);

export default router;

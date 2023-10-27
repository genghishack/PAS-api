import express, {Router} from "express";
import {
  adminDeleteUserById,
  adminEditUserById,
  adminGetUserById,
  adminListUsers, adminReplaceUserById,
  createUser
} from "../handlers/user.js";

const router: Router = express.Router();

router.get    ('/',    adminListUsers);
router.post   ('/',    createUser);
router.get    ('/:id', adminGetUserById);
router.delete ('/:id', adminDeleteUserById);
router.patch  ('/:id', adminEditUserById);
router.put    ('/:id', adminReplaceUserById);

// router.get    ('/self',        userGetSelf);
// router.get    ('/roles/:id',   adminListRoles);
// router.patch  ('/enable/:id',  adminEnableUser);
// router.patch  ('/disable/:id', adminDisableUser);
// router.patch  ('/name/:id',    adminChangeUserName);
// router.put    ('/role/:id',    adminAddUserRole);
// router.delete ('/role/:id',    adminRemoveUserRole);

export default router;

import { Router } from "express";
import * as UserController from "../../controllers/user.controller";
import { authPermission } from "../../middlewares/auth";
import { PERMISSIONS } from "../../constants/role_permissions";
import { updateUserValidator } from "../../validators/user.validator";

const router = Router();

// list users
router.get("/", authPermission(PERMISSIONS.GET_USER), UserController.getUser);

// update user role
router.put(
  "/:userId",
  updateUserValidator,
  authPermission(PERMISSIONS.UPDATE_USER),
  UserController.updateUserRole
);

export const User: Router = router;

import { Router } from "express";
import * as AuthController from "../../controllers/auth.controller";
import { validateLogin, validateRegistration } from "../../validators/auth.validator";

const router = Router();

// register user
router.post(
  "/register",
  validateRegistration,
  AuthController.registerUser
);

// login user
router.post(
  "/login",
  validateLogin,
  AuthController.loginUser
)

export const Auth: Router = router;

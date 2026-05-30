import { Router } from "express";
import authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate-request";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rate-limit";
import { loginSchema, registerSchema } from "../validators";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register.bind(authController)
);
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  authController.login.bind(authController)
);
router.get("/me", authenticate, authController.me.bind(authController));

export default router;

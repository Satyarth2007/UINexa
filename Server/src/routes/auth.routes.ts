import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";
import { loginLimiter, registerLimiter } from "../middleware/rateLimit";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth.schema";

const router = Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
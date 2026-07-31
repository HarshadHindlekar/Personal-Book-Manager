import { Router } from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { credentialsSchema, signupSchema } from "../schemas/auth.js";

const router = Router();

router.post("/signup", validateBody(signupSchema), asyncHandler(signup));
router.post("/login", validateBody(credentialsSchema), asyncHandler(login));
router.post("/logout", logout);
router.get("/me", requireAuth, asyncHandler(getMe));

export default router;

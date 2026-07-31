import { Router } from "express";
import { create, list, remove, update } from "../controllers/books.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { bookSchema, bookUpdateSchema } from "../schemas/books.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(list));
router.post("/", validateBody(bookSchema), asyncHandler(create));
router.patch("/:id", validateBody(bookUpdateSchema), asyncHandler(update));
router.delete("/:id", asyncHandler(remove));

export default router;

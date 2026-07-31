import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});
const signupSchema = credentialsSchema.extend({ name: z.string().trim().min(2).max(80) });

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? ("none" as const) : ("lax" as const),
  maxAge: 24 * 60 * 60 * 1000,
};

function setAuthCookie(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });
  res.cookie("book_manager_token", token, cookieOptions);
}

function publicUser(user: { _id: unknown; name: string; email: string }) {
  return { id: String(user._id), name: user.name, email: user.email };
}

router.post("/signup", async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await User.create({ name: data.name, email: data.email, passwordHash });
    setAuthCookie(res, String(user._id));
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = credentialsSchema.parse(req.body);
    const user = await User.findOne({ email: data.email }).select("+passwordHash");
    const valid = user ? await bcrypt.compare(data.password, user.passwordHash) : false;

    if (!user || !valid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    setAuthCookie(res, String(user._id));
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("book_manager_token", cookieOptions);
  res.status(204).send();
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

export default router;

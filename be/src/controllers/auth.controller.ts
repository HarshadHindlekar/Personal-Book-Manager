import type { Request, Response } from "express";
import { AUTH_COOKIE_NAME } from "../constants/auth.js";
import { authCookieOptions } from "../config/cookies.js";
import { credentialsSchema, signupSchema } from "../schemas/auth.js";
import { getUserById, loginUser, signupUser } from "../services/auth.service.js";

export async function signup(req: Request, res: Response) {
  const result = await signupUser(signupSchema.parse(req.body));
  res.cookie(AUTH_COOKIE_NAME, result.token, authCookieOptions);
  res.status(201).json({ user: result.user });
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(credentialsSchema.parse(req.body));
  res.cookie(AUTH_COOKIE_NAME, result.token, authCookieOptions);
  res.json({ user: result.user });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  res.status(204).send();
}

export async function getMe(req: Request, res: Response) {
  const user = await getUserById(String(req.user!.id));
  res.json({ user });
}

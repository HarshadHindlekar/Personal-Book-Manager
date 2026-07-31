import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME } from "../constants/auth.js";

type AuthPayload = { sub: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    if (!payload.sub || !Types.ObjectId.isValid(payload.sub)) {
      res.status(401).json({ message: "Invalid authentication token" });
      return;
    }

    req.user = { id: new Types.ObjectId(payload.sub) };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired authentication token" });
  }
}

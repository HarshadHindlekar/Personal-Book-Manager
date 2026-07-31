import { env } from "./env.js";
import { AUTH_COOKIE_MAX_AGE } from "../constants/auth.js";

export const authCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? ("none" as const) : ("lax" as const),
  maxAge: AUTH_COOKIE_MAX_AGE,
};

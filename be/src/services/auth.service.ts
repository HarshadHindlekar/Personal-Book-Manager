import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import { User } from "../models/User.js";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResult = {
  user: PublicUser;
  token: string;
};

function toPublicUser(user: { _id: unknown; name: string; email: string }): PublicUser {
  return { id: String(user._id), name: user.name, email: user.email };
}

function createToken(userId: string) {
  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export async function signupUser(data: { name: string; email: string; password: string }): Promise<AuthResult> {
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await User.create({ name: data.name, email: data.email, passwordHash });
  return { user: toPublicUser(user), token: createToken(String(user._id)) };
}

export async function loginUser(data: { email: string; password: string }): Promise<AuthResult> {
  const user = await User.findOne({ email: data.email }).select("+passwordHash");
  const valid = user ? await bcrypt.compare(data.password, user.passwordHash) : false;

  if (!user || !valid) {
    throw new AppError("Invalid email or password", 401);
  }

  return { user: toPublicUser(user), token: createToken(String(user._id)) };
}

export async function getUserById(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 401);
  }
  return toPublicUser(user);
}

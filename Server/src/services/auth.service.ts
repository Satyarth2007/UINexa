import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import { env } from "../config/env";
import { User, type IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";

const BCRYPT_ROUNDS = 12;
// Compared against when the email doesn't exist, so response time doesn't reveal which emails are registered
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_ROUNDS);

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function toPublicUser(user: HydratedDocument<IUser>) {
  return { id: user.id as string, name: user.name, email: user.email };
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const email = input.email.toLowerCase();

  if (await User.exists({ email })) {
    throw new ApiError(409, "That email is already registered");
  }

  const password = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  try {
    return await User.create({ name: input.name, email, password });
  } catch (err) {
    // Two simultaneous sign-ups can both pass the check above; the unique index catches the second
    if (typeof err === "object" && err !== null && (err as { code?: number }).code === 11000) {
      throw new ApiError(409, "That email is already registered");
    }
    throw err;
  }
}

export async function loginUser(emailInput: string, password: string) {
  const user = await User.findOne({ email: emailInput.toLowerCase() }).select("+password");

  const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
  if (!user || !valid) throw new ApiError(401, "Invalid email or password");

  return user;
}   
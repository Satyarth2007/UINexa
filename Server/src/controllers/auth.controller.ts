
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import type { AuthRequest } from "../middleware/auth.middleware";

const COOKIE_NAME = "uinexa_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

function createToken(userId: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign({}, secret, {
    subject: userId,
    expiresIn: "7d",
    issuer: "uinexa-api",
    audience: "uinexa-client",
  });
}

function sendUser(res: Response, user: {
  _id: unknown;
  name: string;
  email: string;
}) {
  return res.json({
    success: true,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
  });
}

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid registration data.",
    });
  }

  const name = result.data.name;
  const email = result.data.email.toLowerCase();
  const password = result.data.password;

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(String(user._id));

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    // Handle simultaneous registrations using the same email.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    throw error;
  }
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid login data.",
    });
  }

  const email = result.data.email.toLowerCase();
  const password = result.data.password;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = createToken(String(user._id));

  res.cookie(COOKIE_NAME, token, getCookieOptions());

  return sendUser(res, user);
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Please log in.",
    });
  }

  const user = await User.findById(req.userId).lean();

  if (!user) {
    res.clearCookie(COOKIE_NAME, getCookieOptions());

    return res.status(401).json({
      success: false,
      message: "User account not found.",
    });
  }

  return sendUser(res, user);
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, getCookieOptions());

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
}

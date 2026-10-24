import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../config/constants";
import { env } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const authenticate: RequestHandler = async (req, _res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new ApiError(401, "Not authenticated");

  let userId: string;
  try {
    userId = (jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload).sub as string;
  } catch {
    throw new ApiError(401, "Your session expired. Log in again");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, "Not authenticated");

  req.user = user; // available to every route after this middleware
  next();
};
import rateLimit from "express-rate-limit";

const base = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: "draft-8" as const,
  legacyHeaders: false,
};

export const registerLimiter = rateLimit({
  ...base,
  limit: 20,
  message: { message: "Too many sign-up attempts. Try again in a few minutes." },
});

// Only failed logins count, so normal use is never blocked
export const loginLimiter = rateLimit({
  ...base,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { message: "Too many failed attempts. Try again in a few minutes." },
});
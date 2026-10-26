import rateLimit from "express-rate-limit";

export const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => String(req.user?.id ?? "anon"), // ADAPT: wherever requireAuth stores the user
  message: { message: "Generation limit reached. Try again in a few minutes." },
});


export const refineLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => String(req.user?.id ?? "anon"), // ADAPT, same as above
  message: { message: "Edit limit reached. Try again in a few minutes." },
});
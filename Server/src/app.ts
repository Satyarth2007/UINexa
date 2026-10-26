import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import routes from "./routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import generateRoutes from "./routes/generate.routes";

const app = express();

// Behind a proxy (Render, Railway, etc.) this makes rate limiting see the real client IP
if (env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api", routes);
app.use("/api", generateRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
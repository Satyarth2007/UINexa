
import type { ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error("API Error:", error);

  if (res.headersSent) {
    return;
  }

  const statusCode =
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 600
      ? error.status
      : 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error."
        : error.message || "Something went wrong.",
  });
};

export default errorMiddleware;

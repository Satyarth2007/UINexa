
import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "UINexa API is running."
      : "API is running, but the database is not connected.",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

export default router;

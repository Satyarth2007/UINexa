
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/database";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    // Ensure required authentication configuration exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from the .env file.");
    }

    // Connect to MongoDB before accepting requests
    await connectDB();

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`UINexa API running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start UINexa server:", error);
    process.exit(1);
  }
}

startServer();

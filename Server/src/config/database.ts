
import mongoose from "mongoose";

async function connectDB(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing from the .env file.");
  }

  await mongoose.connect(mongoURI);

  console.log("MongoDB connected successfully.");
}

export default connectDB;

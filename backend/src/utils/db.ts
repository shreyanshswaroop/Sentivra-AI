import mongoose from "mongoose";
import { logger } from "./logger";
import { requireEnv } from "./env";

const MONGODB_URI = requireEnv("MONGODB_URI");

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB Atlas");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

import mongoose from "mongoose";
import { logger } from "../logger/logger";
import { ErrorMessages } from "../../domain/constants/ErrorMessages";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(ErrorMessages.DATABASE.MONGO_URI_UNDEFINED);
  }

  try {
    const conn = await mongoose.connect(uri);
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    throw error;
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB runtime error:", err);
  });
};

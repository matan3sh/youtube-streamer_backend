import mongoose from "mongoose";
import logger from "./logger";

const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING ||
  "mongodb+srv://matan3sh:testtest@youtubestreamer.zk7oq.mongodb.net/youtubeStreamer_db?retryWrites=true&w=majority";

export async function connectToDatabase() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    logger.info(`Connected to database`);
  } catch (error) {
    logger.error(
      `Error connecting to database: ${DB_CONNECTION_STRING}. Goodbye!`
    );
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
  logger.info(`Disconnected from database`);
  return;
}

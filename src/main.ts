import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

import { connectToDatabase, disconnectFromDatabase } from "./utils/database";
import logger from "./utils/logger";
import { CORS_ORIGIN } from "./constants";
import deserializeUser from "./middlewares/deserializeUser";

import userRoute from "./modules/user/user.route";
import authRoute from "./modules/auth/auth.route";
import videoRoute from "./modules/videos/video.route";

require("dotenv").config();
const PORT = process.env.PORT || 4000;
const app = express();

/* Middlewares */
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(deserializeUser);

/* Routes */
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/videos", videoRoute);

const server = app.listen(PORT, async () => {
  await connectToDatabase();
  logger.info(`Server listening on port ${PORT}`);
});

const signals = ["SIGTERM", "SIGINT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    logger.info("Goodbye!, got signal", signal);
    server.close();

    await disconnectFromDatabase();
    logger.info("My work here is done. Goodbye!");
    process.exit(0);
  });
}

for (let i = 0; i < signals.length; i++) {
  gracefulShutdown(signals[i]);
}

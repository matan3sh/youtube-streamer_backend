import express from "express";
import {
  updateVideoHandler,
  uploadVideoHandler,
  findVideosHandler,
} from "./video.controller";
import requireUser from "../../middlewares/requireUser";

const router = express.Router();

router.post("/", requireUser, uploadVideoHandler);

router.patch("/:videoId", requireUser, updateVideoHandler);

router.get("/", findVideosHandler);

export default router;

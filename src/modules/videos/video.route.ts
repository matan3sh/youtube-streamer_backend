import express from "express";
import {
  updateVideoHandler,
  uploadVideoHandler,
  findVideosHandler,
  streamVideoHandler,
} from "./video.controller";
import requireUser from "../../middlewares/requireUser";

const router = express.Router();

router.post("/", requireUser, uploadVideoHandler);

router.patch("/:videoId", requireUser, updateVideoHandler);

router.get("/:videoId", streamVideoHandler);

router.get("/", findVideosHandler);

export default router;

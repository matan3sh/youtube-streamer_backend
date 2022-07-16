import { Request, Response } from "express";
import fs from "fs";
import busboy from "busboy";
import { createVideo, findeVideos, findVideo } from "./video.service";
import { Video } from "./video.model";
import { UpdateVideoParams, UpdateVideoBody } from "./video.schema";
import { StatusCodes } from "http-status-codes";

const MIME_TYPES = ["video/mp4"];

function getPath({
  videoId,
  extension,
}: {
  videoId: Video["videoId"];
  extension: Video["extension"];
}) {
  return `${process.cwd()}/videos/${videoId}.${extension}`;
}

export async function uploadVideoHandler(req: Request, res: Response) {
  const bb = busboy({ headers: req.headers });
  const user = res.locals.user;

  const video = await createVideo({ owner: user._id });

  bb.on("file", async (_, file, info) => {
    if (!MIME_TYPES.includes(info.mimeType)) {
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid file type");
    }

    const extension = info.mimeType.split("/")[1];

    const filePath = getPath({ videoId: video.videoId, extension });

    video.extension = extension;
    await video.save();

    const stream = fs.createWriteStream(filePath);
    file.pipe(stream);
  });

  bb.on("close", () => {
    res.writeHead(StatusCodes.CREATED, {
      Connection: "close",
      "Content-Type": "application/json",
    });

    res.write(JSON.stringify(video));
    res.end();
  });

  return req.pipe(bb);
}

export async function updateVideoHandler(
  req: Request<UpdateVideoParams, {}, UpdateVideoBody>,
  res: Response
) {
  const { videoId } = req.params;
  const { title, description, published } = req.body;

  const { _id: userId } = res.locals.user;

  const video = await findVideo(videoId);

  if (!video) {
    return res.status(StatusCodes.NOT_FOUND).send("Video not found");
  }

  if (String(video.owner) !== String(userId)) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
  }

  video.title = title;
  video.description = description;
  video.published = published;

  await video.save();

  return res.status(StatusCodes.OK).send(video);
}

export async function findVideosHandler(req: Request, res: Response) {
  const videos = await findeVideos();

  return res.status(StatusCodes.OK).send(videos);
}

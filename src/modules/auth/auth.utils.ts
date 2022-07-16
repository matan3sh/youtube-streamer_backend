import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretYoutubeStreamer";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signJwt(payload: string | Buffer | object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

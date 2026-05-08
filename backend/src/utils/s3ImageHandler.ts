import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env";
import fs from "fs";
import path from "path";

const s3 = new S3Client({
  endpoint: env.s3Endpoint,
  region: env.s3Region,
  credentials: {
    accessKeyId: env.s3AccessKey,
    secretAccessKey: env.s3SecretKey,
  },
  forcePathStyle: true,
});

const BUCKET = env.s3Bucket;

// Strip bucket prefix from folder — callers pass "portfolio-utility/teachers"
// but the bucket IS portfolio-utility, so the S3 key should be "teachers/filename"
const toKey = (folder: string, filename: string): string => {
  const clean = folder.replace(new RegExp(`^${BUCKET}/`), "");
  return `${clean}/${filename}`.replace(/\/+/g, "/");
};

const constructUrl = (key: string): string => {
  if (env.s3PublicUrl) {
    return `${env.s3PublicUrl.replace(/\/+$/, "")}/${key}`;
  }
  return `${env.s3Endpoint.replace(/\/+$/, "")}/${BUCKET}/${key}`;
};

export const uploadImage = async (
  filePath: string,
  folder: string
): Promise<string> => {
  const fileContent = fs.readFileSync(filePath);
  const filename = `${Date.now()}-${path.basename(filePath)}`;
  const key = toKey(folder, filename);

  await s3.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: fileContent })
  );

  return constructUrl(key);
};

export const deleteImage = async (key: string): Promise<void> => {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
};

export const getKeyFromUrl = (url: string): string => {
  const regex = new RegExp(`${BUCKET}/(.+)`);
  const match = url.match(regex);
  if (!match) throw new Error("Could not extract key from URL");
  return match[1];
};

export const deleteImageByUrl = async (url: string): Promise<void> => {
  const key = getKeyFromUrl(url);
  await deleteImage(key);
};

export const getSignedUrlFromUrl = async (url: string): Promise<string> => {
  const key = getKeyFromUrl(url);
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

export const uploadBuffer = async (
  buffer: Buffer,
  folder: string,
  filename: string
): Promise<string> => {
  const key = toKey(folder, filename);

  await s3.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buffer })
  );

  return constructUrl(key);
};

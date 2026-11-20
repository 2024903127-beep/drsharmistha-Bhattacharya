import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

export const r2Configured = () => Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET);
let s3: S3Client | null = null;
const client = () => (s3 ??= new S3Client({
  region: "auto", endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
}));
// Development only: without R2 keys, files go to ./.data (never persisted on serverless hosting).
const local = (key: string) => path.join(process.cwd(), ".data", key);
const devFallback = () => { if (process.env.NODE_ENV === "production") throw new Error("File storage (Cloudflare R2) is not configured"); };

export async function putFile(key: string, body: Buffer, contentType: string) {
  if (!r2Configured()) { devFallback(); await mkdir(path.dirname(local(key)), { recursive: true }); return writeFile(local(key), body); }
  await client().send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: body, ContentType: contentType }));
}
export async function getFile(key: string): Promise<ReadableStream> {
  if (!r2Configured()) { devFallback(); return Readable.toWeb(Readable.from(await readFile(local(key)))) as ReadableStream; }
  const o = await client().send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
  return o.Body!.transformToWebStream();
}

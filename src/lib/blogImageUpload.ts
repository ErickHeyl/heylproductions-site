import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// No BLOB_READ_WRITE_TOKEN configured: save to public/uploads instead, so
// photo uploads can be tried locally without a Vercel Blob store. (This
// fallback only works on your own machine; Vercel's filesystem is read-only.)
const hasBlobToken = () => !!import.meta.env.BLOB_READ_WRITE_TOKEN;

export const uploadBlogImage = async (image: File): Promise<string> => {
  const safeName = image.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const filename = `${Date.now()}-${safeName}`;

  if (hasBlobToken()) {
    const blob = await put(`blog/${filename}`, image, {
      access: "public",
      token: import.meta.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "blog");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), Buffer.from(await image.arrayBuffer()));
  return `/uploads/blog/${filename}`;
};

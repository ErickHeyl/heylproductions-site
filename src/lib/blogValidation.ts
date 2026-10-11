import { BLOG_CATEGORIES, type BlogCategory } from "@models/blog_posts";

export const MAX_TITLE_LENGTH = 200;
export const MAX_BODY_LENGTH = 50_000; // well beyond any real blog post
// Vercel functions cap the whole request body around 4.5MB; stay comfortably
// under that to leave room for the rest of the form data.
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export const titleError = (title: FormDataEntryValue | null): string | null => {
  if (typeof title !== "string" || !title.trim()) return "Title is required.";
  if (title.trim().length > MAX_TITLE_LENGTH) return `Title is too long (max ${MAX_TITLE_LENGTH} characters).`;
  return null;
};

export const bodyError = (body: FormDataEntryValue | null): string | null => {
  if (typeof body !== "string" || !body.trim()) return "Post text is required.";
  if (body.trim().length > MAX_BODY_LENGTH) {
    return `Post text is too long (max ${MAX_BODY_LENGTH.toLocaleString()} characters).`;
  }
  return null;
};

// No image (nothing uploaded) is not an error: the field is optional.
export const imageFileError = (image: FormDataEntryValue | null): string | null => {
  if (!(image instanceof File) || image.size === 0) return null;
  if (!image.type.startsWith("image/")) {
    return "That file doesn't look like a photo. Please upload an image (JPG, PNG, etc.).";
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return `That photo is too large (${(image.size / 1024 / 1024).toFixed(1)}MB). Please use one under ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`;
  }
  return null;
};

export const resolveCategory = (category: FormDataEntryValue | null): BlogCategory =>
  BLOG_CATEGORIES.includes(category as BlogCategory) ? (category as BlogCategory) : "general";

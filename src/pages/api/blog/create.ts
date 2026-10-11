import type { APIRoute } from "astro";
import { create_post } from "@models/blog_posts";
import { isAuthenticated } from "@lib/adminAuth";
import { titleError, bodyError, imageFileError, resolveCategory } from "@lib/blogValidation";
import { uploadBlogImage } from "@lib/blogImageUpload";

export const prerender = false;

const fail = (error: string, status: number) =>
  new Response(JSON.stringify({ success: false, error }), { status });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return fail("You've been logged out. Please log in again.", 401);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Couldn't read the submitted form. Please try again.", 400);
  }

  const title = form.get("title");
  const body = form.get("body");
  const image = form.get("image");

  const error = titleError(title) ?? bodyError(body) ?? imageFileError(image);
  if (error) return fail(error, 400);

  let image_url: string | null = null;
  if (image instanceof File && image.size > 0) {
    try {
      image_url = await uploadBlogImage(image);
    } catch (err) {
      console.error("Error uploading blog post photo:", err);
      return fail("The photo couldn't be uploaded. Please try again, or publish without a photo.", 500);
    }
  }

  try {
    const post = await create_post(
      (title as string).trim(),
      (body as string).trim(),
      image_url,
      resolveCategory(form.get("category")),
    );
    return new Response(JSON.stringify({ success: true, post }), { status: 200 });
  } catch (err) {
    console.error("Error saving blog post:", err);
    return fail("The post couldn't be saved. Please try again.", 500);
  }
};

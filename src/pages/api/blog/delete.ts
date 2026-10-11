import type { APIRoute } from "astro";
import { delete_post } from "@models/blog_posts";
import { isAuthenticated } from "@lib/adminAuth";

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

  const slug = form.get("slug");
  if (typeof slug !== "string" || !slug) {
    return fail("Missing post reference. Please go back and try again.", 400);
  }

  try {
    const deleted = await delete_post(slug);
    if (!deleted) {
      return fail("That post no longer exists. It may have already been deleted.", 404);
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error deleting blog post:", err);
    return fail("The post couldn't be deleted. Please try again.", 500);
  }
};

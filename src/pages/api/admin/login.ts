import type { APIRoute } from "astro";
import { checkPassword, createSessionCookie } from "@lib/adminAuth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Something went wrong." }), { status: 400 });
  }

  if (!checkPassword(password)) {
    return new Response(JSON.stringify({ success: false, error: "Incorrect password." }), { status: 401 });
  }

  createSessionCookie(cookies);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

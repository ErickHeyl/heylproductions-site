import { defineMiddleware } from "astro:middleware";
import { BLOG_ENABLED } from "./data/features";

const BLOG_PAGES = /^\/(blog|admin)(\/|$)/;
const BLOG_API = /^\/api\/(blog|admin)(\/|$)/;

// While the blog is switched off, its pages send visitors home and its API
// routes answer 404. (Astro can't rewrite on-demand routes to the prerendered
// 404 page, hence the redirect.)
export const onRequest = defineMiddleware((context, next) => {
  if (!BLOG_ENABLED) {
    if (BLOG_API.test(context.url.pathname)) return new Response("Not found", { status: 404 });
    if (BLOG_PAGES.test(context.url.pathname)) return context.redirect("/", 302);
  }
  return next();
});

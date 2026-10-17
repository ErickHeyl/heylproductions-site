import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://www.heylproductions.com",
  // Pages are static/prerendered by default. Anything that reads blog posts
  // from Postgres (home, blog, admin) or handles a request (API routes) opts
  // out with `export const prerender = false` and runs as a Vercel function.
  output: "static",
  adapter: vercel(),
  integrations: [
    // Base styles come from src/styles/global.css (imported by Layout.astro).
    tailwind({ applyBaseStyles: false }),
    // Keep the admin screens and API routes out of the sitemap. On-demand
    // pages aren't discovered automatically, so the public ones are listed.
    sitemap({
      // Add "/blog" back here when the blog is turned on.
      customPages: ["/", "/service"].map((path) => new URL(path, "https://www.heylproductions.com").href),
      // While the blog is off (src/data/features.ts) it stays out too; drop
      // "blog" from this pattern when turning it back on.
      filter: (page) => !/\/(admin|api|blog)(\/|$)/.test(new URL(page).pathname),
    }),
    icon(),
  ],
});

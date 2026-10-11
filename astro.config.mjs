import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://heylproductions.vercel.app",
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
      customPages: ["/", "/service", "/blog"].map((path) => new URL(path, "https://heylproductions.vercel.app").href),
      filter: (page) => !/\/(admin|api)(\/|$)/.test(new URL(page).pathname),
    }),
    icon(),
  ],
});

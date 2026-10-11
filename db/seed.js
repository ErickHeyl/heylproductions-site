// One-time setup: creates the blog_posts table (if it doesn't exist yet) and
// loads the sample posts, so the blog has content before real posts exist.
//
// Run once, after POSTGRES_URL is set in .env:
//   npm run db:seed
//
// Safe to re-run: table creation is idempotent, and posts are upserted by
// slug (re-running just refreshes the sample posts, it won't duplicate them).

import "dotenv/config";
import fs from "node:fs";
import pg from "pg";
import { STARTER_POSTS } from "../src/data/starter_posts.js";

if (!process.env.POSTGRES_URL) {
  console.error("POSTGRES_URL is not set. Add it to .env first (see .env.example).");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URL + "?sslmode=require" });

const slugify = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function run() {
  const schema = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  await pool.query(schema);
  console.log("blog_posts table ready.");

  for (const post of STARTER_POSTS) {
    await pool.query(
      `INSERT INTO blog_posts (title, slug, date_label, body, category, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO UPDATE
         SET body = EXCLUDED.body, date_label = EXCLUDED.date_label, category = EXCLUDED.category;`,
      [post.title, slugify(post.title), post.date_label, post.body, post.category, post.created_at],
    );
    console.log(`  seeded post: ${post.title}`);
  }

  await pool.end();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

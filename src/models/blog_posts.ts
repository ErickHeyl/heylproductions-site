import pool from "./db";
import { slugify } from "@lib/slugify";
import {
  memory_get_all_posts,
  memory_get_posts_by_category,
  memory_get_post_by_slug,
  memory_create_post,
  memory_update_post,
  memory_delete_post,
} from "./memoryBlogStore";

export const BLOG_CATEGORIES = ["weddings", "business", "events", "general"] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  weddings: "Weddings",
  business: "Business",
  events: "Events",
  general: "General",
};

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date_label: string;
  body: string;
  image_url: string | null;
  category: BlogCategory;
  created_at: string;
}

// The post body is plain text; a blank line starts a new paragraph.
export const paragraphs = (body: string): string[] =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const excerpt = (body: string, maxLength = 180): string => {
  const first = paragraphs(body)[0] ?? "";
  if (first.length <= maxLength) return first;
  return first.slice(0, first.lastIndexOf(" ", maxLength)) + "…";
};

// No POSTGRES_URL configured: fall back to an in-memory store so the blog and
// admin create/edit/delete flows work locally without a real database. See
// memoryBlogStore.ts.
const hasDb = () => !!import.meta.env.POSTGRES_URL;

export const get_all_posts = async (): Promise<BlogPost[]> => {
  if (!hasDb()) return memory_get_all_posts();
  const results = await pool.query("SELECT * FROM blog_posts ORDER BY created_at DESC;");
  return results.rows;
};

export const get_recent_posts = async (limit = 3): Promise<BlogPost[]> =>
  (await get_all_posts()).slice(0, limit);

export const get_posts_by_category = async (
  category: BlogCategory,
  limit = 3,
): Promise<BlogPost[]> => {
  if (!hasDb()) return memory_get_posts_by_category(category, limit);
  const results = await pool.query(
    "SELECT * FROM blog_posts WHERE category = $1 ORDER BY created_at DESC LIMIT $2;",
    [category, limit],
  );
  return results.rows;
};

export const get_post_by_slug = async (slug: string): Promise<BlogPost | null> => {
  if (!hasDb()) return memory_get_post_by_slug(slug);
  const results = await pool.query("SELECT * FROM blog_posts WHERE slug = $1;", [slug]);
  return results.rows[0] ?? null;
};

// A title with no a-z0-9 characters (e.g. all emoji) slugifies to "", so fall
// back to something usable. Repeated titles get -2, -3, ... so a new post can
// never silently overwrite an older one.
const unique_slug_for = async (title: string): Promise<string> => {
  const base = slugify(title) || `post-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  while ((await pool.query("SELECT 1 FROM blog_posts WHERE slug = $1", [slug])).rows.length > 0) {
    slug = `${base}-${suffix}`;
    suffix++;
  }
  return slug;
};

export const create_post = async (
  title: string,
  body: string,
  image_url: string | null,
  category: BlogCategory,
): Promise<BlogPost> => {
  if (!hasDb()) return memory_create_post(title, body, image_url, category);

  const slug = await unique_slug_for(title);
  const date_label = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const result = await pool.query(
    `INSERT INTO blog_posts (title, slug, date_label, body, image_url, category)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *;`,
    [title, slug, date_label, body, image_url, category],
  );
  return result.rows[0];
};

// Editing never changes the slug, even if the title changes, so existing
// links and bookmarks to /blog/<slug> keep working.
export const update_post = async (
  slug: string,
  title: string,
  body: string,
  image_url: string | null,
  category: BlogCategory,
): Promise<BlogPost | null> => {
  if (!hasDb()) return memory_update_post(slug, title, body, image_url, category);

  const result = await pool.query(
    `UPDATE blog_posts
     SET title = $2, body = $3, image_url = $4, category = $5
     WHERE slug = $1
     RETURNING *;`,
    [slug, title, body, image_url, category],
  );
  return result.rows[0] ?? null;
};

export const delete_post = async (slug: string): Promise<boolean> => {
  if (!hasDb()) return memory_delete_post(slug);
  const result = await pool.query("DELETE FROM blog_posts WHERE slug = $1;", [slug]);
  return (result.rowCount ?? 0) > 0;
};

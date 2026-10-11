import type { BlogCategory, BlogPost } from "./blog_posts";
import { slugify } from "@lib/slugify";
import { STARTER_POSTS } from "../data/starter_posts.js";

// Used only when POSTGRES_URL isn't set, so the blog and admin create/edit/
// delete flows can be tried locally without a real database. Lives for the
// life of the server process: restarting it resets to the sample posts.
const posts: BlogPost[] = STARTER_POSTS.map((p, i) => ({
  id: i + 1,
  title: p.title,
  slug: slugify(p.title),
  date_label: p.date_label,
  body: p.body,
  image_url: null,
  category: p.category as BlogCategory,
  created_at: new Date(p.created_at).toISOString(),
}));

let nextId = posts.length + 1;

const sortedByNewest = () =>
  [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export const memory_get_all_posts = async (): Promise<BlogPost[]> => sortedByNewest();

export const memory_get_posts_by_category = async (
  category: BlogCategory,
  limit = 3,
): Promise<BlogPost[]> => sortedByNewest().filter((p) => p.category === category).slice(0, limit);

export const memory_get_post_by_slug = async (slug: string): Promise<BlogPost | null> =>
  posts.find((p) => p.slug === slug) ?? null;

const unique_slug_for = (title: string): string => {
  const base = slugify(title) || `post-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  while (posts.some((p) => p.slug === slug)) {
    slug = `${base}-${suffix}`;
    suffix++;
  }
  return slug;
};

export const memory_create_post = async (
  title: string,
  body: string,
  image_url: string | null,
  category: BlogCategory,
): Promise<BlogPost> => {
  const post: BlogPost = {
    id: nextId++,
    title,
    slug: unique_slug_for(title),
    date_label: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    body,
    image_url,
    category,
    created_at: new Date().toISOString(),
  };
  posts.push(post);
  return post;
};

export const memory_update_post = async (
  slug: string,
  title: string,
  body: string,
  image_url: string | null,
  category: BlogCategory,
): Promise<BlogPost | null> => {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  post.title = title;
  post.body = body;
  post.image_url = image_url;
  post.category = category;
  return post;
};

export const memory_delete_post = async (slug: string): Promise<boolean> => {
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
};

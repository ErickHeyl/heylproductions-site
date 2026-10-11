// Its own module so memoryBlogStore.ts can use it at load time without a
// circular import through models/blog_posts.ts.
export const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

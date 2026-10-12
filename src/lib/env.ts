// Server-side settings, read at request time (process.env) with the build-time
// value as a fallback, so changing a Vercel environment variable doesn't depend
// on what was inlined during the build.
const read = (name: string): string | undefined =>
  (typeof process !== "undefined" ? process.env[name] : undefined) || import.meta.env[name] || undefined;

// The Neon integration on Vercel sets both POSTGRES_URL and DATABASE_URL;
// accept either.
export const databaseUrl = (): string | undefined => read("POSTGRES_URL") ?? read("DATABASE_URL");

export const adminPassword = (): string => read("BLOG_ADMIN_PASSWORD") ?? "";

// The Blob store was connected in Vercel with the prefix
// "BLOB_READ_WRITE_TOKEN_PUB", so its token has that longer name. Prefer it over
// the plain name, which on this project belongs to an older store.
export const blobToken = (): string | undefined =>
  read("BLOB_READ_WRITE_TOKEN_PUB_READ_WRITE_TOKEN") ?? read("BLOB_READ_WRITE_TOKEN");

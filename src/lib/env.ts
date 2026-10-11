// Server-side settings, read at request time (process.env) with the build-time
// value as a fallback, so changing a Vercel environment variable doesn't depend
// on what was inlined during the build.
const read = (name: string): string | undefined =>
  (typeof process !== "undefined" ? process.env[name] : undefined) || import.meta.env[name] || undefined;

// The Neon integration on Vercel sets both POSTGRES_URL and DATABASE_URL;
// accept either.
export const databaseUrl = (): string | undefined => read("POSTGRES_URL") ?? read("DATABASE_URL");

export const adminPassword = (): string => read("BLOG_ADMIN_PASSWORD") ?? "";

export const blobToken = (): string | undefined => read("BLOB_READ_WRITE_TOKEN");

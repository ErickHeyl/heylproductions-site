/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly POSTGRES_URL?: string;
  readonly DATABASE_URL?: string;
  readonly BLOG_ADMIN_PASSWORD?: string;
  readonly BLOB_READ_WRITE_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

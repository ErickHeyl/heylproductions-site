import pg from "pg";
import { databaseUrl } from "@lib/env";

// Neon connection strings already carry `?sslmode=require`; only add it when
// the URL doesn't specify sslmode, so we never produce a malformed URL.
const withSsl = (url: string) => (/[?&]sslmode=/.test(url) ? url : `${url}${url.includes("?") ? "&" : "?"}sslmode=require`);

let pool: pg.Pool | null = null;

// Created on first use, so the URL is read at request time.
export const getPool = (): pg.Pool => {
  if (!pool) {
    const url = databaseUrl();
    pool = new pg.Pool({ connectionString: url ? withSsl(url) : undefined });
  }
  return pool;
};

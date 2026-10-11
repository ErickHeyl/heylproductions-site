import pg from "pg";

const pool = new pg.Pool({
  connectionString: import.meta.env.POSTGRES_URL
    ? import.meta.env.POSTGRES_URL + "?sslmode=require"
    : undefined,
});

export default pool;

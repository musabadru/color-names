import { createClient } from "@libsql/client/web";

const url = process.env.TURSO_DATABASE_URL;

export const db = createClient({
  url: url || "libsql://missing-database-url",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

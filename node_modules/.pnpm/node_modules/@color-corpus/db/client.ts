import { createClient } from "@libsql/client";

// In development, this uses a local file. In production, this can connect to Turso.
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:../../local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

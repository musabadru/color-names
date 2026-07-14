import { createClient } from "@libsql/client/web";

function getClient() {
  const url = process?.env?.['TURSO_DATABASE_URL'] || (import.meta as any).env?.TURSO_DATABASE_URL;
  const authToken = process?.env?.['TURSO_AUTH_TOKEN'] || (import.meta as any).env?.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("CRITICAL: TURSO_DATABASE_URL is missing from environment variables! Please add it to your Vercel Project Settings.");
  }

  return createClient({ url, authToken });
}

export const db = {
  execute: (...args: any[]) => getClient().execute(...args),
  batch: (...args: any[]) => getClient().batch(...args)
};

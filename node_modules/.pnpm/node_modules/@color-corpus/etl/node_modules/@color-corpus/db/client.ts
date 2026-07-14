import { createClient } from "@libsql/client/web";

let clientInstance: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (clientInstance) return clientInstance;

  let url = process?.env?.['TURSO_DATABASE_URL'] || (import.meta as any).env?.TURSO_DATABASE_URL;
  const authToken = process?.env?.['TURSO_AUTH_TOKEN'] || (import.meta as any).env?.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("CRITICAL: TURSO_DATABASE_URL is missing from environment variables! Please add it to your Vercel Project Settings.");
  }

  // Force HTTPS instead of WebSockets to prevent Vercel Serverless 504 Timeouts
  if (url.startsWith("libsql://")) {
    url = url.replace("libsql://", "https://");
  }

  clientInstance = createClient({ url, authToken });
  return clientInstance;
}

export const db = {
  execute: (...args: any[]) => getClient().execute(...args),
  batch: (...args: any[]) => getClient().batch(...args)
};

import { db } from "@color-corpus/db";

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    node_version: typeof process !== "undefined" ? process.version : "unknown",
    has_turso_url: !!process.env.TURSO_DATABASE_URL,
    has_turso_token: !!process.env.TURSO_AUTH_TOKEN,
    turso_url_prefix: process.env.TURSO_DATABASE_URL
      ? process.env.TURSO_DATABASE_URL.substring(0, 30) + "..."
      : "MISSING",
  };

  try {
    const start = Date.now();
    const result = await db.execute("SELECT COUNT(*) as cnt FROM source_colors");
    diagnostics.db_query_ms = Date.now() - start;
    diagnostics.db_row_count = result.rows[0]?.cnt;
    diagnostics.db_status = "OK";
  } catch (err: any) {
    diagnostics.db_status = "ERROR";
    diagnostics.db_error = err.message;
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

import { createClient } from "@libsql/client/web";

// Pre-render this route at build time — no serverless function needed.
// Astro will call GET() during `astro build`, save the JSON as a static file,
// and Vercel will serve it directly from the CDN with zero cold start.
export const prerender = true;

function getDb() {
  let url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      `Missing env vars at build time: TURSO_DATABASE_URL=${!!url}, TURSO_AUTH_TOKEN=${!!authToken}`
    );
  }

  if (url.startsWith("libsql://")) {
    url = url.replace("libsql://", "https://");
  }

  return createClient({ url, authToken });
}

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT sc.id, sc.primary_name_raw as name, sc.hex_color as hex, s.name as source_name FROM source_colors sc JOIN sources s ON sc.source_id = s.id"
    );

    const colors = Array.from(result.rows).map((row: any) => ({
      id: row.id,
      name: row.name,
      hex: row.hex,
      source_name: row.source_name,
    }));

    return new Response(JSON.stringify(colors), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // At build time, a failure here will break the build — which is what we want.
    // It forces us to fix the issue rather than deploying a broken endpoint.
    console.error("Failed to build colors.json:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

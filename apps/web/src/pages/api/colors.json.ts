import { db } from "@color-corpus/db";

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT sc.id, sc.primary_name_raw as name, sc.hex_color as hex, s.name as source_name FROM source_colors sc JOIN sources s ON sc.source_id = s.id LIMIT 5000"
    );

    // Map to plain objects to avoid any prototype/serialization issues
    const colors = Array.from(result.rows).map((row: any) => ({
      id: row.id,
      name: row.name,
      hex: row.hex,
      source_name: row.source_name,
    }));

    return new Response(JSON.stringify(colors), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack?.split("\n").slice(0, 5),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

import { db } from "@color-corpus/db";

export async function GET() {
  try {
    const result = await db.execute(`
      SELECT sc.id, sc.primary_name_raw as name, sc.hex_color as hex, s.name as source_name
      FROM source_colors sc
      JOIN sources s ON sc.source_id = s.id
    `);
    
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

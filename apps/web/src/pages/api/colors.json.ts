import { db } from "@color-corpus/db";

export async function GET() {
  try {
    // Use a timeout to avoid hanging the entire 10s Vercel budget
    const result = await Promise.race([
      db.execute(
        "SELECT sc.id, sc.primary_name_raw as name, sc.hex_color as hex, s.name as source_name FROM source_colors sc JOIN sources s ON sc.source_id = s.id LIMIT 5000"
      ),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DB query timed out after 8s")), 8000)
      ),
    ]);

    return new Response(JSON.stringify(result.rows), {
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

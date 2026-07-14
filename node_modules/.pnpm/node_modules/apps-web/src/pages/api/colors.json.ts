

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    return new Response(
      JSON.stringify({ error: "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Ensure URL is HTTP/HTTPS for raw fetch
  const fetchUrl = url.replace("libsql://", "https://") + "/v2/pipeline";

  try {
    // We use raw fetch to bypass a known bug in @libsql/client where 
    // it silently hangs/drops the promise on large row counts.
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            type: "execute",
            stmt: {
              sql: "SELECT sc.id, sc.primary_name_raw as name, sc.hex_color as hex, s.name as source_name FROM source_colors sc JOIN sources s ON sc.source_id = s.id",
            },
          },
          { type: "close" },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Turso HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the Turso v2 HTTP response structure
    const result = data.results[0]?.response?.result;
    if (!result) {
      throw new Error("Invalid Turso response format");
    }

    const cols = result.cols.map((c: any) => c.name);
    const rows = result.rows;

    const colors = rows.map((row: any[]) => {
      const obj: Record<string, any> = {};
      row.forEach((val, i) => {
        obj[cols[i]] = val.value;
      });
      return obj;
    });

    return new Response(JSON.stringify(colors), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Failed to build colors.json:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

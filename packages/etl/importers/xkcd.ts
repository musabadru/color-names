import { db } from "@color-corpus/db";
import { readFileSync } from "fs";
import { join } from "path";

export async function importXkcdColors() {
  console.log("Reading XKCD Colors from data-staging...");
  const dataPath = join(process.cwd(), "..", "..", "data-staging", "xkcd.json");
  const data: { description: string, colors: Array<{color: string, hex: string}> } = JSON.parse(readFileSync(dataPath, "utf-8"));
  
  console.log(`Fetched ${data.colors.length} XKCD colors.`);

  const sourceId = "src_xkcd";

  await db.execute({
    sql: `
      INSERT INTO sources (id, slug, name, kind, language, source_url) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `,
    args: [
      sourceId, 
      "xkcd", 
      "XKCD Color Survey", 
      "survey", 
      "en", 
      "https://xkcd.com/color/rgb/"
    ]
  });
  console.log("Inserted XKCD source record.");

  const CHUNK_SIZE = 10;
  for (let i = 0; i < data.colors.length; i += CHUNK_SIZE) {
    const chunk = data.colors.slice(i, i + CHUNK_SIZE);
    const stmts: Array<{sql: string, args: any[]}> = [];
    
    for (const c of chunk) {
      const name = c.color;
      const hex = c.hex.startsWith("#") ? c.hex : "#" + c.hex;
      
      const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const colorId = `sc_${hex.replace("#", "")}_${safeName}`;
      const nameId = `n_${safeName}`;
      const assignmentId = `cna_${colorId}_${nameId}`;

      stmts.push({
        sql: `INSERT INTO source_colors (id, source_id, primary_name_raw, hex_color) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [colorId, sourceId, name, hex]
      });

      stmts.push({
        sql: `INSERT INTO names (id, normalized_form, display_form, language) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [nameId, name.toLowerCase(), name, "en"]
      });

      stmts.push({
        sql: `INSERT INTO color_name_assignments (id, source_color_id, name_id, role) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [assignmentId, colorId, nameId, "primary"]
      });
    }

    try {
      await db.batch(stmts, "write");
      console.log(`Inserted XKCD chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(data.colors.length / CHUNK_SIZE)}`);
    } catch (err) {
      console.error("Batch failed at index", i, err);
      break;
    }
  }

  console.log("XKCD Colors import complete.\n");
}

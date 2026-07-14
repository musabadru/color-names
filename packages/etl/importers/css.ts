import { db } from "@color-corpus/db";

import { readFileSync } from "fs";
import { join } from "path";

export async function importCssColors() {
  console.log("Reading CSS Colors from data-staging...");
  const dataPath = join(process.cwd(), "..", "..", "data-staging", "css-color-names.json");
  const data: Record<string, string> = JSON.parse(readFileSync(dataPath, "utf-8"));
  const entries = Object.entries(data);
  console.log(`Fetched ${entries.length} CSS colors.`);

  const sourceId = "src_css_colors";

  await db.execute({
    sql: `
      INSERT INTO sources (id, slug, name, kind, language, source_url) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `,
    args: [
      sourceId, 
      "css-color-names", 
      "CSS Color Names", 
      "standard", 
      "en", 
      "https://raw.githubusercontent.com/bahamas10/css-color-names/master/css-color-names.json"
    ]
  });
  console.log("Inserted CSS Colors source record.");

  const CHUNK_SIZE = 10;
  for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
    const chunk = entries.slice(i, i + CHUNK_SIZE);
    const stmts: Array<{sql: string, args: any[]}> = [];
    
    for (const [name, hex] of chunk) {
      const colorId = `sc_${hex.replace("#", "")}_${name}`;
      const nameId = `n_${name}`;
      const assignmentId = `cna_${colorId}_${nameId}`;

      stmts.push({
        sql: `INSERT INTO source_colors (id, source_id, primary_name_raw, hex_color) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [colorId, sourceId, name, hex]
      });

      stmts.push({
        sql: `INSERT INTO names (id, normalized_form, display_form, language) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [nameId, name, name, "en"]
      });

      stmts.push({
        sql: `INSERT INTO color_name_assignments (id, source_color_id, name_id, role) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [assignmentId, colorId, nameId, "primary"]
      });
    }

    try {
      await db.batch(stmts, "write");
      console.log(`Inserted CSS Colors chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(entries.length / CHUNK_SIZE)}`);
    } catch (err) {
      console.error("Batch failed at index", i, err);
      break;
    }
  }

  console.log("CSS Colors import complete.\n");
}

import { db } from "@color-corpus/db";
import { readFileSync } from "fs";
import { join } from "path";

export async function importPantoneColors() {
  console.log("Reading Pantone Colors from data-staging...");
  const dataPath = join(process.cwd(), "..", "..", "data-staging", "pantone-colors.json");
  const data: { names: string[], values: string[] } = JSON.parse(readFileSync(dataPath, "utf-8"));
  
  if (data.names.length !== data.values.length) {
    throw new Error("Pantone JSON arrays are mismatched!");
  }

  console.log(`Fetched ${data.names.length} Pantone colors.`);

  const sourceId = "src_pantone";

  await db.execute({
    sql: `
      INSERT INTO sources (id, slug, name, kind, language, source_url) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `,
    args: [
      sourceId, 
      "pantone", 
      "Pantone", 
      "commercial_system", 
      "en", 
      "https://github.com/Margaret2/pantone-colors"
    ]
  });
  console.log("Inserted Pantone Colors source record.");

  const CHUNK_SIZE = 10;
  for (let i = 0; i < data.names.length; i += CHUNK_SIZE) {
    const namesChunk = data.names.slice(i, i + CHUNK_SIZE);
    const valuesChunk = data.values.slice(i, i + CHUNK_SIZE);
    const stmts: Array<{sql: string, args: any[]}> = [];
    
    for (let j = 0; j < namesChunk.length; j++) {
      const name = namesChunk[j];
      const hex = valuesChunk[j].startsWith("#") ? valuesChunk[j] : "#" + valuesChunk[j];
      
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
      console.log(`Inserted Pantone chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(data.names.length / CHUNK_SIZE)}`);
    } catch (err) {
      console.error("Batch failed at index", i, err);
      break;
    }
  }

  console.log("Pantone Colors import complete.\n");
}

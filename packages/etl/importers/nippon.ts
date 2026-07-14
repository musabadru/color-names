import { db } from "@color-corpus/db";

import { readFileSync } from "fs";
import { join } from "path";

export async function importNipponColors() {
  console.log("Reading Nippon Colors from data-staging...");
  const dataPath = join(process.cwd(), "..", "..", "data-staging", "nipponcolor.json");
  const data: Array<{id: string, name: string, cname: string, color: string}> = JSON.parse(readFileSync(dataPath, "utf-8"));
  console.log(`Fetched ${data.length} Traditional Japanese colors.`);

  const sourceId = "src_nippon_colors";

  await db.execute({
    sql: `
      INSERT INTO sources (id, slug, name, kind, language, source_url) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `,
    args: [
      sourceId, 
      "nippon-colors", 
      "Traditional Colors of Japan", 
      "historical_book", 
      "ja", 
      "https://raw.githubusercontent.com/lcat/nippon-colors/master/nipponcolor.json"
    ]
  });
  console.log("Inserted Nippon Colors source record.");

  const CHUNK_SIZE = 10;
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    const stmts: Array<{sql: string, args: any[]}> = [];
    
    for (const color of chunk) {
      const hex = color.color.startsWith("#") ? color.color : "#" + color.color;
      const colorId = `sc_${hex.replace("#", "")}_${color.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      
      // Primary name (Romaji)
      const nameIdEn = `n_${color.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const assignmentIdEn = `cna_${colorId}_${nameIdEn}`;

      // Alternate name (Kanji)
      const nameIdJa = `n_${color.cname}`;
      const assignmentIdJa = `cna_${colorId}_${nameIdJa}`;

      stmts.push({
        sql: `INSERT INTO source_colors (id, source_id, primary_name_raw, hex_color) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [colorId, sourceId, color.name, hex]
      });

      // Insert Romaji Name
      stmts.push({
        sql: `INSERT INTO names (id, normalized_form, display_form, language) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [nameIdEn, color.name.toLowerCase(), color.name, "en"]
      });
      stmts.push({
        sql: `INSERT INTO color_name_assignments (id, source_color_id, name_id, role) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [assignmentIdEn, colorId, nameIdEn, "primary"]
      });

      // Insert Kanji Name
      stmts.push({
        sql: `INSERT INTO names (id, normalized_form, display_form, language) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [nameIdJa, color.cname, color.cname, "ja"]
      });
      stmts.push({
        sql: `INSERT INTO color_name_assignments (id, source_color_id, name_id, role) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [assignmentIdJa, colorId, nameIdJa, "translation"]
      });
    }

    try {
      await db.batch(stmts, "write");
      console.log(`Inserted Nippon Colors chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(data.length / CHUNK_SIZE)}`);
    } catch (err) {
      console.error("Batch failed at index", i, err);
      break;
    }
  }

  console.log("Nippon Colors import complete.\n");
}

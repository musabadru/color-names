import { db } from "@color-corpus/db";

async function run() {
  console.log("Starting import process...");
  
  // 1. Fetch the dataset
  console.log("Fetching color-name-list...");
  const response = await fetch("https://unpkg.com/color-name-list@latest/dist/colornames.json");
  const data: Array<{name: string, hex: string}> = await response.json();
  console.log(`Fetched ${data.length} colors.`);

  const sourceId = "src_color_name_list";

  // 2. Insert source
  await db.execute({
    sql: `
      INSERT INTO sources (id, slug, name, kind, language, source_url) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `,
    args: [
      sourceId, 
      "color-name-list", 
      "Color Name List", 
      "web_collection", 
      "en", 
      "https://unpkg.com/color-name-list@latest/dist/colornames.json"
    ]
  });
  console.log("Inserted source record.");

  // 3. Prepare bulk insert
  console.log("Preparing batch inserts...");
  
  const CHUNK_SIZE = 100;
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    console.log(`Processing chunk ${i} to ${i + CHUNK_SIZE}...`);
    const chunk = data.slice(i, i + CHUNK_SIZE);
    const stmts: Array<{sql: string, args: any[]}> = [];
    
    for (const color of chunk) {
      // Create deterministic IDs based on the data
      const colorId = `sc_${color.hex.replace("#", "")}_${color.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const nameId = `n_${color.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const assignmentId = `cna_${colorId}_${nameId}`;

      stmts.push({
        sql: `INSERT INTO source_colors (id, source_id, primary_name_raw, hex_color) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [colorId, sourceId, color.name, color.hex]
      });

      stmts.push({
        sql: `INSERT INTO names (id, normalized_form, display_form, language) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [nameId, color.name.toLowerCase(), color.name, "en"]
      });

      stmts.push({
        sql: `INSERT INTO color_name_assignments (id, source_color_id, name_id, role) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`,
        args: [assignmentId, colorId, nameId, "primary"]
      });
    }

    try {
      await db.batch(stmts, "write");
      console.log(`Inserted chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(data.length / CHUNK_SIZE)}`);
    } catch (err) {
      console.error("Batch failed at index", i, err);
      break;
    }
  }

  console.log("\nImport process complete.");
}

run().catch(console.error);

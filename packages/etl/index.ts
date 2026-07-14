
import { importNipponColors } from "./importers/nippon";
import { importCssColors } from "./importers/css";
import { importPantoneColors } from "./importers/pantone";
import { importXkcdColors } from "./importers/xkcd";

async function runEtl() {
  console.log("=== Starting ETL Pipeline ===\n");

  try {
    // await importNipponColors(); // already ran
    // await importCssColors(); // already ran
    await importPantoneColors();
    await importXkcdColors();
    
    console.log("=== ETL Pipeline Finished Successfully ===");
  } catch (error) {
    console.error("ETL Pipeline failed:", error);
    process.exit(1);
  }
}

runEtl();

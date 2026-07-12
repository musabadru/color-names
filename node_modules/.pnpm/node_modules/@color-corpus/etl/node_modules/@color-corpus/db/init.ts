import { db } from "./client";
import { readFileSync } from "fs";
import { join } from "path";

async function run() {
  const schemaPath = join(import.meta.dirname, "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");
  // @libsql/client executes statements. It can only execute one statement at a time in `execute` but supports `executeMultiple`.
  await db.executeMultiple(schema);
  console.log("Schema initialized.");
}

run().catch(console.error);

import fs from "fs";
import path from "path";
import { pool } from "../config/db";

async function initDb() {
  try {
    const schemaPath = path.join(__dirname, "..", "..", "db", "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf-8");
    await pool.query(sql);
    console.log("✅ Database schema created/verified successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initDb();

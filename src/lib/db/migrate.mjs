// Lightweight migration runner for Docker startup
// Only depends on better-sqlite3 (included in standalone build)
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const migrationsDir = path.join(__dirname, "drizzle", "migrations");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "fat-cat.db");
console.log(`[migrate] Database: ${dbPath}`);

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Create migrations tracking table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    created_at INTEGER
  )
`);

// Read migration journal
const journalPath = path.join(migrationsDir, "meta", "_journal.json");
if (!fs.existsSync(journalPath)) {
    console.log("[migrate] No migration journal found, skipping.");
    sqlite.close();
    process.exit(0);
}

const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));

const applied = new Set(
    sqlite.prepare("SELECT hash FROM __drizzle_migrations").all().map((r) => r.hash)
);

let count = 0;
for (const entry of journal.entries) {
    const hash = entry.tag;
    if (applied.has(hash)) continue;

    const sqlFile = path.join(migrationsDir, `${hash}.sql`);
    const sql = fs.readFileSync(sqlFile, "utf-8");

    // Split on Drizzle's statement breakpoint marker
    const statements = sql
        .split("-->statement-breakpoint")
        .map((s) => s.trim())
        .filter(Boolean);

    // Execute each statement individually, skipping "already exists" errors
    // This handles the case where drizzle-kit migrate ran during build but
    // didn't use our tracking table
    let allOk = true;
    for (const stmt of statements) {
        try {
            sqlite.exec(stmt);
        } catch (err) {
            if (err.message && err.message.includes("already exists")) {
                // Table/index already exists — safe to skip
                continue;
            }
            throw err;
        }
    }

    // Mark migration as applied
    sqlite.prepare(
        "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)"
    ).run(hash, Date.now());

    count++;
    console.log(`[migrate] Applied: ${hash}`);
}

console.log(
    count > 0
        ? `[migrate] Done, applied ${count} migration(s).`
        : "[migrate] Database is up to date."
);
sqlite.close();

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

// Auto-seed if database is empty (first boot)
import crypto from "crypto";
function uid() { return crypto.randomUUID(); }

const productCount = sqlite.prepare("SELECT COUNT(*) as c FROM products").get();
if (productCount && productCount.c === 0) {
    console.log("[seed] Empty database detected, inserting sample data...");
    const now = new Date().toISOString();
    const catToys = uid(), catPlush = uid(), catAccessories = uid();

    sqlite.prepare(
        "INSERT INTO categories (id, name, slug, description, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(catToys, "Handcrafted Toys", "handcrafted-toys", "Beautifully handmade toys crafted with care and quality materials", 1, now, now);
    sqlite.prepare(
        "INSERT INTO categories (id, name, slug, description, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(catPlush, "Plush Animals", "plush-animals", "Soft and cuddly plush companions for all ages", 2, now, now);
    sqlite.prepare(
        "INSERT INTO categories (id, name, slug, description, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(catAccessories, "Accessories", "accessories", "Handmade accessories and lifestyle goods", 3, now, now);

    const products = [
        [uid(), "Handcrafted Wooden Train", "handcrafted-wooden-train", "A classic wooden train set hand-carved from sustainably sourced beechwood. Finished with non-toxic paint in bright primary colors.", 2499, 2999, catToys, "active", "wooden,train,handmade"],
        [uid(), "Plush Teddy Bear", "plush-teddy-bear", "An irresistibly soft teddy bear made from premium plush fabric with hand-stitched details.", 1899, null, catPlush, "active", "plush,teddy,bear"],
        [uid(), "Hand-Knitted Scarf", "hand-knitted-scarf", "A cozy hand-knitted scarf made from 100% merino wool. Features a classic ribbed pattern in warm autumn tones.", 3499, null, catAccessories, "active", "knitted,scarf,wool"],
        [uid(), "Wooden Stacking Blocks", "wooden-stacking-blocks", "Set of 12 hand-sanded wooden stacking blocks in assorted shapes and colors.", 1599, 1999, catToys, "active", "wooden,blocks,stacking"],
        [uid(), "Plush Bunny Rabbit", "plush-bunny-rabbit", "An adorable floppy-eared bunny rabbit made from ultra-soft velvet plush.", 2199, 2699, catPlush, "active", "plush,bunny,rabbit"],
        [uid(), "Leather Keychain Set", "leather-keychain-set", "Set of 3 handcrafted leather keychains with brass hardware.", 1299, null, catAccessories, "active", "leather,keychain,handmade"],
        [uid(), "Painted Wooden Puzzle", "painted-wooden-puzzle", "A charming hand-painted wooden jigsaw puzzle featuring a countryside farm scene.", 1899, null, catToys, "active", "wooden,puzzle,painted"],
        [uid(), "Canvas Tote Bag", "canvas-tote-bag", "A sturdy canvas tote bag with hand-printed botanical illustrations.", 2799, 3299, catAccessories, "active", "canvas,tote,bag"],
    ];

    const insertProduct = sqlite.prepare(
        "INSERT INTO products (id, title, slug, description, price, compare_at_price, category_id, status, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    for (const p of products) {
        insertProduct.run(...p, now, now);
    }

    console.log(`[seed] Inserted 3 categories and ${products.length} products.`);
}

sqlite.close();

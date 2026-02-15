import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { sql, eq } from "drizzle-orm";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "fat-cat.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite, { schema });

interface DuplicateGroup {
  email: string;
  count: number;
}

const duplicates = db
  .select({
    email: schema.customers.email,
    count: sql<number>`COUNT(*)`,
  })
  .from(schema.customers)
  .where(sql`${schema.customers.email} IS NOT NULL`)
  .groupBy(schema.customers.email)
  .having(sql`COUNT(*) > 1`)
  .all() as DuplicateGroup[];

if (duplicates.length === 0) {
  console.log("No duplicate customers found.");
  sqlite.close();
  process.exit(0);
}

console.log(`Found ${duplicates.length} duplicate email groups:`);

let totalMerged = 0;

for (const dup of duplicates) {
  const customers = db
    .select()
    .from(schema.customers)
    .where(eq(schema.customers.email, dup.email))
    .orderBy(schema.customers.createdAt)
    .all();

  const keeper = customers[0];
  const duplicateIds = customers.slice(1).map((c) => c.id);

  console.log(
    `  Email: ${dup.email} — keeping ${keeper.id}, merging ${duplicateIds.length} duplicates`,
  );

  for (const dupId of duplicateIds) {
    db.update(schema.orders)
      .set({ customerId: keeper.id })
      .where(eq(schema.orders.customerId, dupId))
      .run();

    db.update(schema.customerAddresses)
      .set({ customerId: keeper.id })
      .where(eq(schema.customerAddresses.customerId, dupId))
      .run();

    db.delete(schema.customers)
      .where(eq(schema.customers.id, dupId))
      .run();
  }

  totalMerged += duplicateIds.length;
}

console.log(`\nDeduplication complete: merged ${totalMerged} duplicate customer records.`);
sqlite.close();

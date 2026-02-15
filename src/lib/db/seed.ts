import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "fat-cat.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: "./drizzle/migrations" });

const now = new Date().toISOString();

const handcraftedToysId = nanoid();
const plushAnimalsId = nanoid();
const accessoriesId = nanoid();

db.insert(schema.categories)
  .values([
    {
      id: handcraftedToysId,
      name: "Handcrafted Toys",
      slug: "handcrafted-toys",
      description: "Beautifully handmade toys crafted with care and quality materials",
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: plushAnimalsId,
      name: "Plush Animals",
      slug: "plush-animals",
      description: "Soft and cuddly plush companions for all ages",
      sortOrder: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: accessoriesId,
      name: "Accessories",
      slug: "accessories",
      description: "Handmade accessories and lifestyle goods",
      sortOrder: 3,
      createdAt: now,
      updatedAt: now,
    },
  ])
  .run();

const sampleProducts = [
  {
    id: nanoid(),
    title: "Handcrafted Wooden Train",
    slug: "handcrafted-wooden-train",
    description:
      "A classic wooden train set hand-carved from sustainably sourced beechwood. Finished with non-toxic paint in bright primary colors. Includes engine and two carriages.",
    price: 2499,
    compareAtPrice: 2999,
    categoryId: handcraftedToysId,
    status: "active" as const,
    tags: "wooden,train,handmade",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Plush Teddy Bear",
    slug: "plush-teddy-bear",
    description:
      "An irresistibly soft teddy bear made from premium plush fabric with hand-stitched details. Features a charming bow tie and embroidered eyes for safety.",
    price: 1899,
    categoryId: plushAnimalsId,
    status: "active" as const,
    tags: "plush,teddy,bear",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Hand-Knitted Scarf",
    slug: "hand-knitted-scarf",
    description:
      "A cozy hand-knitted scarf made from 100% merino wool. Features a classic ribbed pattern in warm autumn tones. Perfect for chilly days.",
    price: 3499,
    categoryId: accessoriesId,
    status: "active" as const,
    tags: "knitted,scarf,wool",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Wooden Stacking Blocks",
    slug: "wooden-stacking-blocks",
    description:
      "Set of 12 hand-sanded wooden stacking blocks in assorted shapes and colors. Each block is crafted from solid maple wood with rounded edges for safe play.",
    price: 1599,
    compareAtPrice: 1999,
    categoryId: handcraftedToysId,
    status: "active" as const,
    tags: "wooden,blocks,stacking",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Plush Bunny Rabbit",
    slug: "plush-bunny-rabbit",
    description:
      "An adorable floppy-eared bunny rabbit made from ultra-soft velvet plush. Hand-stuffed with hypoallergenic filling and finished with a sweet embroidered nose.",
    price: 2199,
    compareAtPrice: 2699,
    categoryId: plushAnimalsId,
    status: "active" as const,
    tags: "plush,bunny,rabbit",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Leather Keychain Set",
    slug: "leather-keychain-set",
    description:
      "Set of 3 handcrafted leather keychains with brass hardware. Each piece is hand-cut, beveled, and burnished from full-grain vegetable-tanned leather.",
    price: 1299,
    categoryId: accessoriesId,
    status: "active" as const,
    tags: "leather,keychain,handmade",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Painted Wooden Puzzle",
    slug: "painted-wooden-puzzle",
    description:
      "A charming hand-painted wooden jigsaw puzzle featuring a countryside farm scene. Made from thick birch plywood with 24 chunky pieces perfect for small hands.",
    price: 1899,
    categoryId: handcraftedToysId,
    status: "active" as const,
    tags: "wooden,puzzle,painted",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    description:
      "A sturdy canvas tote bag with hand-printed botanical illustrations. Features reinforced handles, an interior pocket, and a magnetic snap closure.",
    price: 2799,
    compareAtPrice: 3299,
    categoryId: accessoriesId,
    status: "active" as const,
    tags: "canvas,tote,bag",
    createdAt: now,
    updatedAt: now,
  },
];

db.insert(schema.products).values(sampleProducts).run();

console.log("Seed complete!");
console.log(`  - ${3} categories`);
console.log(`  - ${sampleProducts.length} products`);

sqlite.close();

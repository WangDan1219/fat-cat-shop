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

const catToysId = nanoid();
const catFoodId = nanoid();
const catAccessoriesId = nanoid();

db.insert(schema.categories)
  .values([
    {
      id: catToysId,
      name: "Cat Toys",
      slug: "cat-toys",
      description: "Fun toys to keep your feline friend entertained",
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: catFoodId,
      name: "Cat Food & Treats",
      slug: "cat-food-treats",
      description: "Delicious and nutritious food for your cat",
      sortOrder: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: catAccessoriesId,
      name: "Cat Accessories",
      slug: "cat-accessories",
      description: "Essential accessories for happy cats",
      sortOrder: 3,
      createdAt: now,
      updatedAt: now,
    },
  ])
  .run();

const sampleProducts = [
  {
    id: nanoid(),
    title: "Feather Wand Toy",
    slug: "feather-wand-toy",
    description:
      "Interactive feather wand toy that will keep your cat jumping and playing for hours. Made with natural feathers and a flexible wand for realistic movement.",
    price: 1299,
    compareAtPrice: 1599,
    categoryId: catToysId,
    status: "active" as const,
    tags: "interactive,feather,wand",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Catnip Mouse Set (3 Pack)",
    slug: "catnip-mouse-set",
    description:
      "Set of 3 adorable plush mice filled with premium organic catnip. Cats love batting these around and carrying them in their mouths!",
    price: 899,
    categoryId: catToysId,
    status: "active" as const,
    tags: "catnip,plush,mouse",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Premium Salmon Cat Treats",
    slug: "premium-salmon-treats",
    description:
      "Made with real wild-caught salmon, these crunchy treats are packed with omega-3 fatty acids for a healthy coat and happy tummy.",
    price: 699,
    categoryId: catFoodId,
    status: "active" as const,
    tags: "salmon,treats,healthy",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Organic Chicken Feast",
    slug: "organic-chicken-feast",
    description:
      "Premium organic chicken wet food with no artificial preservatives. Grain-free recipe with added vitamins and minerals.",
    price: 399,
    compareAtPrice: 499,
    categoryId: catFoodId,
    status: "active" as const,
    tags: "organic,chicken,wet-food",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Cozy Cat Bed",
    slug: "cozy-cat-bed",
    description:
      "Ultra-soft donut-shaped cat bed with raised edges for a sense of security. Machine washable and available in warm peach color.",
    price: 3499,
    compareAtPrice: 4299,
    categoryId: catAccessoriesId,
    status: "active" as const,
    tags: "bed,cozy,donut",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Adjustable Cat Collar with Bell",
    slug: "adjustable-cat-collar",
    description:
      "Stylish and comfortable breakaway collar with a cute bell. Safety buckle releases under pressure to protect your cat.",
    price: 799,
    categoryId: catAccessoriesId,
    status: "active" as const,
    tags: "collar,bell,safety",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Interactive Laser Pointer",
    slug: "interactive-laser-pointer",
    description:
      "USB rechargeable laser pointer with multiple patterns. Perfect for interactive play sessions with your cat.",
    price: 1499,
    categoryId: catToysId,
    status: "active" as const,
    tags: "laser,interactive,rechargeable",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: nanoid(),
    title: "Cat Scratching Post",
    slug: "cat-scratching-post",
    description:
      "Tall sisal rope scratching post with a cozy platform on top. Protects your furniture while giving your cat a place to stretch and scratch.",
    price: 2999,
    categoryId: catAccessoriesId,
    status: "active" as const,
    tags: "scratching,sisal,furniture",
    createdAt: now,
    updatedAt: now,
  },
];

db.insert(schema.products).values(sampleProducts).run();

console.log("Seed complete!");
console.log(`  - ${3} categories`);
console.log(`  - ${sampleProducts.length} products`);

sqlite.close();

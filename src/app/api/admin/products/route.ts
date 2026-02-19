import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.parse(body);
    const now = new Date().toISOString();

    const product = {
      id: nanoid(),
      ...parsed,
      description: parsed.description ?? null,
      compareAtPrice: parsed.compareAtPrice ?? null,
      categoryId: parsed.categoryId ?? null,
      tags: parsed.tags ?? null,
      stock: parsed.stock ?? null,
      createdAt: now,
      updatedAt: now,
    };

    db.insert(products).values(product).run();

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create product" },
      { status: 400 },
    );
  }
}

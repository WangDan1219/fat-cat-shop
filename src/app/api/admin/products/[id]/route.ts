import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const parsed = productSchema.parse(body);
    const now = new Date().toISOString();

    db.update(products)
      .set({
        ...parsed,
        description: parsed.description ?? null,
        compareAtPrice: parsed.compareAtPrice ?? null,
        categoryId: parsed.categoryId ?? null,
        tags: parsed.tags ?? null,
        updatedAt: now,
      })
      .where(eq(products.id, id))
      .run();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update product" },
      { status: 400 },
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    db.delete(products).where(eq(products.id, id)).run();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete product" },
      { status: 400 },
    );
  }
}

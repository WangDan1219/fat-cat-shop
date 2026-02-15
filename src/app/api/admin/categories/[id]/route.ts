import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { categoryUpdateSchema } from "@/lib/validators";
import { eq, sql } from "drizzle-orm";

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
    const parsed = categoryUpdateSchema.parse(body);
    const now = new Date().toISOString();

    const slug = parsed.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const existing = await db.query.categories.findFirst({
      where: (cat, { and, ne }) => and(eq(cat.slug, slug), ne(cat.id, id)),
    });

    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 },
      );
    }

    db.update(categories)
      .set({
        name: parsed.name,
        slug,
        description: parsed.description ?? null,
        sortOrder: parsed.sortOrder ?? 0,
        updatedAt: now,
      })
      .where(eq(categories.id, id))
      .run();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update category" },
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

    const [result] = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.categoryId, id))
      .all();

    const productCount = result?.count ?? 0;

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category with ${productCount} assigned product(s). Reassign or remove them first.`,
          productCount,
        },
        { status: 409 },
      );
    }

    db.delete(categories).where(eq(categories.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete category" },
      { status: 400 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { discountCodes } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const now = new Date().toISOString();

  const existing = db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.id, id))
    .get();

  if (!existing) {
    return NextResponse.json({ error: "Discount code not found" }, { status: 404 });
  }

  db.update(discountCodes)
    .set({ active: body.active ?? existing.active, updatedAt: now })
    .where(eq(discountCodes.id, id))
    .run();

  const updated = db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.id, id))
    .get();

  return NextResponse.json({ code: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.id, id))
    .get();

  if (!existing) {
    return NextResponse.json({ error: "Discount code not found" }, { status: 404 });
  }

  db.delete(discountCodes).where(eq(discountCodes.id, id)).run();

  return NextResponse.json({ success: true });
}

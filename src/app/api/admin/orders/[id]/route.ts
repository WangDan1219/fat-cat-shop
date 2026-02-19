import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const patchSchema = z.object({
  note: z.string().max(1000),
});

export async function PATCH(req: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  db.update(orders)
    .set({ note: parsed.data.note || null, updatedAt: now })
    .where(eq(orders.id, id))
    .run();

  return NextResponse.json({ success: true });
}

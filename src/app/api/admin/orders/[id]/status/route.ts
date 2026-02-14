import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderStatusHistory } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { status } = await req.json();
  const now = new Date().toISOString();

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  db.update(orders)
    .set({ status, updatedAt: now })
    .where(eq(orders.id, id))
    .run();

  db.insert(orderStatusHistory)
    .values({
      id: nanoid(),
      orderId: id,
      fromStatus: order.status,
      toStatus: status,
      note: null,
      createdAt: now,
    })
    .run();

  return NextResponse.json({ success: true });
}

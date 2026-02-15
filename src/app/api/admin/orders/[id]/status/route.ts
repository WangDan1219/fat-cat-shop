import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderStatusHistory } from "@/lib/db/schema";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { VALID_STATUS_TRANSITIONS } from "@/lib/utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { status, note, paymentStatus } = await req.json();
  const now = new Date().toISOString();

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const currentUser = await getCurrentUser();

  // Handle payment status update
  if (paymentStatus && paymentStatus !== order.paymentStatus) {
    const validPaymentStatuses = ["unpaid", "paid", "refunded"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: `Invalid payment status: ${paymentStatus}` },
        { status: 400 },
      );
    }

    db.update(orders)
      .set({ paymentStatus, updatedAt: now })
      .where(eq(orders.id, id))
      .run();

    db.insert(orderStatusHistory)
      .values({
        id: nanoid(),
        orderId: id,
        fromStatus: `payment:${order.paymentStatus}`,
        toStatus: `payment:${paymentStatus}`,
        changedBy: currentUser?.username ?? null,
        note: note ?? null,
        createdAt: now,
      })
      .run();

    if (!status) {
      return NextResponse.json({ success: true });
    }
  }

  // Handle order status update
  if (status) {
    const allowed = VALID_STATUS_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        {
          error: `Cannot transition from "${order.status}" to "${status}". Valid transitions: ${allowed.join(", ") || "none"}`,
        },
        { status: 400 },
      );
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
        changedBy: currentUser?.username ?? null,
        note: note ?? null,
        createdAt: now,
      })
      .run();
  }

  return NextResponse.json({ success: true });
}

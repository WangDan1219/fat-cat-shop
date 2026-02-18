import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, id),
    with: {
      addresses: true,
      orders: {
        with: { lineItems: true },
        orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      },
    },
  });

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json(customer);
}

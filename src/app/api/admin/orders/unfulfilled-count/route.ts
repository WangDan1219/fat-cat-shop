import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { count, inArray } from "drizzle-orm";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [result] = await db
    .select({ count: count() })
    .from(orders)
    .where(inArray(orders.status, ["pending", "confirmed"]));

  return NextResponse.json({ count: result.count });
}

import { db } from "@/lib/db";
import { analyticsEvents, analyticsDailySummary, orders } from "@/lib/db/schema";
import { eq, sql, and, gte, lt } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function aggregateToday(): Promise<void> {
  const dateStr = new Date().toISOString().slice(0, 10);
  const startOfDay = dateStr + "T00:00:00.000Z";
  const nextDate = new Date(dateStr + "T00:00:00.000Z");
  nextDate.setDate(nextDate.getDate() + 1);
  const endOfDay = nextDate.toISOString().slice(0, 10) + "T00:00:00.000Z";

  const [viewStats] = await db
    .select({
      uniqueVisitors: sql<number>`COUNT(DISTINCT ${analyticsEvents.visitorId})`,
      pageViews: sql<number>`COUNT(*)`,
    })
    .from(analyticsEvents)
    .where(
      and(
        gte(analyticsEvents.createdAt, startOfDay),
        lt(analyticsEvents.createdAt, endOfDay),
      ),
    );

  const [orderStats] = await db
    .select({
      ordersCount: sql<number>`COUNT(*)`,
      revenue: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
    })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, startOfDay),
        lt(orders.createdAt, endOfDay),
        eq(orders.paymentStatus, "paid"),
      ),
    );

  const existing = await db.query.analyticsDailySummary.findFirst({
    where: eq(analyticsDailySummary.date, dateStr),
  });

  if (existing) {
    db.update(analyticsDailySummary)
      .set({
        uniqueVisitors: viewStats.uniqueVisitors ?? 0,
        pageViews: viewStats.pageViews ?? 0,
        ordersCount: orderStats.ordersCount ?? 0,
        revenue: orderStats.revenue ?? 0,
      })
      .where(eq(analyticsDailySummary.date, dateStr))
      .run();
  } else {
    db.insert(analyticsDailySummary)
      .values({
        id: nanoid(),
        date: dateStr,
        uniqueVisitors: viewStats.uniqueVisitors ?? 0,
        pageViews: viewStats.pageViews ?? 0,
        ordersCount: orderStats.ordersCount ?? 0,
        revenue: orderStats.revenue ?? 0,
      })
      .run();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderLineItems, products } from "@/lib/db/schema";
import { eq, inArray, sql, and, notInArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids") ?? "";
  const productIds = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (productIds.length === 0) {
    return NextResponse.json({ products: [] });
  }

  // Find order IDs that contain any of the given products
  const orderIdsResult = await db
    .selectDistinct({ orderId: orderLineItems.orderId })
    .from(orderLineItems)
    .where(inArray(orderLineItems.productId, productIds));

  const orderIds = orderIdsResult.map((r) => r.orderId);

  if (orderIds.length === 0) {
    return NextResponse.json({ products: [] });
  }

  // Find other products in those orders, ranked by co-occurrence frequency
  const suggestions = await db
    .select({
      productId: orderLineItems.productId,
      freq: sql<number>`COUNT(*)`.as("freq"),
    })
    .from(orderLineItems)
    .where(
      and(
        inArray(orderLineItems.orderId, orderIds),
        notInArray(orderLineItems.productId, productIds),
      ),
    )
    .groupBy(orderLineItems.productId)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(8);

  const suggestedIds = suggestions
    .map((s) => s.productId)
    .filter((id): id is string => id !== null);

  if (suggestedIds.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const suggestedProducts = await db.query.products.findMany({
    where: and(inArray(products.id, suggestedIds), eq(products.status, "active")),
    with: { images: { limit: 1 } },
    limit: 4,
  });

  const result = suggestedProducts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.map((img) => ({ url: img.url, altText: img.altText })),
  }));

  return NextResponse.json({ products: result });
}

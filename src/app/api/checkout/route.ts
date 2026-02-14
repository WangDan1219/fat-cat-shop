import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, customerAddresses, orders, orderLineItems, orderStatusHistory, products } from "@/lib/db/schema";
import { checkoutSchema } from "@/lib/validators";
import { nanoid } from "nanoid";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";

const checkoutRequestSchema = checkoutSchema.extend({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
    }),
  ),
});

function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FC-${datePart}-${randomPart}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutRequestSchema.parse(body);

    if (parsed.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = parsed.items.map((item) => item.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    for (const item of parsed.items) {
      const product = productMap.get(item.productId);
      if (!product || product.status !== "active") {
        return NextResponse.json(
          { error: `Product not found or unavailable: ${item.productId}` },
          { status: 400 },
        );
      }
    }

    const now = new Date().toISOString();
    const customerId = nanoid();
    const orderId = nanoid();
    const orderNumber = generateOrderNumber();

    db.insert(customers)
      .values({
        id: customerId,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    db.insert(customerAddresses)
      .values({
        id: nanoid(),
        customerId,
        addressLine1: parsed.addressLine1,
        addressLine2: parsed.addressLine2 ?? null,
        city: parsed.city,
        state: parsed.state ?? null,
        postalCode: parsed.postalCode ?? null,
        country: parsed.country,
        isDefault: true,
      })
      .run();

    const lineItems = parsed.items.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        id: nanoid(),
        orderId,
        productId: item.productId,
        title: product.title,
        quantity: item.quantity,
        unitPrice: product.price,
        total: product.price * item.quantity,
      };
    });

    const subtotal = lineItems.reduce((sum, li) => sum + li.total, 0);
    const shippingCost = 0;
    const total = subtotal + shippingCost;

    const shippingAddress = JSON.stringify({
      addressLine1: parsed.addressLine1,
      addressLine2: parsed.addressLine2,
      city: parsed.city,
      state: parsed.state,
      postalCode: parsed.postalCode,
      country: parsed.country,
    });

    db.insert(orders)
      .values({
        id: orderId,
        orderNumber,
        customerId,
        status: "pending",
        paymentStatus: parsed.paymentMethod === "cod" ? "unpaid" : "unpaid",
        paymentMethod: parsed.paymentMethod,
        subtotal,
        shippingCost,
        total,
        note: parsed.note ?? null,
        shippingAddress,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    for (const li of lineItems) {
      db.insert(orderLineItems).values(li).run();
    }

    db.insert(orderStatusHistory)
      .values({
        id: nanoid(),
        orderId,
        fromStatus: null,
        toStatus: "pending",
        note: "Order placed",
        createdAt: now,
      })
      .run();

    if (parsed.paymentMethod === "stripe") {
      // Stripe integration placeholder
      // In production, create a Stripe Checkout Session here
      return NextResponse.json({
        orderNumber,
        // checkoutUrl: session.url,
        message: "Stripe integration pending. Use COD for now.",
      });
    }

    return NextResponse.json({ orderNumber });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: err.issues },
        { status: 400 },
      );
    }
    throw err;
  }
}

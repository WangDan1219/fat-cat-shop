import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, customerAddresses } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";

const emailQuerySchema = z.object({
  email: z.string().email(),
});

export async function GET(req: NextRequest) {
  try {
    const emailParam = req.nextUrl.searchParams.get("email") ?? "";
    const parsed = emailQuerySchema.parse({ email: emailParam });

    const customer = db
      .select({
        id: customers.id,
        firstName: customers.firstName,
        lastName: customers.lastName,
        phone: customers.phone,
      })
      .from(customers)
      .where(eq(customers.email, parsed.email))
      .get();

    if (!customer) {
      return NextResponse.json({ found: false });
    }

    const address = db
      .select({
        addressLine1: customerAddresses.addressLine1,
        addressLine2: customerAddresses.addressLine2,
        city: customerAddresses.city,
        state: customerAddresses.state,
        postalCode: customerAddresses.postalCode,
        country: customerAddresses.country,
      })
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, customer.id))
      .orderBy(desc(customerAddresses.id))
      .limit(1)
      .get();

    return NextResponse.json({
      found: true,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address: address ?? null,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email", details: err.issues },
        { status: 400 },
      );
    }
    throw err;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { discountCodes } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { discountCodeSchema } from "@/lib/validators";
import { nanoid } from "nanoid";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const codes = db
    .select()
    .from(discountCodes)
    .orderBy(desc(discountCodes.createdAt))
    .all();

  return NextResponse.json({ codes });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = discountCodeSchema.parse(body);

    // For percentage type, convert 1-100 integer to basis points (multiply by 100)
    const storedValue =
      parsed.type === "percentage" ? parsed.value * 100 : parsed.value;

    const now = new Date().toISOString();
    const id = nanoid();

    db.insert(discountCodes)
      .values({
        id,
        code: parsed.code,
        type: parsed.type,
        value: storedValue,
        maxUses: parsed.maxUses ?? null,
        usedCount: 0,
        perCustomerLimit: parsed.perCustomerLimit,
        expiresAt: parsed.expiresAt ?? null,
        active: parsed.active,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    const created = db
      .select()
      .from(discountCodes)
      .where(eq(discountCodes.id, id))
      .get();

    return NextResponse.json({ code: created }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: err.issues },
        { status: 400 },
      );
    }
    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed")
    ) {
      return NextResponse.json(
        { error: "A discount code with that code already exists" },
        { status: 409 },
      );
    }
    throw err;
  }
}

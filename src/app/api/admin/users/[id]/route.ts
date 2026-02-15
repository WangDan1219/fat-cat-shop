import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Refuse to delete if this is the last admin
  const allAdmins = db.select().from(adminUsers).all();
  if (allAdmins.length <= 1) {
    return NextResponse.json(
      { error: "Cannot delete the last admin user" },
      { status: 400 },
    );
  }

  const existing = db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .get();

  if (!existing) {
    return NextResponse.json(
      { error: "Admin user not found" },
      { status: 404 },
    );
  }

  db.delete(adminUsers).where(eq(adminUsers.id, id)).run();

  return NextResponse.json({ success: true });
}

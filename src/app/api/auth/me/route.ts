import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = db
    .select({
      id: adminUsers.id,
      username: adminUsers.username,
      displayName: adminUsers.displayName,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.userId))
    .get();

  if (!dbUser) {
    return NextResponse.json({
      userId: session.userId,
      username: session.username,
      displayName: session.username,
    });
  }

  return NextResponse.json({
    userId: dbUser.id,
    username: dbUser.username,
    displayName: dbUser.displayName,
  });
}

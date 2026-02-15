import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import {
  createSession,
  hashPassword,
  verifyPassword,
  getEnvCredentials,
} from "@/lib/auth";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    // Check DB for matching admin user
    const dbUser = db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .get();

    if (dbUser) {
      const valid = await verifyPassword(password, dbUser.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      // Update lastLoginAt
      db.update(adminUsers)
        .set({ lastLoginAt: new Date().toISOString() })
        .where(eq(adminUsers.id, dbUser.id))
        .run();

      await createSession({ userId: dbUser.id, username: dbUser.username });
      return NextResponse.json({ success: true });
    }

    // If table is empty, fall back to env-var credentials
    const allAdmins = db.select().from(adminUsers).all();
    if (allAdmins.length > 0) {
      // DB has users but none matched
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Fallback to env vars
    const envCreds = getEnvCredentials();
    if (username !== envCreds.username || password !== envCreds.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Auto-create DB admin record on first env-var login
    const now = new Date().toISOString();
    const passwordHash = await hashPassword(password);
    const newUser = {
      id: nanoid(),
      username: envCreds.username,
      email: `${envCreds.username}@localhost`,
      passwordHash,
      displayName: "Admin",
      createdAt: now,
      lastLoginAt: now,
    };

    db.insert(adminUsers).values(newUser).run();

    await createSession({ userId: newUser.id, username: newUser.username });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 },
    );
  }
}

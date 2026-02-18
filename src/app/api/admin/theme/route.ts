import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { getSiteSettings, setSiteSetting } from "@/lib/site-settings";
import { PRESETS } from "@/lib/theme/presets";
import type { StoredThemeConfig } from "@/lib/theme/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  const raw = settings.theme_config;

  if (!raw) {
    return NextResponse.json({ preset: "manga", customOverrides: {} });
  }

  try {
    const config: StoredThemeConfig = JSON.parse(raw);
    return NextResponse.json({
      preset: config.preset,
      customOverrides: config.customOverrides ?? {},
    });
  } catch {
    return NextResponse.json({ preset: "manga", customOverrides: {} });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { preset, customOverrides } = body;

    if (!preset || typeof preset !== "string") {
      return NextResponse.json(
        { error: "preset is required" },
        { status: 400 },
      );
    }

    if (!PRESETS[preset]) {
      return NextResponse.json(
        { error: `Unknown preset: ${preset}` },
        { status: 400 },
      );
    }

    const config: StoredThemeConfig = {
      preset,
      customOverrides: customOverrides ?? undefined,
    };

    await setSiteSetting("theme_config", JSON.stringify(config));
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save theme" },
      { status: 500 },
    );
  }
}

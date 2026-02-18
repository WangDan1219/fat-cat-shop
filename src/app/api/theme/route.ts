import { NextResponse } from "next/server";
import { getActiveTheme } from "@/lib/theme/get-active-theme";
import { buildCssVars } from "@/lib/theme/build-css-vars";

export const dynamic = "force-dynamic";

export async function GET() {
  const activeTheme = await getActiveTheme();
  const cssVars = buildCssVars(activeTheme.preset, activeTheme.customOverrides);
  return NextResponse.json({
    presetId: activeTheme.preset.id,
    cssVars,
  });
}

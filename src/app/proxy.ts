import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    // Rewrite /uploads/* to the API route that serves files
    if (request.nextUrl.pathname.startsWith("/uploads/")) {
        const filename = request.nextUrl.pathname.replace("/uploads/", "");
        return NextResponse.rewrite(
            new URL(`/api/uploads/${filename}`, request.url),
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/uploads/:path*"],
};

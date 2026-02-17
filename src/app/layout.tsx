import type { Metadata } from "next";
import { Baloo_2, Comic_Neue } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";

const baloo2 = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const comicNeue = Comic_Neue({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings.site_title,
      template: `%s | ${settings.site_title}`,
    },
    description: settings.site_description,
    icons: settings.favicon_url
      ? { icon: settings.favicon_url }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baloo2.variable} ${comicNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

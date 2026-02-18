import type { Metadata } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";

const rajdhani = Rajdhani({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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
      <body className={`${rajdhani.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

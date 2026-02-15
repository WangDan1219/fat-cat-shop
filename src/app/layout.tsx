import type { Metadata } from "next";
import { Comfortaa, Epilogue } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";

const comfortaa = Comfortaa({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const epilogue = Epilogue({
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
      <body className={`${comfortaa.variable} ${epilogue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

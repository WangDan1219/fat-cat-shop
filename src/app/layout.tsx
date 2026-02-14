import type { Metadata } from "next";
import { Comfortaa, Epilogue } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Fat Cat Shop",
    template: "%s | Fat Cat Shop",
  },
  description:
    "Your one-stop shop for happy cats. Premium toys, treats, and accessories for your feline friends.",
};

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

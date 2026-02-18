import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { ThemeHotReload } from "@/components/storefront/theme-hot-reload";
import { getSiteSettings } from "@/lib/site-settings";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <ThemeHotReload />
      <Header shopName={settings.shop_name} />
      <main className="flex-1">{children}</main>
      <Footer
        shopName={settings.shop_name}
        tagline={settings.footer_text}
        copyrightName={settings.footer_copyright}
      />
    </div>
  );
}

import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

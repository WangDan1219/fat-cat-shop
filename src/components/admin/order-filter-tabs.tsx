"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "All", value: "" },
  { label: "Unfulfilled", value: "unfulfilled" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export function OrderFilterTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStatus = searchParams.get("status") ?? "";

  function handleTabClick(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabClick(tab.value)}
          className={cn(
            "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
            currentStatus === tab.value
              ? "bg-teal-primary text-white"
              : "bg-white text-warm-brown/70 hover:bg-warm-gray hover:text-warm-brown shadow-sm"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

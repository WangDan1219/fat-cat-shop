"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DiscountToggleProps {
  id: string;
  active: boolean;
}

export function DiscountToggle({ id, active: initialActive }: DiscountToggleProps) {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (res.ok) {
        setActive((prev) => !prev);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteCode() {
    if (!confirm("Delete this discount code?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={loading}
        className="rounded px-2 py-1 text-xs font-semibold text-teal-primary hover:underline disabled:opacity-50"
      >
        {active ? "Deactivate" : "Activate"}
      </button>
      <button
        onClick={deleteCode}
        disabled={loading}
        className="rounded px-2 py-1 text-xs font-semibold text-red-500 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}

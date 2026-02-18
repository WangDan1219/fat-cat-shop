"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleDelete() {
    setDialogOpen(false);
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className="rounded-lg px-3 py-1 text-sm text-red-500 transition-colors hover:bg-red-50"
      >
        Delete
      </button>
      <ConfirmDialog
        open={dialogOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}

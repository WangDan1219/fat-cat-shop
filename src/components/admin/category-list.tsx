"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "./category-form";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  productCount: number;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleteError(null);
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete category");
      }

      router.refresh();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete category",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-warm-brown">
          Categories
        </h1>
        <button
          onClick={() => {
            setShowNew(true);
            setEditingId(null);
          }}
          className="rounded-full bg-teal-primary px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-dark"
        >
          New Category
        </button>
      </div>

      {deleteError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteError}
          <button
            onClick={() => setDeleteError(null)}
            className="ml-2 font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-brown/10">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Sort
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Products
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-brown/5">
            {showNew && (
              <CategoryForm onCancel={() => setShowNew(false)} />
            )}
            {categories.map((cat) =>
              editingId === cat.id ? (
                <CategoryForm
                  key={cat.id}
                  category={cat}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <tr key={cat.id} className="hover:bg-warm-gray/50">
                  <td className="px-6 py-4 text-sm text-warm-brown/70">
                    {cat.sortOrder}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-sm font-medium text-warm-brown">
                        {cat.name}
                      </span>
                      <span className="ml-2 text-xs text-warm-brown/40">
                        {cat.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-warm-brown/70">
                    {cat.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-warm-brown/70">
                    {cat.productCount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setShowNew(false);
                        }}
                        className="rounded-lg px-3 py-1 text-sm text-teal-primary transition-colors hover:bg-teal-primary/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deletingId === cat.id}
                        className="rounded-lg px-3 py-1 text-sm text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === cat.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {categories.length === 0 && !showNew && (
          <p className="px-6 py-8 text-center text-sm text-warm-brown/50">
            No categories yet. Create your first category!
          </p>
        )}
      </div>
    </div>
  );
}

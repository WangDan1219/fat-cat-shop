"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  productCount: number;
}

interface CategoryFormProps {
  category?: Category;
  onCancel: () => void;
}

export function CategoryForm({ category, onCancel }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        sortOrder,
      };

      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const method = category ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save category");
      }

      router.refresh();
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="bg-teal-primary/5">
      <td className="px-6 py-3" colSpan={5}>
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-warm-brown/60">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-warm-brown/20 px-3 py-1.5 text-sm focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
              placeholder="Category name"
            />
            {slug && (
              <span className="mt-0.5 block text-xs text-warm-brown/40">
                Slug: {slug}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-warm-brown/60">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-warm-brown/20 px-3 py-1.5 text-sm focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
              placeholder="Optional description"
            />
          </div>

          <div className="w-24">
            <label className="mb-1 block text-xs font-medium text-warm-brown/60">
              Sort Order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              min={0}
              className="w-full rounded-lg border border-warm-brown/20 px-3 py-1.5 text-sm focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-teal-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
            >
              {saving ? "Saving..." : category ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-1.5 text-sm font-medium text-warm-brown/60 transition-colors hover:bg-warm-gray"
            >
              Cancel
            </button>
          </div>

          {error && (
            <p className="w-full text-sm text-red-600">{error}</p>
          )}
        </form>
      </td>
    </tr>
  );
}

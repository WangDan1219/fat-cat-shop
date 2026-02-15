"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    compareAtPrice: number | null;
    categoryId: string | null;
    status: string;
    tags: string | null;
  };
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [form, setForm] = useState({
    title: product?.title ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product ? (product.price / 100).toFixed(2) : "",
    compareAtPrice: product?.compareAtPrice
      ? (product.compareAtPrice / 100).toFixed(2)
      : "",
    categoryId: product?.categoryId ?? "",
    status: product?.status ?? "draft",
    tags: product?.tags ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !isEditing) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const priceInCents = Math.round(parseFloat(form.price) * 100);
      const compareAtPriceInCents = form.compareAtPrice
        ? Math.round(parseFloat(form.compareAtPrice) * 100)
        : null;

      const body = {
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        price: priceInCents,
        compareAtPrice: compareAtPriceInCents,
        categoryId: form.categoryId || null,
        status: form.status,
        tags: form.tags || null,
      };

      const url = isEditing
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-xl bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-warm-brown/70">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-warm-brown/70">
          Slug <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          required
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-warm-brown/70">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-warm-brown/70">
            Price (GBP) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            required
            className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-warm-brown/70">
            Compare at Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.compareAtPrice}
            onChange={(e) => updateField("compareAtPrice", e.target.value)}
            className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-warm-brown/70">
          Category
        </label>
        <select
          value={form.categoryId}
          onChange={(e) => updateField("categoryId", e.target.value)}
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-warm-brown/70">
          Status <span className="text-red-400">*</span>
        </label>
        <select
          value={form.status}
          onChange={(e) => updateField("status", e.target.value)}
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-warm-brown/70">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => updateField("tags", e.target.value)}
          placeholder="e.g., toy, interactive, bestseller"
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-teal-primary px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-warm-brown/20 px-8 py-2.5 text-sm font-medium text-warm-brown transition-colors hover:bg-warm-gray"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

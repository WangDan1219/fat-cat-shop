import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    with: { images: true, category: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-warm-brown">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-teal-primary px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-dark"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-brown/10">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-brown/5">
            {allProducts.map((product) => (
              <tr key={product.id} className="hover:bg-warm-gray/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-warm-gray">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-warm-brown/20 text-xs">
                          —
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-warm-brown">
                      {product.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-warm-brown/70">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-warm-brown">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg px-3 py-1 text-sm text-teal-primary transition-colors hover:bg-teal-primary/10"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allProducts.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-warm-brown/50">
            No products yet. Create your first product!
          </p>
        )}
      </div>
    </div>
  );
}

import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-warm-brown">
        New Product
      </h1>
      <div className="mt-6">
        <ProductForm categories={allCategories} />
      </div>
    </div>
  );
}

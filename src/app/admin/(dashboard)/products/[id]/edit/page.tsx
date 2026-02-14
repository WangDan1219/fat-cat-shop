import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { images: true },
  });

  if (!product) {
    notFound();
  }

  const allCategories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-warm-brown">
        Edit Product
      </h1>
      <div className="mt-6">
        <ProductForm product={product} categories={allCategories} />
      </div>
    </div>
  );
}

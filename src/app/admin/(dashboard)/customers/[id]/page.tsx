import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, id),
    with: {
      addresses: true,
      orders: {
        with: { lineItems: true },
        orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      },
    },
  });

  if (!customer) notFound();

  const totalSpend = customer.orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/customers"
          className="text-sm text-warm-brown/60 hover:text-teal-primary"
        >
          &larr; Customers
        </Link>
        <h1 className="font-display text-2xl font-bold text-warm-brown">
          {customer.firstName} {customer.lastName}
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Orders */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-warm-brown">
              Order History
            </h2>
            {customer.orders.length === 0 ? (
              <p className="mt-4 text-sm text-warm-brown/50">No orders yet.</p>
            ) : (
              <div className="mt-4 divide-y divide-warm-brown/5">
                {customer.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3">
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-teal-primary hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-xs text-warm-brown/60">
                        {order.lineItems.length} item{order.lineItems.length !== 1 ? "s" : ""} &middot; <span className="capitalize">{order.status}</span>
                      </p>
                    </div>
                    <p className="text-sm font-bold text-warm-brown">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {customer.orders.length > 0 && (
              <div className="mt-4 border-t border-warm-brown/10 pt-4 flex justify-between text-sm font-bold">
                <span className="text-warm-brown">Total spend</span>
                <span className="text-teal-primary">{formatPrice(totalSpend)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contact + Addresses */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-warm-brown">Contact</h2>
            <div className="mt-4 space-y-2 text-sm text-warm-brown">
              {customer.email && <p>{customer.email}</p>}
              {customer.phone && <p>{customer.phone}</p>}
              {!customer.email && !customer.phone && (
                <p className="text-warm-brown/50">No contact info</p>
              )}
            </div>
          </div>

          {/* Addresses */}
          {customer.addresses.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-warm-brown">Addresses</h2>
              <div className="mt-4 space-y-4">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="text-sm text-warm-brown leading-relaxed">
                    {addr.isDefault && (
                      <span className="mb-1 inline-block rounded-full bg-teal-primary/10 px-2 py-0.5 text-xs font-medium text-teal-primary">
                        Default
                      </span>
                    )}
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>
                      {addr.city}
                      {addr.state ? `, ${addr.state}` : ""}
                      {addr.postalCode ? ` ${addr.postalCode}` : ""}
                    </p>
                    <p>{addr.country}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer note */}
          {customer.note && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-warm-brown">Note</h2>
              <p className="mt-4 text-sm text-warm-brown/80">{customer.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

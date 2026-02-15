import { db } from "@/lib/db";
import { orders, adminUsers } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { OrderTimeline } from "@/components/admin/order-timeline";
import Link from "next/link";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      customer: { with: { addresses: true } },
      lineItems: true,
      statusHistory: {
        orderBy: (h, { desc }) => [desc(h.createdAt)],
      },
    },
  });

  if (!order) notFound();

  // Look up admin display names for status history entries
  const changedByIds = order.statusHistory
    .map((h) => h.changedBy)
    .filter((id): id is string => id !== null);

  const uniqueIds = [...new Set(changedByIds)];
  const adminNameMap: Record<string, string> = {};

  if (uniqueIds.length > 0) {
    const admins = await db
      .select({ id: adminUsers.id, displayName: adminUsers.displayName, username: adminUsers.username })
      .from(adminUsers)
      .where(inArray(adminUsers.username, uniqueIds));

    for (const admin of admins) {
      adminNameMap[admin.username] = admin.displayName;
    }
  }

  const shippingAddr = order.shippingAddress
    ? JSON.parse(order.shippingAddress)
    : null;

  return (
    <div>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="text-sm text-warm-brown/60 hover:text-teal-primary"
        >
          &larr; Orders
        </Link>
        <h1 className="font-display text-2xl font-bold text-warm-brown">
          {order.orderNumber}
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Line Items */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-warm-brown">
              Items
            </h2>
            <div className="mt-4 divide-y divide-warm-brown/5">
              {order.lineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-warm-brown">
                      {item.title}
                    </p>
                    <p className="text-xs text-warm-brown/60">
                      {formatPrice(item.unitPrice)} &times; {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-warm-brown">
                    {formatPrice(item.total)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-warm-brown/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warm-brown/60">Subtotal</span>
                <span className="text-warm-brown">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-brown/60">Shipping</span>
                <span className="text-warm-brown">
                  {formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-warm-brown">Total</span>
                <span className="text-teal-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-warm-brown">
              Status History
            </h2>
            <div className="mt-4">
              <OrderTimeline
                entries={order.statusHistory}
                adminNames={adminNameMap}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Update */}
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
          />

          {/* Customer Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-warm-brown">
              Customer
            </h2>
            {order.customer ? (
              <div className="mt-4 space-y-2 text-sm text-warm-brown">
                <p className="font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                {order.customer.email && <p>{order.customer.email}</p>}
                {order.customer.phone && <p>{order.customer.phone}</p>}
              </div>
            ) : (
              <p className="mt-4 text-sm text-warm-brown/50">No customer</p>
            )}
          </div>

          {/* Shipping Address */}
          {shippingAddr && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-warm-brown">
                Shipping Address
              </h2>
              <div className="mt-4 text-sm text-warm-brown leading-relaxed">
                <p>{shippingAddr.addressLine1}</p>
                {shippingAddr.addressLine2 && (
                  <p>{shippingAddr.addressLine2}</p>
                )}
                <p>
                  {shippingAddr.city}
                  {shippingAddr.state ? `, ${shippingAddr.state}` : ""}
                  {shippingAddr.postalCode ? ` ${shippingAddr.postalCode}` : ""}
                </p>
                <p>{shippingAddr.country}</p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-warm-brown">
              Payment
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <p className="capitalize text-warm-brown">
                Method: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Stripe"}
              </p>
              <p className="capitalize text-warm-brown">
                Status: {order.paymentStatus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

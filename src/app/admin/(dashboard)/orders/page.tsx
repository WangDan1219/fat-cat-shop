import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const allOrders = await db.query.orders.findMany({
    with: { customer: true, lineItems: true },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-warm-brown">
        Orders
      </h1>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-brown/10">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Items
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-brown/5">
            {allOrders.map((order) => (
              <tr key={order.id} className="hover:bg-warm-gray/50">
                <td className="px-6 py-4 text-sm font-medium text-teal-primary">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 text-sm text-warm-brown">
                  {order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "refunded"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-warm-brown/70">
                  {order.lineItems.length} items
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-warm-brown">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-lg px-3 py-1 text-sm text-teal-primary transition-colors hover:bg-teal-primary/10"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allOrders.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-warm-brown/50">
            No orders yet
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}

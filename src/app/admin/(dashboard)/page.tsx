import { db } from "@/lib/db";
import { products, orders, customers } from "@/lib/db/schema";
import { count, eq, sql } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [productCount] = await db.select({ count: count() }).from(products);
  const [orderCount] = await db.select({ count: count() }).from(orders);
  const [customerCount] = await db.select({ count: count() }).from(customers);
  const [revenueResult] = await db
    .select({ total: sql<number>`COALESCE(SUM(${orders.total}), 0)` })
    .from(orders)
    .where(eq(orders.paymentStatus, "paid"));

  const stats = [
    { label: "Products", value: productCount.count.toString() },
    { label: "Orders", value: orderCount.count.toString() },
    { label: "Customers", value: customerCount.count.toString() },
    { label: "Revenue", value: formatPrice(revenueResult.total) },
  ];

  const recentOrders = await db.query.orders.findMany({
    with: { customer: true },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    limit: 5,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-warm-brown">
        Dashboard
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-warm-brown/60">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-warm-brown">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-warm-brown">
          Recent Orders
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
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
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-brown/5">
              {recentOrders.map((order) => (
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
                    <span className="inline-flex rounded-full bg-peach px-2.5 py-0.5 text-xs font-medium capitalize text-warm-brown">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-warm-brown">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-warm-brown/50"
                  >
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

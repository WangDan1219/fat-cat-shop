import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminCustomersPage() {
  const allCustomers = await db.query.customers.findMany({
    with: { orders: true },
    orderBy: (customers, { desc }) => [desc(customers.createdAt)],
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-warm-brown">
        Customers
      </h1>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-brown/10">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Phone
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Orders
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-warm-brown/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-brown/5">
            {allCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-warm-gray/50">
                <td className="px-6 py-4 text-sm font-medium text-warm-brown">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-warm-brown/70">
                  {customer.email ?? "—"}
                </td>
                <td className="px-6 py-4 text-sm text-warm-brown/70">
                  {customer.phone ?? "—"}
                </td>
                <td className="px-6 py-4 text-right text-sm text-warm-brown">
                  {customer.orders.length}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="rounded-lg px-3 py-1 text-sm text-teal-primary transition-colors hover:bg-teal-primary/10"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allCustomers.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-warm-brown/50">
            No customers yet
          </p>
        )}
      </div>
    </div>
  );
}

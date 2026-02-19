import { db } from "@/lib/db";
import { discountCodes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { DiscountToggle } from "./discount-toggle";

export default async function DiscountsPage() {
  const codes = db
    .select()
    .from(discountCodes)
    .orderBy(desc(discountCodes.createdAt))
    .all();

  function displayValue(type: string, value: number) {
    if (type === "percentage") {
      // value is basis points — divide by 100 to get %
      return `${value / 100}%`;
    }
    return formatPrice(value);
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-warm-brown">
          Discount Codes
        </h1>
        <Link
          href="/admin/discounts/new"
          className="rounded-full bg-teal-primary px-6 py-2 text-sm font-bold text-white hover:bg-teal-dark"
        >
          + New Code
        </Link>
      </div>

      {codes.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-warm-brown/60">No discount codes yet.</p>
          <Link
            href="/admin/discounts/new"
            className="mt-4 inline-block rounded-full bg-teal-primary px-6 py-2 text-sm font-bold text-white hover:bg-teal-dark"
          >
            Create your first code
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-warm-brown/10 bg-warm-gray">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-warm-brown/70">Code</th>
                <th className="px-6 py-3 text-left font-semibold text-warm-brown/70">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-warm-brown/70">Value</th>
                <th className="px-6 py-3 text-left font-semibold text-warm-brown/70">Uses</th>
                <th className="px-6 py-3 text-left font-semibold text-warm-brown/70">Per Customer</th>
                <th className="px-6 py-3 text-left font-semibold text-warm-brown/70">Expires</th>
                <th className="px-6 py-3 text-left font-semibold text-warm-brown/70">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-brown/10">
              {codes.map((code) => (
                <tr key={code.id} className="hover:bg-warm-gray/50">
                  <td className="px-6 py-4 font-mono font-bold text-warm-brown">
                    {code.code}
                  </td>
                  <td className="px-6 py-4 capitalize text-warm-brown/70">
                    {code.type}
                  </td>
                  <td className="px-6 py-4 font-semibold text-warm-brown">
                    {displayValue(code.type, code.value)}
                  </td>
                  <td className="px-6 py-4 text-warm-brown/70">
                    {code.usedCount}
                    {code.maxUses !== null ? ` / ${code.maxUses}` : " / ∞"}
                  </td>
                  <td className="px-6 py-4 text-warm-brown/70">
                    {code.perCustomerLimit}×
                  </td>
                  <td className="px-6 py-4 text-warm-brown/70">
                    {code.expiresAt
                      ? new Date(code.expiresAt).toLocaleDateString("en-GB")
                      : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        code.active
                          ? "bg-green-100 text-green-800"
                          : "bg-warm-gray text-warm-brown/60"
                      }`}
                    >
                      {code.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <DiscountToggle id={code.id} active={code.active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { DashboardOrderCard } from "@/components/admin/dashboard-order-card";

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  createdAt: string;
  status: string;
}

interface DashboardOrderColumnProps {
  title: string;
  accentColor: "amber" | "blue" | "green";
  orders: OrderData[];
  count: number;
}

const accentStyles = {
  amber: {
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-200",
  },
  blue: {
    badge: "bg-blue-100 text-blue-800",
    border: "border-blue-200",
  },
  green: {
    badge: "bg-green-100 text-green-800",
    border: "border-green-200",
  },
};

export function DashboardOrderColumn({
  title,
  accentColor,
  orders,
  count,
}: DashboardOrderColumnProps) {
  const styles = accentStyles[accentColor];

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className={`flex items-center justify-between border-b ${styles.border} px-4 py-3`}>
        <h3 className="font-display text-sm font-bold text-warm-brown">
          {title}
        </h3>
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium ${styles.badge}`}
        >
          {count}
        </span>
      </div>
      <div className="space-y-2 p-3">
        {orders.length === 0 ? (
          <p className="py-4 text-center text-xs text-warm-brown/40">
            No orders
          </p>
        ) : (
          orders.map((order) => (
            <DashboardOrderCard
              key={order.id}
              id={order.id}
              orderNumber={order.orderNumber}
              customerName={order.customerName}
              total={order.total}
              createdAt={order.createdAt}
              status={order.status}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface StatusHistoryEntry {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  changedBy: string | null;
  note: string | null;
  createdAt: string;
}

interface OrderTimelineProps {
  entries: StatusHistoryEntry[];
  adminNames: Record<string, string>;
}

const statusColors: Record<string, { dot: string; label: string }> = {
  pending: { dot: "bg-yellow-400", label: "text-yellow-700" },
  confirmed: { dot: "bg-blue-500", label: "text-blue-700" },
  shipped: { dot: "bg-purple-500", label: "text-purple-700" },
  delivered: { dot: "bg-green-500", label: "text-green-700" },
  cancelled: { dot: "bg-red-500", label: "text-red-700" },
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function OrderTimeline({ entries, adminNames }: OrderTimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-warm-brown/50">No status history yet</p>
    );
  }

  return (
    <div className="relative space-y-0">
      {entries.map((entry, index) => {
        const colors = statusColors[entry.toStatus] ?? {
          dot: "bg-gray-400",
          label: "text-gray-700",
        };
        const isLast = index === entries.length - 1;
        const adminName = entry.changedBy
          ? adminNames[entry.changedBy] ?? entry.changedBy
          : null;

        return (
          <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connecting line */}
            {!isLast && (
              <div className="absolute left-[9px] top-5 h-full w-0.5 bg-warm-brown/10" />
            )}

            {/* Status dot */}
            <div className="relative z-10 mt-1 flex-shrink-0">
              <div
                className={`h-[18px] w-[18px] rounded-full border-2 border-white shadow-sm ${colors.dot}`}
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold capitalize ${colors.label}`}
                >
                  {entry.toStatus}
                </span>
                {entry.fromStatus && (
                  <span className="text-xs text-warm-brown/40">
                    from {entry.fromStatus}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-warm-brown/50">
                {formatTimestamp(entry.createdAt)}
                {adminName && (
                  <span> &middot; {adminName}</span>
                )}
              </p>
              {entry.note && (
                <p className="mt-1 rounded-lg bg-warm-gray/50 px-3 py-1.5 text-xs text-warm-brown/70">
                  {entry.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

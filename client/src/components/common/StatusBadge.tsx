type Props = {
  status: string;
};

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    dotClassName:
      "bg-emerald-400 shadow-[0_0_7px_rgba(74,222,128,0.7)]",
  },

  OVERDUE: {
    label: "Overdue",
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
    dotClassName:
      "bg-red-400 shadow-[0_0_7px_rgba(248,113,113,0.7)]",
  },

  PTP: {
    label: "Promise to Pay",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
    dotClassName:
      "bg-amber-400 shadow-[0_0_7px_rgba(251,191,36,0.7)]",
  },

  PAID: {
    label: "Paid",
    className:
      "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
    dotClassName:
      "bg-indigo-400 shadow-[0_0_7px_rgba(129,140,248,0.7)]",
  },

  CLOSED: {
    label: "Closed",
    className:
      "border-slate-700 bg-slate-800/70 text-slate-400",
    dotClassName: "bg-slate-500",
  },
};

export function StatusBadge({ status }: Props) {
  const config = statusConfig[status] ?? {
    label: status,
    className:
      "border-slate-700 bg-slate-800/70 text-slate-400",
    dotClassName: "bg-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`}
      />

      {config.label}
    </span>
  );
}
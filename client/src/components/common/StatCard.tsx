import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string | number;
  icon?: ReactNode;
};

export function StatCard({ title, value, icon }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-[#131C2D] hover:shadow-xl hover:shadow-black/20 sm:p-6">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/5 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/10" />

      {/* Top accent */}
      <div className="absolute left-0 top-0 h-[2px] w-0 bg-indigo-500 transition-all duration-500 group-hover:w-full" />

      <div className="relative flex items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </p>

          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />

            <p className="text-[11px] font-medium text-slate-500">
              Current portfolio
            </p>
          </div>
        </div>

        {/* Icon */}
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/10 bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/20 group-hover:bg-indigo-500/15 group-hover:text-indigo-300">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
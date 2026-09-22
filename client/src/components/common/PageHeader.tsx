import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  title,
  description,
  action,
}: Props) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {/* Title */}
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
              CollectionHub
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>

        {/* Action */}
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
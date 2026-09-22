import { AlertCircle, RotateCcw } from "lucide-react";

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-[#111827] p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/10 text-red-400">
          <AlertCircle size={21} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-300">
            Something went wrong
          </p>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-700 bg-[#151C2B] px-3.5 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            >
              <RotateCcw size={14} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
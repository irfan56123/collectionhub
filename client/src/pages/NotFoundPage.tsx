import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/5">
          <SearchX size={34} strokeWidth={1.8} />
        </div>

        {/* 404 */}
        <p className="mt-7 text-7xl font-black tracking-tight text-white sm:text-8xl">
          404
        </p>

        <div className="mx-auto mt-4 h-px w-16 bg-indigo-500/40" />

        <h1 className="mt-5 text-xl font-bold text-white sm:text-2xl">
          Page not found
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/20"
          >
            <Home size={16} />
            Go to Dashboard
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#151C2B] px-5 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        {/* Footer label */}
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
          CollectionHub
        </p>
      </div>
    </div>
  );
}
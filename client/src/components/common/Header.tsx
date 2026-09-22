import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  CircleHelp,
} from "lucide-react";

type Props = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-[#0B0F19]/95 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-sm font-semibold text-white sm:text-[15px]">
                Collection Operations
              </h1>

              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-400 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
                Active
              </span>
            </div>

            <p className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">
              Loan portfolio management workspace
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 sm:flex"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Help */}
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 md:flex"
            aria-label="Help"
          >
            <CircleHelp size={18} />
          </button>

          {/* Notification */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
            aria-label="Notifications"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-[#0B0F19]" />
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-7 w-px bg-slate-800 sm:block" />

          {/* Profile */}
          <button
            type="button"
            className="group flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-slate-800/70"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-600/20">
              IA
            </div>

            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-200">
                Collection Admin
              </p>

              <p className="text-[10px] text-slate-500">
                Operations
              </p>
            </div>

            <ChevronDown
              size={14}
              className="hidden text-slate-500 transition group-hover:text-slate-300 md:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
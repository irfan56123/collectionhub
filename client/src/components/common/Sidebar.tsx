import {
  LayoutDashboard,
  WalletCards,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type Props = {
  mobileOpen: boolean;
  onClose: () => void;
};

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Loan Accounts",
    path: "/loans",
    icon: WalletCards,
  },
];

export function Sidebar({ mobileOpen, onClose }: Props) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#080C14] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <WalletCards size={20} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-white">
                CollectionHub
              </p>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Collection Operations
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <div className="mb-3 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              Workspace
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "bg-slate-900 text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-200"
                        }`}
                      >
                        <Icon size={17} strokeWidth={2} />
                      </span>

                      <span className="flex-1">{item.label}</span>

                      <ChevronRight
                        size={15}
                        className={`transition-transform duration-200 ${
                          isActive
                            ? "translate-x-0 text-indigo-200"
                            : "-translate-x-1 text-slate-700 group-hover:translate-x-0 group-hover:text-slate-500"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Workspace Card */}
        <div className="shrink-0 border-t border-slate-800 p-3">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] p-4">
            {/* Decorative glow */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-600/10 blur-2xl" />

            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Sparkles size={16} />
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-400">
                  Active
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-200">
                Collection Workspace
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Manage loan accounts and follow-up activities.
              </p>
            </div>
          </div>

          <p className="px-2 pt-3 text-center text-[9px] font-medium uppercase tracking-widest text-slate-700">
            CollectionHub v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
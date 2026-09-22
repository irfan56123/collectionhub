import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { LoanTable } from "../components/loans/LoanTable";
import { api } from "../services/api";
import type { LoanAccount } from "../types/loan";

export function LoansPage() {
  const [loans, setLoans] = useState<LoanAccount[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/loans");
      setLoans(response.data.data);
    } catch (error) {
      console.error("Failed to fetch loans:", error);

      setError(
        "Unable to load loan accounts. Please check the server connection.",
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        loan.borrowerName.toLowerCase().includes(searchValue) ||
        loan.accountNumber.toLowerCase().includes(searchValue);

      const matchesStatus = !status || loan.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [loans, search, status]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Loan Accounts"
        description="Manage borrower accounts and collection status."
        action={
          <Link
            to="/loans/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition hover:bg-indigo-500 hover:shadow-indigo-600/20"
          >
            <Plus size={17} />
            Add Loan Account
          </Link>
        }
      />

      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search borrower or account..."
              className="h-11 w-full rounded-xl border border-slate-800 bg-[#151C2B] pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:bg-[#172033] focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* Filter */}
          <div className="flex w-full items-center gap-3 lg:w-auto">
            <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:flex">
              <SlidersHorizontal size={15} />
              Filter
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 w-full min-w-[180px] rounded-xl border border-slate-800 bg-[#151C2B] px-4 text-sm font-medium text-slate-300 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="OVERDUE">Overdue</option>
              <option value="PTP">Promise to Pay</option>
              <option value="PAID">Paid</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-800 bg-[#111827]">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-800 border-t-indigo-500" />

            <p className="mt-3 text-sm text-slate-500">
              Loading loan accounts...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-red-400">
                Unable to load loan accounts
              </p>

              <p className="mt-1 text-sm text-red-400/70">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLoans}
              className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <LoanTable
          loans={filteredLoans}
          onDeleted={fetchLoans}
        />
      )}

      {/* Results info */}
      {!loading && !error && (
        <div className="flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-400">
              {filteredLoans.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-400">
              {loans.length}
            </span>{" "}
            loan accounts
          </p>

          {(search || status) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("");
              }}
              className="w-fit font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
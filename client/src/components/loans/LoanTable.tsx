import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUpRight,
  WalletCards,
} from "lucide-react";

import { StatusBadge } from "../common/StatusBadge";
import type { LoanAccount } from "../../types/loan";
import { api } from "../../services/api";

type Props = {
  loans: LoanAccount[];
  onDeleted: () => void;
};

export function LoanTable({ loans, onDeleted }: Props) {
  async function handleDelete(
    id: string,
    accountNumber: string,
  ) {
    const confirmed = window.confirm(
      `Delete loan account ${accountNumber}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/loans/${id}`);
      onDeleted();
    } catch (error) {
      console.error("Failed to delete loan:", error);
      alert("Failed to delete loan account.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
      {/* Table Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <WalletCards size={19} />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Loan Portfolio
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {loans.length} account
              {loans.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-slate-800 bg-[#151C2B] px-3 py-1.5 text-[11px] font-semibold text-slate-400">
            Collection
          </span>

          <span className="rounded-lg border border-indigo-500/10 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold text-indigo-400">
            {loans.length} Records
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="border-b border-slate-800 bg-[#151C2B]/60">
            <tr>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                Account
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                Borrower
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                POS
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                Due Date
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                DPD
              </th>

              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                Status
              </th>

              <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {loans.map((loan) => {
              const isOverdue = loan.dpd > 0;

              return (
                <tr
                  key={loan.id}
                  className="group transition-colors duration-200 hover:bg-indigo-500/[0.035]"
                >
                  {/* Account */}
                  <td className="px-5 py-4">
                    <Link
                      to={`/loans/${loan.id}`}
                      className="group/account inline-flex items-center gap-2"
                    >
                      <span className="font-semibold text-slate-200 transition group-hover/account:text-indigo-400">
                        {loan.accountNumber}
                      </span>

                      <ArrowUpRight
                        size={13}
                        className="text-slate-700 opacity-0 transition group-hover/account:text-indigo-400 group-hover/account:opacity-100"
                      />
                    </Link>
                  </td>

                  {/* Borrower */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400">
                        {loan.borrowerName
                          .split(" ")
                          .map((name) => name[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-slate-300">
                          {loan.borrowerName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-600">
                          Loan borrower
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* POS */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-200">
                      ₹
                      {Number(
                        loan.principalOutstanding,
                      ).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      Principal outstanding
                    </p>
                  </td>

                  {/* Due Date */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-400">
                      {new Date(
                        loan.dueDate,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>

                  {/* DPD */}
                  <td className="px-5 py-4">
                    <span
                      className={
                        isOverdue
                          ? "inline-flex rounded-lg border border-red-500/10 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-400"
                          : "inline-flex rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-500"
                      }
                    >
                      {loan.dpd} day{loan.dpd !== 1 ? "s" : ""}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={loan.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/loans/${loan.id}`}
                        title="View account"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        to={`/loans/${loan.id}/edit`}
                        title="Edit account"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-500/10 hover:text-indigo-400"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        type="button"
                        title="Delete account"
                        onClick={() =>
                          handleDelete(
                            loan.id,
                            loan.accountNumber,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {loans.length === 0 && (
        <div className="border-t border-slate-800 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-[#151C2B] text-slate-600">
            <WalletCards size={22} />
          </div>

          <p className="mt-4 font-semibold text-slate-300">
            No loan accounts found
          </p>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
            Try changing your search or status filter to find
            loan accounts.
          </p>
        </div>
      )}
    </div>
  );
}
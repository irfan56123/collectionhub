import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../services/api";
import { ErrorState } from "../components/common/ErrorState";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";

type Loan = {
  id: string;
  accountNumber: string;
  borrowerName: string;
  loanAmount: number;
  principalOutstanding: number;
  dueDate: string;
  status: string;
  dpd: number;
};

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchLoans() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/loans");
      setLoans(response.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(
        "Unable to load dashboard data. Please check the server connection.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLoans();
  }, []);

  const stats = useMemo(() => {
    const total = loans.length;

    const active = loans.filter(
      (loan) => loan.status === "ACTIVE",
    ).length;

    const overdue = loans.filter(
      (loan) => loan.status === "OVERDUE",
    ).length;

    const outstanding = loans.reduce(
      (sum, loan) => sum + Number(loan.principalOutstanding),
      0,
    );

    const overdueOutstanding = loans
      .filter((loan) => loan.status === "OVERDUE")
      .reduce(
        (sum, loan) => sum + Number(loan.principalOutstanding),
        0,
      );

    return {
      total,
      active,
      overdue,
      outstanding,
      overdueOutstanding,
    };
  }, [loans]);

  const statusData = useMemo(() => {
    const statuses = ["ACTIVE", "OVERDUE", "PTP", "PAID", "CLOSED"];

    return statuses.map((status) => ({
      status,
      count: loans.filter((loan) => loan.status === status).length,
    }));
  }, [loans]);

  const overdueLoans = useMemo(() => {
    return [...loans]
      .filter((loan) => loan.dpd > 0)
      .sort((a, b) => b.dpd - a.dpd)
      .slice(0, 5);
  }, [loans]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-800 border-t-indigo-500" />
          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchLoans} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-400">
            Overview
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Collection Dashboard
          </h1>

          <p className="mt-1.5 text-sm text-slate-400">
            Monitor your loan portfolio and collection activity.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#111827] px-3 py-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          Portfolio live
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Accounts"
          value={stats.total}
          icon={<CreditCard size={20} />}
        />

        <StatCard
          title="Active Accounts"
          value={stats.active}
          icon={<Users size={20} />}
        />

        <StatCard
          title="Overdue Accounts"
          value={stats.overdue}
          icon={<AlertTriangle size={20} />}
        />

        <StatCard
          title="Outstanding POS"
          value={`₹${stats.outstanding.toLocaleString("en-IN")}`}
          icon={<IndianRupee size={20} />}
        />
      </div>

      {/* Secondary metric */}
      <div className="flex flex-col gap-4 rounded-2xl border border-red-500/10 bg-[#111827] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <AlertTriangle size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">
              Overdue Outstanding
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Principal outstanding across overdue accounts
            </p>
          </div>
        </div>

        <p className="text-xl font-bold text-red-400 sm:text-2xl">
          ₹{stats.overdueOutstanding.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Analytics */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Status chart */}
        <section className="rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
          <div className="border-b border-slate-800 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Portfolio Status
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Account distribution by collection status
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <ArrowUpRight size={17} />
              </div>
            </div>
          </div>

          <div className="h-[300px] px-3 pb-5 pt-6 sm:px-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#263044"
                  vertical={false}
                />

                <XAxis
                  dataKey="status"
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: "rgba(99,102,241,0.06)" }}
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #263044",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px",
                  }}
                  labelStyle={{
                    color: "#94A3B8",
                    marginBottom: "4px",
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#6366F1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
          <div className="border-b border-slate-800 px-5 py-5 sm:px-6">
            <h2 className="font-semibold text-white">
              Collection Summary
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Current portfolio health
            </p>
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            <SummaryRow
              label="Total accounts"
              value={stats.total}
              icon={<CreditCard size={16} />}
            />

            <SummaryRow
              label="Active accounts"
              value={stats.active}
              icon={<CheckCircle2 size={16} />}
              iconClass="bg-emerald-500/10 text-emerald-400"
            />

            <SummaryRow
              label="Overdue accounts"
              value={stats.overdue}
              icon={<Clock3 size={16} />}
              iconClass="bg-red-500/10 text-red-400"
            />

            <SummaryRow
              label="Overdue POS"
              value={`₹${stats.overdueOutstanding.toLocaleString("en-IN")}`}
              icon={<IndianRupee size={16} />}
              iconClass="bg-amber-500/10 text-amber-400"
            />
          </div>
        </section>
      </div>

      {/* Priority Follow-ups */}
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold text-white">
              Priority Collections
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Accounts requiring collection attention
            </p>
          </div>

          <span className="w-fit rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
            {overdueLoans.length} priority
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-800 bg-[#151C2B]/60">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Borrower
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  POS
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DPD
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {overdueLoans.map((loan) => (
                <tr
                  key={loan.id}
                  className="transition hover:bg-indigo-500/[0.03]"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-200">
                      {loan.accountNumber}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-300">
                      {loan.borrowerName}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-200">
                    ₹
                    {Number(
                      loan.principalOutstanding,
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-red-400">
                      {loan.dpd} days
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={loan.status} />
                  </td>
                </tr>
              ))}

              {overdueLoans.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <CheckCircle2
                      className="mx-auto text-emerald-400"
                      size={28}
                    />

                    <p className="mt-3 font-semibold text-slate-200">
                      No priority collections
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      There are currently no overdue accounts requiring
                      attention.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconClass?: string;
};

function SummaryRow({
  label,
  value,
  icon,
  iconClass = "bg-indigo-500/10 text-indigo-400",
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#151C2B]/50 p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>

        <span className="truncate text-sm text-slate-400">
          {label}
        </span>
      </div>

      <span className="ml-4 font-semibold text-slate-100">
        {value}
      </span>
    </div>
  );
}
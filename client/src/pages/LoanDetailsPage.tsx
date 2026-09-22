import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MessageSquare,
  Plus,
  Trash2,
  UserRound,
  Pencil,
  Phone,
  Mail,
  Smartphone,
  MessageCircle,
} from "lucide-react";

import { api } from "../services/api";
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

type FollowUp = {
  id: string;
  channel: string;
  status: string;
  notes?: string | null;
  followUpDate: string;
  createdAt: string;
};

const channelOptions = ["CALL", "WHATSAPP", "SMS", "EMAIL"];

const statusOptions = [
  "CONTACTED",
  "NO_RESPONSE",
  "PTP",
  "PAYMENT_RECEIVED",
];

const channelIcons: Record<
  string,
  typeof Phone
> = {
  CALL: Phone,
  WHATSAPP: MessageCircle,
  SMS: Smartphone,
  EMAIL: Mail,
};

const outcomeStyles: Record<string, string> = {
  CONTACTED:
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",

  NO_RESPONSE:
    "border-slate-700 bg-slate-800/70 text-slate-400",

  PTP:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",

  PAYMENT_RECEIVED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

export default function LoanDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [channel, setChannel] = useState("CALL");
  const [followUpStatus, setFollowUpStatus] =
    useState("CONTACTED");

  const [followUpDate, setFollowUpDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function fetchData() {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const [loanResponse, followUpResponse] =
        await Promise.all([
          api.get(`/loans/${id}`),
          api.get(`/loans/${id}/followups`),
        ]);

      setLoan(loanResponse.data.data);
      setFollowUps(followUpResponse.data.data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load loan account details.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  async function handleAddFollowUp(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id) return;

    try {
      setSubmitting(true);
      setFormError("");

      await api.post(`/loans/${id}/followups`, {
        channel,
        status: followUpStatus,
        followUpDate,
        notes: notes.trim() || undefined,
      });

      setNotes("");
      setChannel("CALL");
      setFollowUpStatus("CONTACTED");
      setFollowUpDate(
        new Date().toISOString().split("T")[0],
      );

      const response = await api.get(
        `/loans/${id}/followups`,
      );

      setFollowUps(response.data.data);
    } catch (err) {
      console.error(err);

      setFormError(
        "Unable to create follow-up. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteFollowUp(
    followUpId: string,
  ) {
    const confirmed = window.confirm(
      "Delete this follow-up record? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/followups/${followUpId}`);

      setFollowUps((current) =>
        current.filter(
          (item) => item.id !== followUpId,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Unable to delete follow-up.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-800 border-t-indigo-500" />

          <p className="mt-3 text-sm text-slate-500">
            Loading account details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <p className="font-semibold text-red-400">
          Unable to load loan account
        </p>

        <p className="mt-1 text-sm text-red-400/70">
          {error || "Loan account not found."}
        </p>

        <button
          type="button"
          onClick={fetchData}
          className="mt-4 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isOverdue = loan.dpd > 0;

  const outstandingPercentage =
    loan.loanAmount > 0
      ? Math.min(
          100,
          Math.round(
            (loan.principalOutstanding /
              loan.loanAmount) *
              100,
          ),
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            to="/loans"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            Back to Loan Accounts
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {loan.accountNumber}
            </h1>

            <StatusBadge status={loan.status} />
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <UserRound size={15} />
            {loan.borrowerName}
          </div>
        </div>

        <Link
          to={`/loans/${loan.id}/edit`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#111827] px-4 text-sm font-semibold text-slate-300 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400"
        >
          <Pencil size={16} />
          Edit Account
        </Link>
      </div>

      {/* ================================================= */}
      {/* ACCOUNT HERO */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
        <div className="relative p-5 sm:p-7">
          {/* Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-600/5 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Account Overview
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Current loan and repayment position
                </p>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 sm:flex">
                <IndianRupee size={19} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Loan Amount */}
              <MetricCard
                label="Loan Amount"
                value={`₹${loan.loanAmount.toLocaleString(
                  "en-IN",
                )}`}
                icon={<IndianRupee size={17} />}
              />

              {/* POS */}
              <MetricCard
                label="Principal Outstanding"
                value={`₹${loan.principalOutstanding.toLocaleString(
                  "en-IN",
                )}`}
                icon={<WalletIcon />}
                accent
              />

              {/* Due Date */}
              <MetricCard
                label="Due Date"
                value={new Date(
                  loan.dueDate,
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                icon={<CalendarDays size={17} />}
              />

              {/* DPD */}
              <MetricCard
                label="Days Past Due"
                value={`${loan.dpd} day${
                  loan.dpd !== 1 ? "s" : ""
                }`}
                icon={<Clock3 size={17} />}
                danger={isOverdue}
              />
            </div>

            {/* Outstanding progress */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-[#0D1421] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">
                    Outstanding Position
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    {outstandingPercentage}% of original loan
                    amount remains outstanding
                  </p>
                </div>

                <span className="text-xs font-bold text-indigo-400">
                  {outstandingPercentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${outstandingPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* DPD ALERT */}
      {/* ================================================= */}

      <div
        className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 ${
          isOverdue
            ? "border-red-500/20 bg-red-500/[0.06]"
            : "border-emerald-500/20 bg-emerald-500/[0.06]"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isOverdue
                ? "bg-red-500/10 text-red-400"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {isOverdue ? (
              <Clock3 size={20} />
            ) : (
              <CheckCircle2 size={20} />
            )}
          </div>

          <div>
            <p
              className={`font-semibold ${
                isOverdue
                  ? "text-red-300"
                  : "text-emerald-300"
              }`}
            >
              {isOverdue
                ? `Payment overdue by ${loan.dpd} day${
                    loan.dpd !== 1 ? "s" : ""
                  }`
                : "Account is currently within due date"}
            </p>

            <p
              className={`mt-1 text-sm ${
                isOverdue
                  ? "text-red-400/70"
                  : "text-emerald-400/70"
              }`}
            >
              {isOverdue
                ? "Maintain collection follow-up activity for this account."
                : "No overdue collection action is currently required."}
            </p>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* FOLLOW-UP AREA */}
      {/* ================================================= */}

      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        {/* Add Follow-up */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
          <div className="border-b border-slate-800 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Plus size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Add Follow-up
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Record collection activity
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleAddFollowUp}
            className="space-y-5 p-5 sm:p-6"
          >
            {formError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm font-medium text-red-400">
                  {formError}
                </p>
              </div>
            )}

            {/* Channel */}
            <Field label="Collection Channel">
              <select
                value={channel}
                onChange={(e) =>
                  setChannel(e.target.value)
                }
                className={inputClass}
              >
                {channelOptions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            {/* Outcome */}
            <Field label="Follow-up Outcome">
              <select
                value={followUpStatus}
                onChange={(e) =>
                  setFollowUpStatus(e.target.value)
                }
                className={inputClass}
              >
                {statusOptions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </Field>

            {/* Date */}
            <Field label="Follow-up Date">
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) =>
                    setFollowUpDate(e.target.value)
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            {/* Notes */}
            <Field label="Notes">
              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={4}
                maxLength={500}
                placeholder="Record the outcome or customer response..."
                className={`${inputClass} h-auto resize-none py-3`}
              />

              <div className="mt-1 flex justify-end">
                <span className="text-[10px] text-slate-700">
                  {notes.length}/500
                </span>
              </div>
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />

              {submitting
                ? "Saving..."
                : "Add Follow-up"}
            </button>
          </form>
        </section>

        {/* Follow-up History */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-white">
                Follow-up History
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Collection activity for this account
              </p>
            </div>

            <span className="rounded-lg border border-indigo-500/10 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold text-indigo-400">
              {followUps.length} record
              {followUps.length !== 1 ? "s" : ""}
            </span>
          </div>

          {followUps.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-[#151C2B] text-slate-600">
                <MessageSquare size={22} />
              </div>

              <p className="mt-4 font-semibold text-slate-300">
                No follow-ups yet
              </p>

              <p className="mt-1 max-w-xs text-sm text-slate-600">
                Collection activity recorded for this
                account will appear here.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute bottom-6 left-[34px] top-6 w-px bg-slate-800" />

              <div className="divide-y divide-slate-800">
                {followUps.map(
                  (followUp, index) => {
                    const ChannelIcon =
                      channelIcons[
                        followUp.channel
                      ] ?? MessageSquare;

                    const outcomeClass =
                      outcomeStyles[
                        followUp.status
                      ] ??
                      "border-slate-700 bg-slate-800/70 text-slate-400";

                    return (
                      <div
                        key={followUp.id}
                        className="group relative p-5 transition hover:bg-indigo-500/[0.025] sm:p-6"
                      >
                        <div className="flex gap-4">
                          {/* Timeline Icon */}
                          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-[#111827] text-indigo-400">
                            <ChannelIcon size={14} />
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold text-slate-200">
                                    {followUp.channel}
                                  </p>

                                  <span
                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${outcomeClass}`}
                                  >
                                    {followUp.status.replace(/_/g, " ")}
                                  </span>

                                  {index === 0 && (
                                    <span className="rounded-full border border-indigo-500/10 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold text-indigo-400">
                                      Latest
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-600">
                                  <CalendarDays
                                    size={12}
                                  />

                                  {new Date(
                                    followUp.followUpDate,
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteFollowUp(
                                    followUp.id,
                                  )
                                }
                                title="Delete follow-up"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 opacity-100 transition hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {followUp.notes && (
                              <div className="mt-4 rounded-xl border border-slate-800 bg-[#0D1421] px-4 py-3">
                                <p className="text-sm leading-6 text-slate-400">
                                  {followUp.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ===================================================== */
/* METRIC CARD */
/* ===================================================== */

type MetricCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
  danger?: boolean;
};

function MetricCard({
  label,
  value,
  icon,
  accent,
  danger,
}: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        danger
          ? "border-red-500/10 bg-red-500/[0.04]"
          : "border-slate-800 bg-[#151C2B]/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-slate-600">
          {label}
        </p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            danger
              ? "bg-red-500/10 text-red-400"
              : accent
                ? "bg-indigo-500/10 text-indigo-400"
                : "bg-slate-800 text-slate-500"
          }`}
        >
          {icon}
        </div>
      </div>

      <p
        className={`mt-3 text-xl font-bold tracking-tight ${
          danger
            ? "text-red-400"
            : accent
              ? "text-indigo-400"
              : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ===================================================== */
/* FIELD */
/* ===================================================== */

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({
  label,
  children,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      {children}
    </div>
  );
}

/* ===================================================== */
/* INPUT STYLE */
/* ===================================================== */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-800 bg-[#151C2B] px-3.5 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:bg-[#172033] focus:ring-4 focus:ring-indigo-500/10";

/* ===================================================== */
/* SIMPLE WALLET ICON */
/* ===================================================== */

function WalletIcon() {
  return (
    <div className="text-[13px] font-bold">
      ₹
    </div>
  );
}
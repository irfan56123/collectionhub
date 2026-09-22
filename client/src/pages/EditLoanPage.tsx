import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  Save,
  WalletCards,
} from "lucide-react";
import { z } from "zod";

import { api } from "../services/api";

const updateLoanSchema = z.object({
  accountNumber: z
    .string()
    .trim()
    .min(1, "Account number is required"),

  borrowerName: z
    .string()
    .trim()
    .min(2, "Borrower name is required"),

  loanAmount: z
    .number()
    .positive("Loan amount must be greater than 0"),

  principalOutstanding: z
    .number()
    .min(0, "Principal outstanding cannot be negative"),

  dueDate: z
    .string()
    .min(1, "Due date is required"),
});

type FormData = {
  accountNumber: string;
  borrowerName: string;
  loanAmount: string;
  principalOutstanding: string;
  dueDate: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type LoanResponse = {
  id: string;
  accountNumber: string;
  borrowerName: string;
  loanAmount: number | string;
  principalOutstanding: number | string;
  dueDate: string;
  status: string;
};

export default function EditLoanPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    accountNumber: "",
    borrowerName: "",
    loanAmount: "",
    principalOutstanding: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!id) {
      setFormError("Loan account ID is missing.");
      setLoading(false);
      return;
    }

    fetchLoan(id);
  }, [id]);

  async function fetchLoan(loanId: string) {
    try {
      setLoading(true);
      setFormError("");

      const response = await api.get(`/loans/${loanId}`);

      const loan: LoanResponse = response.data.data;

      setForm({
        accountNumber: loan.accountNumber,
        borrowerName: loan.borrowerName,
        loanAmount: String(loan.loanAmount),
        principalOutstanding: String(
          loan.principalOutstanding,
        ),
        dueDate: formatDateForInput(loan.dueDate),
      });
    } catch (error) {
      console.error("Failed to fetch loan:", error);

      setFormError(
        "Unable to load this loan account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setFormError("");
  }

  function validateForm() {
    const result = updateLoanSchema.safeParse({
      accountNumber: form.accountNumber,
      borrowerName: form.borrowerName,
      loanAmount: Number(form.loanAmount),
      principalOutstanding: Number(
        form.principalOutstanding,
      ),
      dueDate: form.dueDate,
    });

    if (!result.success) {
      const nextErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);
      return false;
    }

    if (
      Number(form.principalOutstanding) >
      Number(form.loanAmount)
    ) {
      setErrors({
        principalOutstanding:
          "Principal outstanding cannot exceed loan amount.",
      });

      return false;
    }

    return true;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id) {
      setFormError("Loan account ID is missing.");
      return;
    }

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setFormError("");

      await api.patch(`/loans/${id}`, {
        accountNumber: form.accountNumber.trim(),
        borrowerName: form.borrowerName.trim(),
        loanAmount: Number(form.loanAmount),
        principalOutstanding: Number(
          form.principalOutstanding,
        ),
        dueDate: form.dueDate,
      });

      navigate(`/loans/${id}`);
    } catch (error: any) {
      console.error("Failed to update loan:", error);

      setFormError(
        error?.response?.data?.message ||
          "Unable to update loan account. Please try again.",
      );
    } finally {
      setSubmitting(false);
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

  if (formError && !form.accountNumber) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="font-semibold text-red-400">
            Unable to load loan account
          </p>

          <p className="mt-1 text-sm text-red-400/70">
            {formError}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => id && fetchLoan(id)}
              className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              Try Again
            </button>

            <Link
              to="/loans"
              className="rounded-xl border border-slate-800 bg-[#111827] px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Back to Loans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back */}
      <Link
        to={`/loans/${id}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-400"
      >
        <ArrowLeft size={16} />
        Back to Account
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
            CollectionHub
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Edit Loan Account
        </h1>

        <p className="mt-1.5 text-sm text-slate-500">
          Update borrower, financial and repayment information.
        </p>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
        {/* Card Header */}
        <div className="border-b border-slate-800 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <WalletCards size={18} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Account Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Modify the existing loan account details.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-5 sm:p-7">
            {/* API Error */}
            {formError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm font-medium text-red-400">
                  {formError}
                </p>
              </div>
            )}

            {/* Account Information */}
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Account Number"
                required
                error={errors.accountNumber}
              >
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) =>
                    handleChange(
                      "accountNumber",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. LN1001"
                  className={inputClass(
                    Boolean(errors.accountNumber),
                  )}
                />
              </Field>

              <Field
                label="Borrower Name"
                required
                error={errors.borrowerName}
              >
                <input
                  type="text"
                  value={form.borrowerName}
                  onChange={(e) =>
                    handleChange(
                      "borrowerName",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. Rahul Kumar"
                  className={inputClass(
                    Boolean(errors.borrowerName),
                  )}
                />
              </Field>
            </div>

            {/* Financial Details */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-800" />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                  Financial Details
                </span>

                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Loan Amount"
                  required
                  error={errors.loanAmount}
                >
                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.loanAmount}
                      onChange={(e) =>
                        handleChange(
                          "loanAmount",
                          e.target.value,
                        )
                      }
                      placeholder="150000"
                      className={`${inputClass(
                        Boolean(errors.loanAmount),
                      )} pl-10`}
                    />
                  </div>
                </Field>

                <Field
                  label="Principal Outstanding"
                  required
                  error={errors.principalOutstanding}
                >
                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.principalOutstanding}
                      onChange={(e) =>
                        handleChange(
                          "principalOutstanding",
                          e.target.value,
                        )
                      }
                      placeholder="85000"
                      className={`${inputClass(
                        Boolean(
                          errors.principalOutstanding,
                        ),
                      )} pl-10`}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Repayment Schedule */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-800" />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                  Repayment Schedule
                </span>

                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <Field
                label="Due Date"
                required
                error={errors.dueDate}
              >
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      handleChange(
                        "dueDate",
                        e.target.value,
                      )
                    }
                    className={`${inputClass(
                      Boolean(errors.dueDate),
                    )} pl-10`}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-800 bg-[#0D1421] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <Link
              to={`/loans/${id}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-800 px-5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {submitting
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Helper */}
      <p className="mt-4 text-center text-[11px] text-slate-600">
        Changes are saved directly to the loan account.
      </p>
    </div>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function Field({
  label,
  required,
  error,
  children,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}

        {required && (
          <span className="ml-1 text-indigo-400">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `
    h-11
    w-full
    rounded-xl
    border
    bg-[#151C2B]
    px-3.5
    text-sm
    text-slate-200
    outline-none
    transition
    placeholder:text-slate-600
    focus:bg-[#172033]
    focus:ring-4
    ${
      hasError
        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/10"
    }
  `;
}

function formatDateForInput(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
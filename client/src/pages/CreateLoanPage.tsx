import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, IndianRupee, Save } from "lucide-react";
import { z } from "zod";

import { api } from "../services/api";

const createLoanSchema = z.object({
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

export default function CreateLoanPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    accountNumber: "",
    borrowerName: "",
    loanAmount: "",
    principalOutstanding: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    const result = createLoanSchema.safeParse({
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

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setFormError("");

      await api.post("/loans", {
        accountNumber: form.accountNumber.trim(),
        borrowerName: form.borrowerName.trim(),
        loanAmount: Number(form.loanAmount),
        principalOutstanding: Number(
          form.principalOutstanding,
        ),
        dueDate: form.dueDate,
      });

      navigate("/loans");
    } catch (error: any) {
      console.error("Failed to create loan:", error);

      setFormError(
        error?.response?.data?.message ||
          "Unable to create loan account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back */}
      <Link
        to="/loans"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-400"
      >
        <ArrowLeft size={16} />
        Back to Loan Accounts
      </Link>

      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
          CollectionHub
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Add Loan Account
        </h1>

        <p className="mt-1.5 text-sm text-slate-500">
          Create a new borrower loan account for collection
          management.
        </p>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-sm">
        {/* Card Header */}
        <div className="border-b border-slate-800 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Save size={18} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Account Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Enter the basic loan and borrower details.
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

            {/* Account & Borrower */}
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
                  placeholder="e.g. LN1005"
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

            {/* Financial Information */}
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

            {/* Due Date */}
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
              to="/loans"
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
                ? "Creating Account..."
                : "Create Loan Account"}
            </button>
          </div>
        </form>
      </div>

      {/* Helper */}
      <p className="mt-4 text-center text-[11px] text-slate-600">
        Loan accounts are automatically evaluated for overdue
        status based on their due date.
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
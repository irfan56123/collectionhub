import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variantStyles = {
  primary:
    "border border-indigo-500/20 bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-600/20 focus-visible:ring-indigo-500/30",

  secondary:
    "border border-slate-700 bg-[#151C2B] text-slate-200 hover:border-slate-600 hover:bg-slate-800",

  danger:
    "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300",

  ghost:
    "border border-transparent bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white",
};

const sizeStyles = {
  sm: "h-9 rounded-lg px-3 text-xs",
  md: "h-10 rounded-xl px-4 text-sm",
  lg: "h-11 rounded-xl px-5 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        font-semibold
        outline-none
        transition-all
        duration-200
        focus-visible:ring-4
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
/*
 * Coinbase-style button primitive with size and variant support.
 * Supports rendering as a link or any other element through the `as` prop.
 */
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "light" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "className">;

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[#0052ff] text-white hover:bg-[#0042d4] focus-visible:outline-[#0052ff]",
  secondary: "bg-[#e8f0ff] text-[#0052ff] hover:bg-[#dbe7ff] focus-visible:outline-[#0052ff]",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-slate-300",
  light: "bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-300",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

function Button<T extends ElementType = "button">({
  as,
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";

  return (
    <Component className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default Button;

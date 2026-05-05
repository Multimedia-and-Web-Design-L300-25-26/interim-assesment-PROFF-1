/*
 * Reusable white card container with rounded corners and shadow.
 * Used throughout the Coinbase clone for content blocks and data panels.
 */
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

function Card({ children, className = "" }: CardProps) {
  return <div className={`rounded-3xl bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] ${className}`.trim()}>{children}</div>;
}

export default Card;
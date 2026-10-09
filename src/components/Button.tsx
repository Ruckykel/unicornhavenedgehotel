import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]";

const variants: Record<Variant, string> = {
  // Text on brass is always ink (blueprint §2).
  primary: "bg-brass text-ink hover:bg-brass-light",
  secondary: "border border-current bg-transparent hover:bg-ink hover:text-porcelain hover:border-ink",
  ghost: "px-0 underline decoration-1 underline-offset-[6px] hover:decoration-brass min-h-0",
  light: "border border-porcelain/70 text-porcelain hover:bg-porcelain hover:text-ink",
};

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type LinkProps = { href: string; variant?: Variant; children: ReactNode; className?: string; external?: boolean } & Omit<
  ComponentProps<"a">,
  "href"
>;

export function ButtonLink({ href, variant = "primary", className, children, external, ...rest }: LinkProps) {
  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={buttonClass(variant, className)}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...rest} />;
}

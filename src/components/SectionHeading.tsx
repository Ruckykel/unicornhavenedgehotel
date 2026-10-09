import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
};

export function SectionHeading({ title, intro, as: Tag = "h2", className = "", action, tone = "light" }: Props) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-2xl">
        <Tag className="text-2xl md:text-3xl">{title}</Tag>
        {intro && (
          <p className={`mt-4 max-w-prose text-base md:text-lg ${tone === "dark" ? "text-sage" : "text-stone-deep"}`}>
            {intro}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

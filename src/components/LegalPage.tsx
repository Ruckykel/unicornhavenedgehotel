import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="pb-section-sm pt-[120px] md:pb-section">
      <article className="container-site max-w-3xl">
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-stone-deep">Last updated {updated}</p>
        <div className="mt-10 space-y-8 text-stone-deep [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:text-ink [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </div>
  );
}

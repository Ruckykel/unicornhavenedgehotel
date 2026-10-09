import { Plus } from "lucide-react";
import type { Faq } from "@/lib/types";

/** Native <details> accordion: keyboard and screen-reader friendly without JS. */
export function FAQAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-ink/15">
      {faqs.map((f) => (
        <details key={f.question} className="group border-b border-ink/15">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
            {f.question}
            <Plus
              aria-hidden
              className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
              strokeWidth={1.5}
            />
          </summary>
          <p className="max-w-prose pb-6 text-stone-deep">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

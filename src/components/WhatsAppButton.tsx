"use client";

import { usePathname } from "next/navigation";
import { whatsappLink, whatsappMessageForPath } from "@/lib/whatsapp";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
    </svg>
  );
}

/** Floating WhatsApp button with a prefilled, page-specific message. */
export function WhatsAppButton() {
  const pathname = usePathname() || "/";
  // Sits above the mobile booking bar, which is hidden on /book.
  const bottom = pathname.startsWith("/book") ? "bottom-4" : "bottom-[84px]";
  return (
    <a
      href={whatsappLink(whatsappMessageForPath(pathname))}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${bottom} right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-mangrove text-porcelain ring-1 ring-porcelain/20 transition-transform hover:scale-105 md:bottom-6 md:right-6`}
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="sr-only">Chat on WhatsApp (opens in a new tab)</span>
    </a>
  );
}

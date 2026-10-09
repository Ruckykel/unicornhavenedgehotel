"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Phone, X, MessageCircle } from "lucide-react";
import { BadgeSeal } from "./BadgeSeal";
import { buttonClass } from "./Button";
import { NAV_LINKS } from "@/lib/site";
import { siteSettings } from "@/lib/content";
import { whatsappLink, whatsappMessageForPath } from "@/lib/whatsapp";
import { useFocusTrap } from "./useFocusTrap";

// Pages without a dark hero start with a solid header.
const SOLID_PATHS = [/^\/book/, /^\/privacy/, /^\/terms/];

export function Header() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [known, setKnown] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Any page that isn't in our route list is the 404 page: solid header.
    setKnown(!!document.querySelector("[data-hero]"));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useFocusTrap(menuRef, open, () => {
    setOpen(false);
    toggleRef.current?.focus();
  });

  const solid = scrolled || !known || SOLID_PATHS.some((re) => re.test(pathname));
  const tone = solid ? "text-ink" : "text-porcelain";

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] bg-brass px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? "border-b border-mist bg-porcelain/95 backdrop-blur" : "bg-gradient-to-b from-ink/50 to-transparent"
        }`}
      >
        <div className={`container-site flex h-[72px] items-center justify-between gap-6 ${tone}`}>
          <Link href="/" className="flex items-center gap-3" aria-label="Unicorn Haven Edge Hotel, home">
            <BadgeSeal variant="mark" className="h-10 w-10 shrink-0" title="" />
            <span className="font-display text-lg leading-none tracking-wide">Unicorn Haven Edge</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-sm font-medium">
              {NAV_LINKS.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`py-2 underline-offset-[8px] hover:underline ${active ? "underline decoration-brass decoration-2" : ""}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <a href={siteSettings.phoneHref} className="hidden items-center gap-2 text-sm font-medium xl:flex">
              <Phone aria-hidden className="h-4 w-4" strokeWidth={1.5} />
              {siteSettings.phone}
            </a>
            <Link href="/book" className={buttonClass("primary", "hidden px-4 py-2.5 sm:inline-flex")}>
              Book now
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden className="h-6 w-6" strokeWidth={1.5} />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-[60] overflow-y-auto bg-mangrove text-porcelain"
      >
        <div className="container-site flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <BadgeSeal variant="mark" className="h-10 w-10" title="" />
            <span className="font-display text-lg">Unicorn Haven Edge</span>
          </Link>
          <button
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center"
            onClick={() => {
              setOpen(false);
              toggleRef.current?.focus();
            }}
          >
            <X aria-hidden className="h-6 w-6" strokeWidth={1.5} />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Mobile" className="container-site pb-10 pt-8">
          <ul className="space-y-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block py-2 font-display text-3xl"
                  aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-4 border-t border-porcelain/15 pt-8">
            <a href={siteSettings.phoneHref} className="flex items-center gap-3 text-lg">
              <Phone aria-hidden className="h-5 w-5" strokeWidth={1.5} /> {siteSettings.phone}
            </a>
            <a
              href={whatsappLink(whatsappMessageForPath(pathname))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-lg"
            >
              <MessageCircle aria-hidden className="h-5 w-5" strokeWidth={1.5} /> Chat on WhatsApp
            </a>
            <Link href="/book" className={buttonClass("primary", "mt-4 w-full")}>
              Book now
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

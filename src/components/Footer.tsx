import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { InstagramIcon } from "./icons";
import { BadgeSeal } from "./BadgeSeal";
import { NewsletterForm } from "./NewsletterForm";
import { siteSettings } from "@/lib/content";
import { NAV_LINKS } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const PAYMENT_METHODS = ["Visa", "Mastercard", "Verve", "Bank transfer", "USSD"];

export function Footer() {
  const s = siteSettings;
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-mangrove text-porcelain">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-4">
          <BadgeSeal className="h-24 w-24" title="Unicorn Haven Edge badge" />
          <p className="mt-6 max-w-xs text-sage">
            A quiet, secure hotel in Elelenwo, Port Harcourt, with 24/7 power and an on-site restaurant.
          </p>
          <address className="mt-4 flex gap-2 not-italic text-sage">
            <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>
              {s.address.street}, {s.address.city},
              <br />
              {s.address.state}, {s.address.country}
            </span>
          </address>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="font-sans text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sage">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-porcelain hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book" className="hover:text-porcelain hover:underline">
                Book a room
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-sm font-semibold">Contact</h2>
          <ul className="mt-4 space-y-3 text-sage">
            <li>
              <a href={s.phoneHref} className="flex items-center gap-2.5 hover:text-porcelain">
                <Phone aria-hidden className="h-4 w-4" strokeWidth={1.5} /> {s.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink("Hi, I'd like to enquire about a stay at Unicorn Haven Edge Hotel.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-porcelain"
              >
                <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={1.5} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="flex items-center gap-2.5 hover:text-porcelain">
                <Mail aria-hidden className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="min-w-0 break-words">
                  {s.email.split("@")[0]}@<wbr />
                  {s.email.split("@")[1]}
                </span>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock aria-hidden className="h-4 w-4" strokeWidth={1.5} /> {s.receptionHours}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-sm font-semibold">Stay in touch</h2>
          <div className="mt-4">
            <NewsletterForm />
          </div>
          <a
            href={s.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 text-sage hover:text-porcelain"
          >
            <InstagramIcon className="h-4 w-4" /> @unicornhavenedgehotel
          </a>
        </div>
      </div>

      <div className="border-t border-porcelain/10">
        <div className="container-site flex flex-col gap-4 py-6 pb-24 text-sm text-sage md:flex-row md:items-center md:justify-between md:pb-6">
          <p>© {year} Unicorn Haven Edge Hotel</p>
          <ul className="flex flex-wrap gap-x-2 gap-y-1" aria-label="Accepted payments">
            {PAYMENT_METHODS.map((m) => (
              <li key={m} className="rounded-sm border border-porcelain/20 px-2 py-0.5 text-xs">
                {m}
              </li>
            ))}
          </ul>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-porcelain hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-porcelain hover:underline">
              Booking terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

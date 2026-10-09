import Link from "next/link";
import { BadgeSeal } from "@/components/BadgeSeal";
import { ButtonLink } from "@/components/Button";
import { NAV_LINKS } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="pb-section-sm pt-[140px] md:pb-section">
      <div className="container-site max-w-2xl text-center">
        <BadgeSeal variant="mark" title="" className="mx-auto h-16 w-16 text-stone" />
        <h1 className="mt-8 text-3xl md:text-4xl">This page has checked out</h1>
        <p className="mt-4 text-lg text-stone-deep">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/book" variant="secondary">
            Check availability
          </ButtonLink>
        </div>
        <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="underline underline-offset-4 hover:text-mangrove">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

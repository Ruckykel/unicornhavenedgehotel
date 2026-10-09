"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { ArrowLeft, Check, Loader2, Lock, BedDouble, Users, AlertCircle } from "lucide-react";
import { ARRIVAL_TIMES, findPromo, quoteStay, type PaymentMethod } from "@/lib/booking";
import { addDays, formatDate, formatNaira, isoDate, nightsBetween } from "@/lib/format";
import { offersForBooking, type roomsForBooking } from "@/lib/content";
import { createBooking } from "@/app/book/actions";
import { buttonClass } from "../Button";
import { SmartImage } from "../SmartImage";

type BookingRoom = ReturnType<typeof roomsForBooking>[number];

type Props = {
  rooms: BookingRoom[];
  initial: { checkIn: string; checkOut: string; adults: number; children: number; promo: string; room: string };
  payments: { paystack: boolean; depositPercent: number | null; payAtHotel: boolean };
};

const STEPS = ["Dates", "Room", "Your details", "Review & pay"] as const;
// Which step owns each field, so server errors send the guest to the right place.
const FIELD_STEP: Record<string, number> = {
  checkIn: 0, checkOut: 0, adults: 0, children: 0, promo: 0,
  room: 1,
  name: 2, email: 2, phone: 2, arrivalTime: 2, requests: 2,
  payment: 3,
};

const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BookingFlow({ rooms, initial, payments }: Props) {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [today, setToday] = useState("");
  const [step, setStep] = useState(initial.checkIn && initial.checkOut ? 1 : 0);
  const [checkIn, setCheckIn] = useState(initial.checkIn);
  const [checkOut, setCheckOut] = useState(initial.checkOut);
  const [adults, setAdults] = useState(initial.adults);
  const [children, setChildren] = useState(initial.children);
  const [promo, setPromo] = useState(initial.promo);
  const [room, setRoom] = useState(initial.room);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [arrivalTime, setArrivalTime] = useState<(typeof ARRIVAL_TIMES)[number]>("Not sure yet");
  const [requests, setRequests] = useState("");
  const defaultPayment: PaymentMethod = payments.paystack ? "paystack-full" : "hotel";
  const [payment, setPayment] = useState<PaymentMethod>(defaultPayment);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const firstRender = useRef(true);

  useEffect(() => {
    const t = isoDate(new Date());
    setToday(t);
    if (!checkIn) {
      setCheckIn(t);
      setCheckOut(addDays(t, 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus();
  }, [step]);

  const guests = adults + children;
  const nights = nightsBetween(checkIn, checkOut);
  const offer = useMemo(() => findPromo(offersForBooking(), promo, checkIn), [promo, checkIn]);
  const selected = rooms.find((r) => r.slug === room);
  const quote = selected ? quoteStay(selected, checkIn, checkOut, offer?.discountPercent ?? 0) : null;
  const priced = quote?.total != null;
  const depositAmount = priced && payments.depositPercent ? Math.round((quote!.total! * payments.depositPercent) / 100) : null;

  function validate(s: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!checkIn) e.checkIn = "Choose a check-in date.";
      else if (today && checkIn < today) e.checkIn = "Check-in can't be in the past.";
      if (!checkOut) e.checkOut = "Choose a check-out date.";
      else if (checkIn && checkOut <= checkIn) e.checkOut = "Check-out must be at least one night after check-in.";
    }
    if (s === 1) {
      if (!selected) e.room = "Choose a room to continue.";
      else if (guests > selected.maxGuests) e.room = `The ${selected.name} sleeps up to ${selected.maxGuests}. Choose another room or change guests.`;
    }
    if (s === 2) {
      if (name.trim().length < 2) e.name = "Enter your full name, as on your ID.";
      if (!EMAIL_RE.test(email.trim())) e.email = "Enter an email address, e.g. name@example.com.";
      if (!PHONE_RE.test(phone.trim()) || phone.replace(/\D/g, "").length < 7)
        e.phone = "Enter a phone number, e.g. 0803 123 4567 or +44 7700 900123.";
      if (requests.length > 500) e.requests = "Keep special requests under 500 characters.";
    }
    if (s === 3 && !agreed) e.agreed = "Please confirm you've read the booking terms.";
    return e;
  }

  function next() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goTo(s: number) {
    if (s < step) {
      setErrors({});
      setStep(s);
    }
  }

  function submit() {
    for (let s = 0; s < STEPS.length; s++) {
      const e = validate(s);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    setServerMessage("");
    startTransition(async () => {
      const res = await createBooking({
        checkIn, checkOut, adults, children, room, promo: promo || undefined,
        name, email, phone, arrivalTime, requests: requests || undefined,
        payment: priced ? payment : "hotel",
      });
      if (res.ok) {
        if (res.redirect.startsWith("http")) window.location.assign(res.redirect);
        else router.push(res.redirect);
        return;
      }
      setServerMessage(res.message);
      if (res.errors) {
        setErrors(res.errors);
        const first = Math.min(...Object.keys(res.errors).map((k) => FIELD_STEP[k] ?? 3));
        setStep(first);
      }
    });
  }

  const err = (k: string) => errors[k];
  const field = (k: string) => ({
    "aria-invalid": err(k) ? (true as const) : undefined,
    "aria-describedby": err(k) ? `${k}-error` : undefined,
  });

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <ol className="mb-10 grid grid-cols-4 gap-2" aria-label="Booking steps">
          {STEPS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} aria-current={current ? "step" : undefined}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  disabled={!done}
                  className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
                >
                  <span className={`h-[3px] w-full ${done || current ? "bg-mangrove" : "bg-mist"}`} />
                  <span className={`flex items-center gap-1.5 text-xs sm:text-sm ${current ? "font-semibold" : "text-stone-deep"} ${done ? "group-hover:underline" : ""}`}>
                    {done && <Check aria-hidden className="h-3.5 w-3.5 text-mangrove" />}
                    <span className={current ? "" : "hidden sm:inline"}>{label}</span>
                    <span className="sr-only">{done ? " (completed)" : current ? "" : " (not started)"}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <h1 ref={headingRef} tabIndex={-1} className="text-2xl outline-none md:text-3xl">
          {["When are you staying?", "Choose your room", "Your details", "Review and pay"][step]}
        </h1>

        {serverMessage && (
          <p role="alert" className="mt-6 flex gap-2 border-l-2 border-red-700 bg-red-50 p-4 text-sm text-red-900">
            <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> {serverMessage}
          </p>
        )}

        <div className="mt-8">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="checkIn" label="Check-in" error={err("checkIn")}>
                <input
                  id="checkIn"
                  type="date"
                  className="field"
                  value={checkIn}
                  min={today}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCheckIn(v);
                    if (v && (!checkOut || checkOut <= v)) setCheckOut(addDays(v, 1));
                  }}
                  {...field("checkIn")}
                />
              </Field>
              <Field id="checkOut" label="Check-out" error={err("checkOut")}>
                <input
                  id="checkOut"
                  type="date"
                  className="field"
                  value={checkOut}
                  min={checkIn ? addDays(checkIn, 1) : today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  {...field("checkOut")}
                />
              </Field>
              <Field id="adults" label="Adults">
                <select id="adults" className="field" value={adults} onChange={(e) => setAdults(+e.target.value)}>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field id="children" label="Children">
                <select id="children" className="field" value={children} onChange={(e) => setChildren(+e.target.value)}>
                  {[0, 1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field id="promo" label="Promo code" optional className="sm:col-span-2">
                <input id="promo" className="field uppercase sm:max-w-xs" value={promo} onChange={(e) => setPromo(e.target.value)} autoComplete="off" />
                {promo && (
                  <p className={`mt-1.5 text-sm ${offer ? "text-mangrove" : "text-stone-deep"}`} aria-live="polite">
                    {offer ? `${offer.title}: ${offer.discountPercent}% off applied.` : "We'll check this code when you book."}
                  </p>
                )}
              </Field>
              {nights > 0 && (
                <p className="text-stone-deep sm:col-span-2" aria-live="polite">
                  {nights} night{nights > 1 ? "s" : ""}, {formatDate(checkIn)} to {formatDate(checkOut)}
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <fieldset aria-describedby={err("room") ? "room-error" : "room-note"}>
              <legend className="sr-only">Rooms</legend>
              <p id="room-note" className="mb-6 text-sm text-stone-deep">
                {nights} night{nights > 1 ? "s" : ""} · {guests} guest{guests > 1 ? "s" : ""} · Availability is subject to confirmation.
              </p>
              <div className="space-y-4">
                {rooms.map((r) => {
                  const q = quoteStay(r, checkIn, checkOut, offer?.discountPercent ?? 0);
                  const tooSmall = guests > r.maxGuests;
                  const checked = room === r.slug;
                  return (
                    <label
                      key={r.slug}
                      className={`flex cursor-pointer gap-4 border p-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass sm:p-4 ${
                        checked ? "border-ink bg-white" : "border-mist bg-white hover:border-stone"
                      } ${tooSmall ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <input
                        type="radio"
                        name="room"
                        value={r.slug}
                        checked={checked}
                        disabled={tooSmall}
                        onChange={() => setRoom(r.slug)}
                        className="sr-only"
                      />
                      <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-mist sm:w-32">
                        <SmartImage src={r.image.src} alt="" fill sizes="128px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-display text-xl">{r.name}</span>
                          <span
                            aria-hidden
                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${checked ? "border-ink bg-ink text-porcelain" : "border-stone"}`}
                          >
                            {checked && <Check className="h-3 w-3" />}
                          </span>
                        </div>
                        <span className="mt-1 flex flex-wrap gap-x-3 text-sm text-stone-deep">
                          <span className="flex items-center gap-1"><BedDouble aria-hidden className="h-4 w-4" strokeWidth={1.5} /> {r.bedType}</span>
                          <span className="flex items-center gap-1"><Users aria-hidden className="h-4 w-4" strokeWidth={1.5} /> Up to {r.maxGuests}</span>
                        </span>
                        <span className="mt-auto pt-3 text-sm">
                          {tooSmall ? (
                            <span className="text-stone-deep">Sleeps up to {r.maxGuests}, too small for {guests} guests</span>
                          ) : q.total !== null ? (
                            <>
                              <span className="font-semibold tabular-nums">{formatNaira(q.total)}</span>
                              <span className="text-stone-deep"> for {q.nights} night{q.nights > 1 ? "s" : ""}</span>
                              {q.discount > 0 && <span className="text-mangrove"> (−{formatNaira(q.discount)})</span>}
                            </>
                          ) : (
                            <span className="text-stone-deep">Rate on request: we&rsquo;ll confirm the price with you</span>
                          )}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
              {err("room") && <p id="room-error" role="alert" className="field-error">{err("room")}</p>}
            </fieldset>
          )}

          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Full name" hint="As it appears on your ID" error={err("name")} className="sm:col-span-2">
                <input id="name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} {...field("name")} />
              </Field>
              <Field id="email" label="Email" error={err("email")}>
                <input id="email" type="email" className="field" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} {...field("email")} />
              </Field>
              <Field id="phone" label="Phone" hint="Nigerian or international" error={err("phone")}>
                <input id="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="0803 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} {...field("phone")} />
              </Field>
              <Field id="arrivalTime" label="Estimated arrival time">
                <select id="arrivalTime" className="field" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value as typeof arrivalTime)}>
                  {ARRIVAL_TIMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field id="requests" label="Special requests" optional hint="Airport pickup, extra bed, dietary needs…" error={err("requests")} className="sm:col-span-2">
                <textarea id="requests" rows={4} maxLength={500} className="field resize-y" value={requests} onChange={(e) => setRequests(e.target.value)} {...field("requests")} />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div>
              <dl className="divide-y divide-mist border-y border-mist">
                <ReviewRow label="Dates" onEdit={() => goTo(0)}>
                  {formatDate(checkIn)} – {formatDate(checkOut)} · {nights} night{nights > 1 ? "s" : ""}
                </ReviewRow>
                <ReviewRow label="Guests" onEdit={() => goTo(0)}>
                  {adults} adult{adults > 1 ? "s" : ""}{children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}
                </ReviewRow>
                <ReviewRow label="Room" onEdit={() => goTo(1)}>{selected?.name}</ReviewRow>
                <ReviewRow label="Guest" onEdit={() => goTo(2)}>
                  {name}
                  <span className="block text-sm text-stone-deep">{email} · {phone}</span>
                  <span className="block text-sm text-stone-deep">Arriving: {arrivalTime}</span>
                </ReviewRow>
              </dl>

              <fieldset className="mt-10">
                <legend className="font-display text-xl">How would you like to pay?</legend>
                {priced ? (
                  <div className="mt-4 space-y-3">
                    {payments.paystack ? (
                      <PayOption
                        checked={payment === "paystack-full"}
                        onSelect={() => setPayment("paystack-full")}
                        title={`Pay ${formatNaira(quote!.total!)} now`}
                        detail="Card, bank transfer or USSD, secured by Paystack."
                      />
                    ) : (
                      <p className="border border-dashed border-stone p-4 text-sm text-stone-deep">
                        Online payment is being set up. You can pay at the hotel for now.
                      </p>
                    )}
                    {payments.paystack && depositAmount && (
                      <PayOption
                        checked={payment === "paystack-deposit"}
                        onSelect={() => setPayment("paystack-deposit")}
                        title={`Pay a ${payments.depositPercent}% deposit (${formatNaira(depositAmount)}) now`}
                        detail="Pay the balance when you arrive."
                      />
                    )}
                    {payments.payAtHotel && (
                      <PayOption
                        checked={payment === "hotel"}
                        onSelect={() => setPayment("hotel")}
                        title="Pay at the hotel"
                        detail="Reserve now and pay when you arrive."
                      />
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-stone-deep">
                    The rate for this room is confirmed by our reservations team. Send your request and we&rsquo;ll be in
                    touch with the price and payment options.
                  </p>
                )}
              </fieldset>

              <div className="mt-8">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-mangrove"
                    aria-invalid={err("agreed") ? true : undefined}
                    aria-describedby={err("agreed") ? "agreed-error" : undefined}
                  />
                  <span className="text-sm">
                    I&rsquo;ve read the{" "}
                    <Link href="/terms" target="_blank" className="underline underline-offset-4">
                      booking terms and cancellation policy
                    </Link>{" "}
                    and understand availability is subject to confirmation.
                  </span>
                </label>
                {err("agreed") && <p id="agreed-error" className="field-error">{err("agreed")}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-mist pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold hover:underline">
              <ArrowLeft aria-hidden className="h-4 w-4" /> Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="button" onClick={next} className={buttonClass("primary", "min-w-[180px]")}>
              Continue
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={pending} className={buttonClass("primary", "min-w-[220px]")}>
              {pending ? (
                <><Loader2 aria-hidden className="h-4 w-4 animate-spin" /> Please wait…</>
              ) : !priced ? (
                "Send booking request"
              ) : payment === "hotel" ? (
                "Confirm booking"
              ) : (
                <><Lock aria-hidden className="h-4 w-4" /> Continue to secure payment</>
              )}
            </button>
          )}
        </div>
      </div>

      <aside className="lg:col-span-4 lg:col-start-9" aria-label="Your stay">
        <div className="border border-mist bg-white p-6 lg:sticky lg:top-[96px]">
          <h2 className="font-display text-xl">Your stay</h2>
          {selected && (
            <div className="relative mt-5 aspect-[16/10] overflow-hidden bg-mist">
              <SmartImage src={selected.image.src} alt={selected.image.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            </div>
          )}
          <dl className="mt-5 space-y-3 text-sm">
            <SummaryRow label="Room">{selected?.name ?? "Not chosen yet"}</SummaryRow>
            <SummaryRow label="Check-in">{checkIn ? formatDate(checkIn) : "—"}</SummaryRow>
            <SummaryRow label="Check-out">{checkOut ? formatDate(checkOut) : "—"}</SummaryRow>
            <SummaryRow label="Guests">{guests}</SummaryRow>
            {quote && quote.discount > 0 && <SummaryRow label="Promo">−{formatNaira(quote.discount)}</SummaryRow>}
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-ink pt-4">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-semibold tabular-nums">
              {!selected ? "—" : priced ? formatNaira(quote!.total!) : "On request"}
            </span>
          </div>
          {priced && nights > 0 && (
            <p className="mt-1 text-right text-xs text-stone-deep">for {nights} night{nights > 1 ? "s" : ""}</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Field({
  id, label, hint, error, optional, className = "", children,
}: { id: string; label: string; hint?: string; error?: string; optional?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="font-normal text-stone-deep"> (optional)</span>}
        {hint && <span className="ml-2 font-normal text-stone-deep">{hint}</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
}

function ReviewRow({ label, onEdit, children }: { label: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <dt className="text-sm text-stone-deep">{label}</dt>
        <dd className="mt-1">{children}</dd>
      </div>
      <button type="button" onClick={onEdit} className="text-sm font-semibold underline underline-offset-4">
        Edit<span className="sr-only"> {label.toLowerCase()}</span>
      </button>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-stone-deep">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

function PayOption({ checked, onSelect, title, detail }: { checked: boolean; onSelect: () => void; title: string; detail: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${checked ? "border-ink bg-white" : "border-mist bg-white hover:border-stone"}`}>
      <input type="radio" name="payment" checked={checked} onChange={onSelect} className="mt-1 h-4 w-4 accent-mangrove" />
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-stone-deep">{detail}</span>
      </span>
    </label>
  );
}

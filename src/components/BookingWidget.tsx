"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { CalendarDays, Users, Tag } from "lucide-react";
import { addDays, isoDate } from "@/lib/format";
import { buttonClass } from "./Button";

type Variant = "hero" | "inline" | "compact";

type Props = {
  variant?: Variant;
  room?: string;
  className?: string;
  onSubmitted?: () => void;
};

/** Dates & guests → /book?checkIn=…&checkOut=…&adults=…&children=…&promo=…&room=… */
export function BookingWidget({ variant = "hero", room, className = "", onSubmitted }: Props) {
  const id = useId();
  const router = useRouter();
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [promo, setPromo] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [error, setError] = useState("");

  // Set dates on the client so the server render never disagrees about "today".
  useEffect(() => {
    const t = isoDate(new Date());
    setToday(t);
    setCheckIn((v) => v || t);
    setCheckOut((v) => v || addDays(t, 1));
  }, []);

  function onCheckIn(v: string) {
    setCheckIn(v);
    if (v && (!checkOut || checkOut <= v)) setCheckOut(addDays(v, 1));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!checkIn || !checkOut) return setError("Choose your check-in and check-out dates.");
    if (checkOut <= checkIn) return setError("Check-out must be at least one night after check-in.");
    setError("");
    const q = new URLSearchParams({ checkIn, checkOut, adults: String(adults), children: String(children) });
    if (promo.trim()) q.set("promo", promo.trim().toUpperCase());
    if (room) q.set("room", room);
    onSubmitted?.();
    router.push(`/book?${q.toString()}`);
  }

  const hero = variant === "hero";
  const layout = hero
    ? "grid grid-cols-2 gap-x-3 gap-y-4 lg:grid-cols-[1fr_1fr_0.8fr_0.8fr_auto] lg:items-end lg:gap-4"
    : "grid gap-4 grid-cols-2";
  const errorId = `${id}-error`;
  const inputCls = "field py-2.5";

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Check availability"
      className={`${hero ? "bg-porcelain p-5 md:p-6" : ""} ${className}`}
    >
      <div className={layout}>
        <div>
          <label htmlFor={`${id}-in`} className="field-label flex items-center gap-1.5">
            <CalendarDays aria-hidden className="h-4 w-4 text-stone-deep" strokeWidth={1.5} /> Check-in
          </label>
          <input
            id={`${id}-in`}
            type="date"
            className={inputCls}
            value={checkIn}
            min={today}
            onChange={(e) => onCheckIn(e.target.value)}
            aria-describedby={error ? errorId : undefined}
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-out`} className="field-label flex items-center gap-1.5">
            <CalendarDays aria-hidden className="h-4 w-4 text-stone-deep" strokeWidth={1.5} /> Check-out
          </label>
          <input
            id={`${id}-out`}
            type="date"
            className={inputCls}
            value={checkOut}
            min={checkIn ? addDays(checkIn, 1) : today}
            onChange={(e) => setCheckOut(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            required
          />
        </div>
        <div>
          <label htmlFor={`${id}-adults`} className="field-label flex items-center gap-1.5">
            <Users aria-hidden className="h-4 w-4 text-stone-deep" strokeWidth={1.5} /> Adults
          </label>
          <select id={`${id}-adults`} className={inputCls} value={adults} onChange={(e) => setAdults(+e.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-children`} className="field-label">
            Children
          </label>
          <select
            id={`${id}-children`}
            className={inputCls}
            value={children}
            onChange={(e) => setChildren(+e.target.value)}
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {showPromo && (
          <div className={hero ? "col-span-2 lg:order-last" : "col-span-2"}>
            <label htmlFor={`${id}-promo`} className="field-label">
              Promo code
            </label>
            <input
              id={`${id}-promo`}
              className={`${inputCls} uppercase`}
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              autoComplete="off"
            />
          </div>
        )}

        <div className={hero ? "col-span-2 lg:col-span-1" : "col-span-2"}>
          <button type="submit" className={buttonClass("primary", "w-full whitespace-nowrap")}>
            Check availability
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-red-800">
            {error}
          </p>
        ) : (
          <span />
        )}
        {!showPromo && (
          <button
            type="button"
            onClick={() => setShowPromo(true)}
            className="inline-flex items-center gap-1.5 text-sm text-stone-deep underline-offset-4 hover:text-ink hover:underline"
          >
            <Tag aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} /> Add a promo code
          </button>
        )}
      </div>
    </form>
  );
}

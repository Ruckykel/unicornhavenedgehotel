"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { FormState } from "@/lib/form-state";
import { buttonClass } from "./Button";

type FieldProps = {
  name: string;
  label: string;
  state?: FormState;
  hint?: string;
  optional?: boolean;
  className?: string;
};

function describedBy(name: string, hint?: string, error?: string) {
  return [hint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;
}

function FieldShell({ name, label, hint, optional, error, className = "", children }: FieldProps & { error?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="field-label">
        {label}
        {optional && <span className="font-normal text-stone-deep"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="-mt-1 mb-1.5 text-sm text-stone-deep">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${name}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  name,
  label,
  state,
  hint,
  optional,
  className,
  ...input
}: FieldProps & Omit<ComponentProps<"input">, "name">) {
  const error = state?.errors?.[name];
  return (
    <FieldShell {...{ name, label, hint, optional, className, error }}>
      <input
        id={name}
        name={name}
        className="field"
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        defaultValue={state?.values?.[name]}
        {...input}
      />
    </FieldShell>
  );
}

export function TextArea({
  name,
  label,
  state,
  hint,
  optional,
  className,
  ...input
}: FieldProps & Omit<ComponentProps<"textarea">, "name">) {
  const error = state?.errors?.[name];
  return (
    <FieldShell {...{ name, label, hint, optional, className, error }}>
      <textarea
        id={name}
        name={name}
        rows={5}
        className="field resize-y"
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        defaultValue={state?.values?.[name]}
        {...input}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  state,
  hint,
  optional,
  className,
  options,
  placeholder,
  ...input
}: FieldProps & Omit<ComponentProps<"select">, "name"> & { options: readonly string[]; placeholder?: string }) {
  const error = state?.errors?.[name];
  return (
    <FieldShell {...{ name, label, hint, optional, className, error }}>
      <select
        id={name}
        name={name}
        className="field"
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        defaultValue={state?.values?.[name] ?? ""}
        {...input}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Hidden from people and assistive tech; bots tend to fill it. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ children, className = "", pendingLabel = "Sending…" }: { children: ReactNode; className?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={buttonClass("primary", className)} disabled={pending} aria-disabled={pending}>
      {pending ? (
        <>
          <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormMessage({ state, tone = "light" }: { state: FormState; tone?: "light" | "dark" }) {
  if (state.status === "idle" || !state.message) return null;
  const ok = state.status === "success";
  const color = tone === "dark" ? (ok ? "text-porcelain" : "text-red-200") : ok ? "text-mangrove" : "text-red-800";
  return (
    <p role={ok ? "status" : "alert"} className={`flex items-start gap-2 text-sm ${color}`}>
      {ok ? <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />}
      {state.message}
    </p>
  );
}

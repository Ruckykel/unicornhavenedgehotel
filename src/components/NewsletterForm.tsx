"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions";
import { initialFormState } from "@/lib/form-state";
import { FormMessage, Honeypot, SubmitButton } from "./forms";

export function NewsletterForm() {
  const [state, action] = useActionState(subscribeNewsletter, initialFormState);
  const error = state.errors?.email;
  return (
    <form action={action} className="relative" noValidate>
      <Honeypot />
      <label htmlFor="newsletter-email" className="mb-2 block text-sm text-sage">
        Occasional offers and news. No spam.
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          required
          defaultValue={state.values?.email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="min-h-[44px] w-full min-w-0 rounded-sm border border-porcelain/30 bg-transparent px-3.5 text-porcelain placeholder:text-sage/80 focus:border-porcelain focus:outline-none"
        />
        <SubmitButton className="shrink-0 px-4" pendingLabel="…">
          Sign up
        </SubmitButton>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="mt-2">
        <FormMessage state={state} tone="dark" />
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { submitCorporate } from "@/app/actions";
import { initialFormState } from "@/lib/form-state";
import { FormMessage, Honeypot, SubmitButton, TextArea, TextField } from "./forms";

export function CorporateForm() {
  const [state, action] = useActionState(submitCorporate, initialFormState);

  if (state.status === "success") {
    return (
      <div className="border-t border-ink pt-6">
        <FormMessage state={state} />
      </div>
    );
  }

  return (
    <form action={action} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <Honeypot />
      <TextField name="company" label="Company or organisation" autoComplete="organization" state={state} className="sm:col-span-2" />
      <TextField name="name" label="Contact name" autoComplete="name" state={state} />
      <TextField name="email" label="Email" type="email" autoComplete="email" state={state} />
      <TextField name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" state={state} />
      <TextField
        name="nights"
        label="Estimated nights per month"
        inputMode="numeric"
        optional
        state={state}
      />
      <TextArea
        name="message"
        label="Anything we should know?"
        optional
        hint="Travel dates, number of guests, invoicing needs."
        state={state}
        className="sm:col-span-2"
      />
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormMessage state={state} />
        <SubmitButton className="self-start">Request a corporate quote</SubmitButton>
      </div>
    </form>
  );
}

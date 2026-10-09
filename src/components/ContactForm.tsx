"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions";
import { CONTACT_SUBJECTS, initialFormState } from "@/lib/form-state";
import { FormMessage, Honeypot, SelectField, SubmitButton, TextArea, TextField } from "./forms";

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initialFormState);

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
      <TextField name="name" label="Name" autoComplete="name" state={state} />
      <TextField name="email" label="Email" type="email" autoComplete="email" state={state} />
      <TextField name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" optional state={state} />
      <SelectField name="subject" label="Subject" options={CONTACT_SUBJECTS} placeholder="Choose a subject" state={state} />
      <TextArea name="message" label="Message" state={state} className="sm:col-span-2" />
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormMessage state={state} />
        <SubmitButton className="self-start">Send message</SubmitButton>
      </div>
    </form>
  );
}

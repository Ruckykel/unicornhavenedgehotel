"use server";

import { z } from "zod";
import { sendEmail, RESERVATIONS_EMAIL } from "@/lib/email";
import { rateLimited } from "@/lib/rate-limit";
import type { FormState } from "@/lib/form-state";
import { siteSettings } from "@/lib/content";
import { CONTACT_SUBJECTS, emailSchema, fieldErrors, formValues, isBot, phoneSchema } from "@/lib/validation";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: emailSchema,
  phone: z.union([z.literal(""), phoneSchema]),
  subject: z.enum(CONTACT_SUBJECTS, { message: "Choose a subject." }),
  message: z.string().trim().min(10, "Write a short message (at least 10 characters).").max(3000),
});

export async function submitContact(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { status: "success", message: "Thanks. We'll be in touch shortly." };
  if (await rateLimited("contact"))
    return { status: "error", message: "Too many messages from this connection. Please try again in a few minutes." };

  const parsed = contactSchema.safeParse(formValues(fd));
  if (!parsed.success)
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: fieldErrors(parsed.error),
      values: formValues(fd),
    };

  const d = parsed.data;
  await sendEmail({
    to: RESERVATIONS_EMAIL,
    replyTo: d.email,
    subject: `Website enquiry: ${d.subject} — ${d.name}`,
    text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "—"}\nSubject: ${d.subject}\n\n${d.message}`,
  });
  await sendEmail({
    to: d.email,
    subject: "We've received your message",
    text: `Hi ${d.name},\n\nThanks for contacting ${siteSettings.name}. Our team will reply as soon as possible. For anything urgent, call ${siteSettings.phone} or message us on WhatsApp.\n\nYour message:\n${d.message}\n\n${siteSettings.name}\n${siteSettings.address.street}, ${siteSettings.address.city}`,
  });
  return { status: "success", message: "Thanks, your message is on its way. We'll reply as soon as we can." };
}

const corporateSchema = z.object({
  company: z.string().trim().min(2, "Enter your company or organisation."),
  name: z.string().trim().min(2, "Enter the contact person's name."),
  email: emailSchema,
  phone: phoneSchema,
  nights: z.string().trim().optional(),
  message: z.string().trim().max(3000).optional(),
});

export async function submitCorporate(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { status: "success", message: "Thanks. We'll be in touch shortly." };
  if (await rateLimited("corporate"))
    return { status: "error", message: "Too many requests from this connection. Please try again in a few minutes." };

  const parsed = corporateSchema.safeParse(formValues(fd));
  if (!parsed.success)
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: fieldErrors(parsed.error),
      values: formValues(fd),
    };

  const d = parsed.data;
  await sendEmail({
    to: RESERVATIONS_EMAIL,
    replyTo: d.email,
    subject: `Corporate / long-stay enquiry — ${d.company}`,
    text: `Company: ${d.company}\nContact: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nEstimated nights per month: ${d.nights || "—"}\n\n${d.message || "(no message)"}`,
  });
  await sendEmail({
    to: d.email,
    subject: "Your corporate rate enquiry",
    text: `Hi ${d.name},\n\nThank you for your interest in corporate and long-stay rates at ${siteSettings.name}. Our reservations team will send a tailored quote for ${d.company} shortly.\n\n${siteSettings.name}\n${siteSettings.phone}`,
  });
  return { status: "success", message: "Thank you. Our reservations team will be in touch with a quote." };
}

export async function subscribeNewsletter(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { status: "success", message: "You're on the list." };
  if (await rateLimited("newsletter", 3)) return { status: "error", message: "Please try again in a few minutes." };
  const parsed = z.object({ email: emailSchema }).safeParse(formValues(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values: formValues(fd) };
  // TODO(client): connect a mailing list provider (e.g. Mailchimp, Brevo). For now the address is emailed to reservations.
  await sendEmail({
    to: RESERVATIONS_EMAIL,
    subject: "New newsletter signup",
    text: `Please add ${parsed.data.email} to the guest newsletter list.`,
  });
  return { status: "success", message: "You're on the list. Expect the occasional note about offers, never spam." };
}

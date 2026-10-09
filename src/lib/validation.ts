import { z } from "zod";

// Nigerian numbers (0803…, +234…) or any international number.
export const phoneSchema = z
  .string()
  .trim()
  .refine((v) => /^\+?[\d\s\-()]{7,20}$/.test(v) && v.replace(/\D/g, "").length >= 7, {
    message: "Enter a phone number, e.g. 0803 123 4567 or +44 7700 900123.",
  });

export const emailSchema = z.string().trim().email("Enter an email address, e.g. name@example.com.");

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const k = String(issue.path[0]);
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

export const formValues = (fd: FormData) =>
  Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;

/** Honeypot: real people never fill the hidden "company_website" field. */
export const isBot = (fd: FormData) => !!fd.get("company_website");

export { CONTACT_SUBJECTS } from "./form-state";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

export const CONTACT_SUBJECTS = [
  "Room booking",
  "Restaurant",
  "Corporate or long stay",
  "Events",
  "Feedback",
  "Other",
] as const;

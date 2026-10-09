import "server-only";

type Mail = { to: string | string[]; subject: string; text: string; html?: string; replyTo?: string };

export const RESERVATIONS_EMAIL = process.env.RESERVATIONS_EMAIL || "reservations@unicornhavenedgehotel.com";
const FROM = process.env.EMAIL_FROM || "Unicorn Haven Edge Hotel <reservations@unicornhavenedgehotel.com>";

/** Sends through Resend's REST API. Without RESEND_API_KEY, logs instead (dev). */
export async function sendEmail(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email:dev] to=${mail.to} subject="${mail.subject}"\n${mail.text}`);
    return true;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
        html: mail.html ?? textToHtml(mail.text),
        reply_to: mail.replyTo,
      }),
    });
    if (!res.ok) console.error("[email] Resend error", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[email] send failed", e);
    return false;
  }
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function textToHtml(text: string) {
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#14171A;max-width:560px">${text
    .split("\n\n")
    .map((p) => `<p>${escape(p).replace(/\n/g, "<br>")}</p>`)
    .join("")}</div>`;
}

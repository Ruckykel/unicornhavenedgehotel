import { NextResponse } from "next/server";
import { validWebhookSignature } from "@/lib/paystack";
import { sendBookingEmails, type GuestContact } from "@/lib/booking-server";
import type { BookingSummary } from "@/lib/booking";

// Paystack → Settings → API Keys & Webhooks → Webhook URL:
//   https://www.unicornhavenedgehotel.com/api/paystack/webhook
// A booking is only treated as paid once this signed event arrives.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!validWebhookSignature(raw, req.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    data: {
      reference: string;
      amount: number;
      status: string;
      channel: string;
      paid_at?: string;
      metadata?: { booking?: BookingSummary; guest?: GuestContact } | string;
    };
  };

  if (event.event === "charge.success" && event.data.status === "success") {
    const meta = typeof event.data.metadata === "string" ? JSON.parse(event.data.metadata) : event.data.metadata;
    if (meta?.booking && meta?.guest && meta.booking.ref === event.data.reference) {
      // Phase 1 has no database: the reservations email is the record of
      // reference, amount (kobo → naira), status, channel and timestamp.
      await sendBookingEmails({ ...meta.booking, paymentStatus: "paid" }, meta.guest, {
        amount: event.data.amount / 100,
        channel: event.data.channel,
        reference: event.data.reference,
        paidAt: event.data.paid_at ?? null,
      });
    }
  }

  return NextResponse.json({ ok: true });
}

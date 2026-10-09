import type { Metadata } from "next";
import { roomsForBooking, siteSettings } from "@/lib/content";
import { paystackEnabled } from "@/lib/paystack";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book your stay",
  description: "Book a room at Unicorn Haven Edge Hotel, Port Harcourt. Choose your dates and room, then pay securely with Paystack or at the hotel.",
  alternates: { canonical: "/book" },
  robots: { index: false, follow: true },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const day = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");
const int = (v: string, min: number, max: number, fallback: number) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

export default async function BookPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const rooms = roomsForBooking();
  const room = str(sp.room);
  const guests = int(str(sp.guests), 1, 6, 2);

  return (
    <div className="bg-porcelain pb-section-sm pt-[104px] md:pb-section">
      <div className="container-site">
        <BookingFlow
          rooms={rooms}
          initial={{
            checkIn: day(str(sp.checkIn)),
            checkOut: day(str(sp.checkOut)),
            adults: int(str(sp.adults), 1, 6, guests),
            children: int(str(sp.children), 0, 4, 0),
            promo: str(sp.promo).slice(0, 40),
            room: rooms.some((r) => r.slug === room) ? room : "",
          }}
          payments={{
            paystack: paystackEnabled(),
            depositPercent: siteSettings.booking.depositPercent,
            payAtHotel: siteSettings.booking.allowPayAtHotel,
          }}
        />
      </div>
    </div>
  );
}

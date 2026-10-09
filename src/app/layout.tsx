import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { Analytics } from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-bodoni",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Unicorn Haven Edge Hotel | Hotel in Port Harcourt",
    template: "%s | Unicorn Haven Edge Hotel, Port Harcourt",
  },
  description:
    "A quiet, secure hotel at 30 Elelenwo Street, Port Harcourt, with 24/7 power, high-speed Wi-Fi, an on-site restaurant and secure parking. Book direct or chat on WhatsApp.",
  applicationName: "Unicorn Haven Edge Hotel",
  openGraph: {
    type: "website",
    siteName: "Unicorn Haven Edge Hotel",
    locale: "en_NG",
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Unicorn Haven Edge Hotel, Port Harcourt" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/default.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#1F3A33",
  width: "device-width",
  initialScale: 1,
};

// Shows the badge reveal once per browser session (see .seal-loader).
const sealScript = `try{if(sessionStorage.getItem('uhe-seal')){document.documentElement.classList.add('seal-seen')}else{sessionStorage.setItem('uhe-seal','1')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${bodoni.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: sealScript }} />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <MobileBookingBar />
        <Analytics />
      </body>
    </html>
  );
}

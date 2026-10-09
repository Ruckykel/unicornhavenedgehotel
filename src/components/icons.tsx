import {
  AirVent,
  Car,
  Clock,
  ConciergeBell,
  Coffee,
  Lamp,
  Receipt,
  ShieldCheck,
  Sofa,
  Trees,
  Tv,
  UtensilsCrossed,
  Wifi,
  Zap,
  Check,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  AirVent,
  Car,
  Clock,
  ConciergeBell,
  Coffee,
  Lamp,
  Receipt,
  ShieldCheck,
  Sofa,
  Trees,
  Tv,
  UtensilsCrossed,
  Wifi,
  Zap,
};

/** Resolves a CMS icon name to a Lucide icon (falls back to a check mark). */
export function AmenityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Check;
  return <Icon aria-hidden className={className} strokeWidth={1.5} />;
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

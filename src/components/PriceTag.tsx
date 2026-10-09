import { formatNaira } from "@/lib/format";

type Props = { amount: number | null; suffix?: string; className?: string; prefix?: string };

/** "From ₦35,000 / night", or "Rate on request" when the rate isn't confirmed. */
export function PriceTag({ amount, suffix = "/ night", prefix = "From", className = "" }: Props) {
  if (amount === null) return <span className={className}>Rate on request</span>;
  return (
    <span className={className}>
      {prefix && <span className="font-normal">{prefix} </span>}
      <span className="font-semibold tabular-nums">{formatNaira(amount)}</span>
      {suffix && <span className="font-normal"> {suffix}</span>}
    </span>
  );
}

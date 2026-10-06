import { cn } from "@/lib/utils";

export default function ChallengeProgress({ value, target, unit, pct, complete, className }) {
  const fmt = (n) => {
    if (unit === "days") return `${n} day${n === 1 ? "" : "s"}`;
    if (unit === "items") return `${n} item${n === 1 ? "" : "s"}`;
    return `${Number(n).toFixed(n < 10 && unit === "kg" ? 1 : 0)} kg`;
  };
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[0.72rem] mb-1.5">
        <span className="tabular text-muted-foreground">{fmt(value)} <span className="text-muted-foreground/50">/ {fmt(target)}</span></span>
        <span className={cn("font-medium lowercase", complete ? "text-primary" : "text-muted-foreground")}>{complete ? "complete" : `${pct}%`}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-sm bg-secondary border border-border">
        <div className={cn("h-full rounded-sm transition-all duration-700", complete ? "bg-primary" : "bg-primary/70")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
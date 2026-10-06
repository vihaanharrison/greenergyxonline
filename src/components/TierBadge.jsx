import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIERS } from "@/lib/xp";

const TONE = {
  seed: "text-muted-foreground border-border",
  sprout: "text-primary border-primary/40",
  sapling: "text-primary border-primary/55",
  grove: "text-primary border-primary/70",
  forest: "text-primary border-primary"
};

export default function TierBadge({ tier, xp, className }) {
  const name = (tier || "seed").toLowerCase();
  const tone = TONE[name] || TONE.seed;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[0.68rem] font-medium lowercase tracking-tight", tone, className)}>
      <Leaf className="h-3 w-3" strokeWidth={2.4} />
      {name}
      {typeof xp === "number" && <span className="tabular text-muted-foreground/80 ml-0.5">{xp.toLocaleString()}xp</span>}
    </span>
  );
}

export function TierGlyph({ tier, className }) {
  const idx = TIERS.findIndex((t) => t.name === (tier || "seed"));
  const filled = Math.max(1, idx + 1);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden>
      {Array.from({ length: TIERS.length }).map((_, i) => (
        <span key={i} className={cn("h-1.5 w-1.5 rounded-full", i < filled ? "bg-primary" : "bg-muted-foreground/30")} />
      ))}
    </span>
  );
}
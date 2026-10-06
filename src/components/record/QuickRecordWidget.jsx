import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickRecordWidget() {
  return (
    <div className="rounded-md border border-border bg-surface-card p-6 shadow-hard">
      <div className="flex items-center gap-2 text-primary">
        <Leaf className="h-4 w-4" strokeWidth={2.4} />
        <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">start recording</span>
      </div>
      <p className="mt-3 editorial-title text-2xl text-foreground">record what you recycled.</p>
      <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
        Log a material, an amount and a date. earn XP, advance tiers and feed the community total.
      </p>
      <Button asChild className="press mt-5 w-full bg-primary text-primary-foreground shadow-hard-sm">
        <Link to="/new-record">+ record recycling</Link>
      </Button>
    </div>
  );
}
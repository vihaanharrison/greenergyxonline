import { progressToNext } from "@/lib/xp";

export default function XPBar({ xp, className }) {
  const p = progressToNext(xp || 0);
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[0.72rem] mb-2">
        <span className="lowercase text-muted-foreground">
          <span className="text-foreground font-semibold">{p.current.name}</span>
          {p.next ? <> · next: <span className="text-foreground">{p.next.name}</span></> : <> · max tier</>}
        </span>
        <span className="tabular text-muted-foreground">
          {p.complete ? `${(xp || 0).toLocaleString()} xp` : `${p.xpInto}/${p.xpNeeded} xp`}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-sm bg-secondary border border-border">
        <div
          className="h-full rounded-sm bg-primary transition-all duration-700 ease-out"
          style={{ width: `${p.pct}%` }}
        />
      </div>
    </div>
  );
}
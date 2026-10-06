import { useMemo } from "react";
import { toKg } from "@/lib/greenergy";

export default function ActivityChart({ records = [], days = 14 }) {
  const buckets = useMemo(() => {
    const map = new Map();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      map.set(d.toDateString(), 0);
    }
    records.forEach((r) => {
      const d = new Date(r.date || r.created_date);
      if (isNaN(d)) return;
      const key = d.toDateString();
      if (map.has(key)) map.set(key, (map.get(key) || 0) + toKg(r));
    });
    return Array.from(map.entries()).map(([k, v]) => ({ key: k, value: v }));
  }, [records, days]);

  const max = Math.max(0.001, ...buckets.map((b) => b.value));

  if (buckets.every((b) => b.value === 0)) {
    return <p className="py-8 text-center text-[0.82rem] text-muted-foreground">no activity in the last {days} days.</p>;
  }

  return (
    <div>
      <div className="flex items-end gap-1 h-32">
        {buckets.map((b, i) => {
          const h = Math.max(2, (b.value / max) * 100);
          const d = new Date(b.key);
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5" title={`${b.value.toFixed(1)} kg`}>
              <div className="w-full rounded-sm bg-primary/80 transition-all" style={{ height: `${h}%`, opacity: b.value > 0 ? 1 : 0.25 }} />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[0.62rem] text-muted-foreground tabular">
        <span>{new Date(buckets[0].key).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
        <span>today</span>
      </div>
    </div>
  );
}
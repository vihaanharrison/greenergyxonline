import { useMemo } from "react";
import { MATERIALS, toKg } from "@/lib/greenergy";

export default function MaterialDistribution({ records = [] }) {
  const data = useMemo(() => {
    const totals = {};
    records.forEach((r) => { totals[r.material] = (totals[r.material] || 0) + toKg(r); });
    return MATERIALS
      .map((m) => ({ ...m, kg: totals[m.value] || 0 }))
      .filter((m) => m.kg > 0)
      .sort((a, b) => b.kg - a.kg);
  }, [records]);

  if (data.length === 0) {
    return <p className="py-6 text-center text-[0.82rem] text-muted-foreground">no materials recorded yet.</p>;
  }

  const total = data.reduce((s, d) => s + d.kg, 0);

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-sm border border-border">
        {data.map((d) => (
          <div key={d.value} style={{ width: `${(d.kg / total) * 100}%`, backgroundColor: d.color }} title={`${d.label}: ${d.kg.toFixed(1)} kg`} />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
        {data.map((d) => (
          <li key={d.value} className="flex items-center justify-between text-[0.78rem]">
            <span className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="lowercase text-foreground truncate">{d.label}</span>
            </span>
            <span className="tabular text-muted-foreground shrink-0">{d.kg < 1 ? `${Math.round(d.kg * 1000)}g` : `${d.kg.toFixed(1)}kg`} · {Math.round((d.kg / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
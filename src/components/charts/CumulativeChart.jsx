import { useMemo } from "react";
import { toKg } from "@/lib/greenergy";

export default function CumulativeChart({ records = [] }) {
  const points = useMemo(() => {
    const sorted = [...records]
      .filter((r) => r.date || r.created_date)
      .sort((a, b) => new Date(a.date || a.created_date) - new Date(b.date || b.created_date));
    let cum = 0;
    return sorted.map((r) => { cum += toKg(r); return { date: r.date || r.created_date, cum }; });
  }, [records]);

  if (points.length < 2) {
    return <p className="py-8 text-center text-[0.82rem] text-muted-foreground">record at least two actions to see your cumulative impact.</p>;
  }

  const W = 300, H = 120, P = 6;
  const xs = points.map((p) => new Date(p.date).getTime());
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const maxY = Math.max(...points.map((p) => p.cum), 0.001);
  const x = (t) => P + ((t - minX) / (maxX - minX || 1)) * (W - 2 * P);
  const y = (v) => H - P - (v / maxY) * (H - 2 * P);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(new Date(p.date).getTime()).toFixed(1)},${y(p.cum).toFixed(1)}`).join(" ");
  const area = `${path} L${x(maxX).toFixed(1)},${(H - P).toFixed(1)} L${x(minX).toFixed(1)},${(H - P).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
      <defs>
        <linearGradient id="cum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(111 49% 48%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(111 49% 48%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cum)" />
      <path d={path} fill="none" stroke="hsl(111 49% 48%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="hsl(74 7% 32%)" strokeWidth="1" />
    </svg>
  );
}
import { Recycle, Layers, Users, Target } from "lucide-react";
import { totalKg, totalItems } from "@/lib/greenergy";
import { formatWeight } from "@/lib/greenergy";

export default function ImpactMetrics({ records = [], participants = 0, challengeCompletions = 0 }) {
  const kg = totalKg(records);
  const items = totalItems(records);
  const metrics = [
    { label: "recycled", value: formatWeight(kg), icon: Recycle },
    { label: "records", value: records.length, icon: Layers },
    { label: "participants", value: participants, icon: Users },
    { label: "challenges done", value: challengeCompletions, icon: Target }
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-md overflow-hidden border border-border">
      {metrics.map((m) => (
        <div key={m.label} className="bg-surface-card px-5 py-5">
          <m.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
          <p className="mt-3 font-display text-[2rem] leading-none tabular text-foreground lowercase">{m.value}</p>
          <p className="mt-1 text-[0.7rem] uppercase tracking-wider text-muted-foreground">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
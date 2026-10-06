import { CheckCircle2, Zap, Target, Leaf } from "lucide-react";
import RecordForm from "@/components/record/RecordForm";

const STEPS = [
  "pick a material",
  "enter amount + unit",
  "set the date",
  "add a photo + caption if you like",
  "choose public or private",
  "link a challenge if eligible"
];

export default function NewRecord() {
  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-8 md:py-12">
      <header className="mb-8">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">record</p>
        <h1 className="mt-2 editorial-title text-foreground" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>record a recycling action.</h1>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">saved to your history, updates your XP + tier, advances eligible challenges, and feeds the community total if public.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1fr_1.6fr] items-start">
        <aside className="rounded-md border border-border bg-surface-card p-5">
          <div className="flex items-center gap-2 text-primary"><Leaf className="h-4 w-4" strokeWidth={2.4} /><span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">how it works</span></div>
          <ul className="mt-4 space-y-2.5 text-[0.82rem] text-foreground/80">
            {STEPS.map((s) => <li key={s} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-positive shrink-0 mt-0.5" /> {s}</li>)}
          </ul>
          <div className="mt-5 rounded-md border border-primary/40 bg-primary/10 p-3">
            <p className="flex items-center gap-1.5 text-[0.78rem] text-primary"><Zap className="h-3.5 w-3.5 fill-primary" /> XP = base + per kg + per item</p>
            <p className="mt-1 text-[0.72rem] text-muted-foreground">challenges reward once, on real completion.</p>
          </div>
        </aside>
        <div className="rounded-md border border-border bg-surface-card p-5 sm:p-6 shadow-hard-sm">
          <RecordForm />
        </div>
      </div>
    </div>
  );
}
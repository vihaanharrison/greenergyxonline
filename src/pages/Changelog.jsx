import { Link } from "react-router-dom";
import { Leaf, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const V1 = [
  "recycling records",
  "basic community participation",
  "public posts / community concept",
  "basic environmental information",
  "small sustainability shop"
];

const V2 = [
  "redesigned greenergyX identity",
  "user accounts and profiles",
  "social activity feed",
  "recycling achievement posts",
  "image uploads",
  "comments and reactions",
  "following",
  "challenges",
  "XP and progression tiers",
  "leaderboards",
  "personal impact dashboards",
  "community impact dashboard",
  "improved responsive interface",
  "notifications",
  "improved data structure"
];

function Release({ tag, version, title, year, items, latest }) {
  return (
    <div className="relative pl-8 md:pl-10">
      <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background">
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>
      <div className="rounded-md border border-border bg-surface-card p-6 shadow-hard-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm border border-primary/50 bg-primary/15 px-2 py-0.5 text-[0.7rem] font-semibold text-primary">{tag}</span>
          <h2 className="font-display text-2xl lowercase text-foreground">{version}</h2>
          {latest && <span className="text-[0.68rem] uppercase tracking-wider text-muted-foreground">· current</span>}
        </div>
        <p className="mt-1 text-[0.85rem] lowercase text-muted-foreground">{title} · {year}</p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-2 text-[0.85rem] text-foreground/85">
              {latest ? <Plus className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> : <Check className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />} {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Changelog() {
  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-10 md:py-16">
      <header className="mb-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-card px-3 py-1 text-[0.7rem] lowercase text-muted-foreground"><Leaf className="h-3 w-3 text-primary" /> changelog</span>
        <h1 className="mt-5 editorial-title text-foreground" style={{ fontSize: "clamp(2.25rem,5vw,3.5rem)" }}>release history.</h1>
        <p className="mt-3 text-[0.9rem] text-muted-foreground">the honest version of how greenergyX grew up.</p>
      </header>

      <div className="relative space-y-10 before:content-[''] before:absolute before:left-[9px] md:before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
        <Release tag="v1.0" version="greenergyX 1.0" title="original wix edition" year="2023" items={V1} />
        <Release tag="v2.0" version="greenergyX 2.0" title="community edition" year="2026" items={V2} latest />
      </div>

      <div className="mt-12 rounded-md border border-border bg-surface-card p-6 text-center">
        <p className="text-[0.88rem] text-muted-foreground">1.0 established the idea. 2.0 is the evolution — same mission, a fuller platform.</p>
        <Button asChild className="press mt-4 bg-primary text-primary-foreground shadow-hard-sm"><Link to="/feed">explore 2.0</Link></Button>
      </div>
    </div>
  );
}
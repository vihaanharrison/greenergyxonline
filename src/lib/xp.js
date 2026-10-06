// Central, configurable XP + progression rules for GreenergyX 2.0.
// Change values here to re-tune the whole system without rewriting the app.

export const XP_RULES = {
  record_base: 8,        // flat XP per valid recycling record
  per_kg: 15,             // XP per kilogram recycled
  per_item: 1,            // XP per item (when unit is "items")
  challenge_join: 0,      // no XP for merely joining
  post: 0,                // posting earns no XP (anti-spam)
  reaction: 0,            // reactions earn no XP
  comment: 0              // comments earn no XP
};

// Tier thresholds — leaf-named, within GreenergyX graphic language.
export const TIERS = [
  { name: "seed", min: 0, blurb: "every action starts here" },
  { name: "sprout", min: 300, blurb: "roots forming" },
  { name: "sapling", min: 1000, blurb: "growing steady" },
  { name: "grove", min: 2500, blurb: "a small stand" },
  { name: "forest", min: 6000, blurb: "canopy status" }
];

export function calcRecordXp(record) {
  if (!record) return 0;
  const kg = toKg(record);
  const items = record.unit === "items" ? Number(record.quantity) || 0 : 0;
  const xp = XP_RULES.record_base + Math.round(kg * XP_RULES.per_kg) + items * XP_RULES.per_item;
  return Math.max(XP_RULES.record_base, xp);
}

function toKg(record) {
  const q = Number(record.quantity) || 0;
  if (record.unit === "g") return q / 1000;
  if (record.unit === "items") return 0;
  return q; // kg
}

export function tierForXp(xp) {
  let current = TIERS[0];
  for (const t of TIERS) {
    if (xp >= t.min) current = t;
  }
  return current;
}

export function nextTier(xp) {
  for (const t of TIERS) {
    if (t.min > xp) return t;
  }
  return null;
}

export function progressToNext(xp) {
  const current = tierForXp(xp);
  const next = nextTier(xp);
  if (!next) return { current, next: null, pct: 100, xpInto: xp - current.min, xpNeeded: 0, complete: true };
  const span = next.min - current.min;
  const into = xp - current.min;
  return { current, next, pct: Math.min(100, Math.round((into / span) * 100)), xpInto: into, xpNeeded: span, complete: false };
}
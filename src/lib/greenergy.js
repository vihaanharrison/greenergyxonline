// Material + formatting helpers for GreenergyX 2.0 (dark brand palette).

export const MATERIALS = [
  { value: "plastic", label: "plastic", color: "#7fb3d5" },
  { value: "paper", label: "paper", color: "#d9c79b" },
  { value: "cardboard", label: "cardboard", color: "#b08d57" },
  { value: "glass", label: "glass", color: "#8fd1c0" },
  { value: "cans", label: "metal / cans", color: "#9aa7b0" },
  { value: "textiles", label: "textiles", color: "#c98fb0" },
  { value: "compost", label: "organic / compost", color: "#8fa05c" },
  { value: "ewaste", label: "e-waste", color: "#c9a36b" },
  { value: "other", label: "other", color: "#9a9d8e" }
];

export const MATERIAL_MAP = Object.fromEntries(MATERIALS.map((m) => [m.value, m]));

export const UNITS = ["kg", "g", "items"];

export function materialColor(material) {
  return MATERIAL_MAP[material]?.color || "#9a9d8e";
}

export function materialLabel(material) {
  return MATERIAL_MAP[material]?.label || material || "other";
}

export function toKg(record) {
  if (!record) return 0;
  const q = Number(record.quantity) || 0;
  if (record.unit === "g") return q / 1000;
  if (record.unit === "items") return 0;
  return q;
}

export function totalKg(records = []) {
  return records.reduce((sum, r) => sum + toKg(r), 0);
}

export function totalItems(records = []) {
  return records.reduce((sum, r) => (r.unit === "items" ? sum + (Number(r.quantity) || 0) : sum), 0);
}

export function formatWeight(kg) {
  if (!kg || kg <= 0) return "0 kg";
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  if (kg < 100) return `${kg.toFixed(kg < 10 ? 1 : 0)} kg`;
  return `${Math.round(kg).toLocaleString()} kg`;
}

export function formatQty(record) {
  if (!record) return "";
  const q = Number(record.quantity) || 0;
  const u = record.unit || "kg";
  if (u === "items") return `${q} item${q === 1 ? "" : "s"}`;
  if (u === "g") return `${q} g`;
  return `${q} kg`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return formatDate(dateStr);
}
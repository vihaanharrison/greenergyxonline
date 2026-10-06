import { useMemo, useState } from "react";
import { Filter, Loader2, Recycle } from "lucide-react";
import RecordCard from "@/components/record/RecordCard";
import EmptyState from "@/components/common/EmptyState";
import { MATERIALS } from "@/lib/greenergy";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function withinPeriod(date, period) {
  if (!date || period === "all") return true;
  const d = new Date(date);
  const now = new Date();
  if (period === "week") return (now - d) / 86400000 <= 7;
  if (period === "month") return (now - d) / 86400000 <= 30;
  return true;
}

export default function CommunityFeed({ records, loading }) {
  const [material, setMaterial] = useState("all");
  const [period, setPeriod] = useState("all");
  const [contributor, setContributor] = useState("");

  const filtered = useMemo(() => {
    return (records || []).filter((r) => {
      if (material !== "all" && r.material !== material) return false;
      if (!withinPeriod(r.date, period)) return false;
      if (contributor && !(r.contributor_name || "").toLowerCase().includes(contributor.toLowerCase())) return false;
      return true;
    });
  }, [records, material, period, contributor]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2.5 mb-5">
        <div className="flex items-center gap-1.5 text-[0.75rem] uppercase tracking-wider text-muted-foreground shrink-0">
          <Filter className="h-3.5 w-3.5" /> Filter
        </div>
        <Select value={material} onValueChange={setMaterial}>
          <SelectTrigger className="h-9 w-full sm:w-44 rounded-md border-border bg-surface-card">
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent className="rounded-md border-border">
            <SelectItem value="all">All materials</SelectItem>
            {MATERIALS.map((m) => (
              <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-9 w-full sm:w-40 rounded-md border-border bg-surface-card">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="rounded-md border-border">
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          placeholder="Search contributor"
          className="h-9 w-full sm:w-48 rounded-md border-border bg-surface-card"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Recycle}
          title="No contributions yet"
          description={records && records.length > 0
            ? "No contributions match these filters. Try widening your search."
            : "Be the first to record a recycling action and it will appear here for the community to see."}
          actionLabel={records && records.length > 0 ? undefined : "Record recycling"}
          actionTo="/new-record"
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <RecordCard key={r.id} record={r} />
          ))}
        </div>
      )}
    </div>
  );
}
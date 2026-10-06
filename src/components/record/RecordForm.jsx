import { useEffect, useRef, useState } from "react";
import { Loader2, ImagePlus, X, Check, Zap, RotateCcw, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { MATERIALS, UNITS, materialColor, materialLabel } from "@/lib/greenergy";
import { calcRecordXp } from "@/lib/xp";
import { submitRecyclingRecord } from "@/lib/recording";
import { cn } from "@/lib/utils";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function RecordForm({ mode = "create", initialRecord, onDone }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [challenges, setChallenges] = useState([]);
  const [material, setMaterial] = useState(initialRecord?.material || "plastic");
  const [quantity, setQuantity] = useState(initialRecord?.quantity?.toString() || "");
  const [unit, setUnit] = useState(initialRecord?.unit || "kg");
  const [date, setDate] = useState(initialRecord?.date || todayStr());
  const [notes, setNotes] = useState(initialRecord?.notes || "");
  const [imageUrl, setImageUrl] = useState(initialRecord?.image_url || "");
  const [visibility, setVisibility] = useState(initialRecord?.visibility || "public");
  const [challengeId, setChallengeId] = useState(initialRecord?.challenge_id || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    base44.entities.Challenge.filter({ status: "active" }, "-created_date", 50).then(setChallenges).catch(() => {});
  }, []);

  const eligibleChallenges = challenges.filter((c) => !c.material || c.material === material);
  const xpPreview = calcRecordXp({ quantity: Number(quantity) || 0, unit, material });

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setImageUrl(file_url);
    } catch (err) { toast({ title: "upload failed", variant: "destructive" }); }
    finally { setUploading(false); }
  }

  async function submit(e) {
    e.preventDefault();
    if (!material || !quantity || !date) { toast({ title: "fill in material, amount and date", variant: "destructive" }); return; }
    setSubmitting(true);
    const payload = { material, quantity: Number(quantity), unit, date, notes: notes.trim() || undefined, image_url: imageUrl || undefined, visibility, challenge_id: challengeId || undefined };
    try {
      if (mode === "edit" && initialRecord) {
        await base44.entities.RecyclingRecord.update(initialRecord.id, payload);
        toast({ title: "record updated" });
        onDone?.();
      } else {
        const result = await submitRecyclingRecord(user, payload);
        setDone({ xp: result.xpEarned, challenges: result.challengesCompleted });
      }
    } catch (err) { toast({ title: "could not save record", description: err.message, variant: "destructive" }); }
    finally { setSubmitting(false); }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center text-center py-6 animate-scale-in">
        <span className="flex h-14 w-14 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-hard">
          <Check className="h-7 w-7" strokeWidth={2.4} />
        </span>
        <p className="mt-4 editorial-title text-2xl text-foreground">recorded.</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-primary">
          <Zap className="h-4 w-4 fill-primary" /> +{done.xp} xp earned
        </p>
        {done.challenges?.length > 0 && (
          <div className="mt-3 w-full rounded-md border border-primary/50 bg-primary/10 p-3 text-left">
            {done.challenges.map(({ challenge, xp }) => (
              <p key={challenge.id} className="flex items-center gap-1.5 text-[0.82rem] text-primary">
                <Target className="h-3.5 w-3.5" /> completed "{challenge.title.toLowerCase()}" · +{xp} xp
              </p>
            ))}
          </div>
        )}
        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="shadow-none rounded-md" onClick={() => { setDone(null); setMaterial("plastic"); setQuantity(""); setNotes(""); setImageUrl(""); setChallengeId(""); }}>
            <RotateCcw className="h-4 w-4" /> record another
          </Button>
          <Button asChild className="press bg-primary text-primary-foreground shadow-hard-sm">
            <a href="/feed">view feed</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      {/* material */}
      <div>
        <Label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">material</Label>
        <div className="grid grid-cols-3 gap-2">
          {MATERIALS.map((m) => (
            <button type="button" key={m.value} onClick={() => setMaterial(m.value)}
              className={cn("press flex items-center gap-2 rounded-md border px-3 py-2 text-[0.8rem] lowercase transition-colors",
                material === m.value ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground")}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* quantity + unit */}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <Label htmlFor="qty" className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">amount</Label>
          <Input id="qty" type="number" inputMode="decimal" min="0" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="rounded-md border-border bg-background tabular" />
        </div>
        <div>
          <Label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">unit</Label>
          <div className="flex rounded-md border border-border overflow-hidden">
            {UNITS.map((u) => (
              <button type="button" key={u} onClick={() => setUnit(u)}
                className={cn("px-3 py-2 text-[0.8rem] lowercase transition-colors", unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* date */}
      <div>
        <Label htmlFor="date" className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">date</Label>
        <Input id="date" type="date" value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} className="rounded-md border-border bg-background" />
      </div>

      {/* photo */}
      <div>
        <Label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">photo <span className="normal-case tracking-normal text-muted-foreground/60">(optional)</span></Label>
        {imageUrl ? (
          <div className="relative w-full max-w-xs overflow-hidden rounded-md border border-border">
            <Image src={imageUrl} alt="record" className="h-40 w-full" fittingType="fill" />
            <button type="button" onClick={() => setImageUrl("")} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/85 text-background"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="press flex h-24 w-full max-w-xs items-center justify-center gap-2 rounded-md border border-dashed border-border bg-secondary/50 text-muted-foreground hover:text-foreground disabled:opacity-60">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ImagePlus className="h-4 w-4" /><span className="text-[0.8rem]">{uploading ? "uploading…" : "add a photo"}</span></>}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* caption */}
      <div>
        <Label htmlFor="notes" className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">caption <span className="normal-case tracking-normal text-muted-foreground/60">(optional)</span></Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="say something about this action…" className="rounded-md border-border bg-background resize-none" />
      </div>

      {/* challenge */}
      {eligibleChallenges.length > 0 && (
        <div>
          <Label className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">related challenge <span className="normal-case tracking-normal text-muted-foreground/60">(optional)</span></Label>
          <select value={challengeId} onChange={(e) => setChallengeId(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-[0.85rem] lowercase focus-ring">
            <option value="">none</option>
            {eligibleChallenges.map((c) => <option key={c.id} value={c.id}>{c.title.toLowerCase()} · {c.reward_xp}xp</option>)}
          </select>
        </div>
      )}

      {/* visibility */}
      <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2.5">
        <div>
          <p className="text-[0.82rem] text-foreground">share to community feed</p>
          <p className="text-[0.72rem] text-muted-foreground">{visibility === "public" ? "public — visible to everyone" : "private — only you"}</p>
        </div>
        <Switch checked={visibility === "public"} onCheckedChange={(v) => setVisibility(v ? "public" : "private")} />
      </div>

      {/* xp preview + submit */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-primary/50 bg-primary/15 px-2.5 py-1.5 text-[0.8rem] font-semibold text-primary">
          <Zap className="h-3.5 w-3.5 fill-primary" /> +{xpPreview} xp
        </span>
        <Button type="submit" disabled={submitting || uploading} className="press bg-primary text-primary-foreground shadow-hard-sm">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "edit" ? "save changes" : "record it"}
        </Button>
      </div>
    </form>
  );
}
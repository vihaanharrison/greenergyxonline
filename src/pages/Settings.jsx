import { useEffect, useRef, useState } from "react";
import { Loader2, ImagePlus, Check, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/UserAvatar";
import { ensureMyProfile, clearProfileCache } from "@/lib/profile";

export default function Settings() {
  const { user, checkUserAuth } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    ensureMyProfile(user).then((p) => {
      setProfile(p); setDisplayName(p.display_name || ""); setUsername(p.username || ""); setBio(p.bio || ""); setLocation(p.location || ""); setAvatarUrl(p.avatar_url || "");
    });
  }, [user]);

  async function handleAvatar(e) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    try { const { file_url } = await base44.integrations.Core.UploadPublicFile({ file: f }); setAvatarUrl(file_url); }
    catch { toast({ title: "upload failed", variant: "destructive" }); }
    finally { setUploading(false); }
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await base44.entities.Profile.update(profile.id, {
        display_name: displayName.trim() || "member",
        username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "member",
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        avatar_url: avatarUrl || undefined
      });
      clearProfileCache(user.id);
      await checkUserAuth();
      setProfile(updated);
      toast({ title: "profile saved" });
    } catch (err) { toast({ title: "could not save", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  if (!profile) return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="mx-auto max-w-xl px-4 md:px-6 py-8 md:py-12">
      <header className="mb-8"><p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">settings</p><h1 className="mt-2 editorial-title text-3xl text-foreground">your profile.</h1></header>

      <form onSubmit={save} className="space-y-5 rounded-md border border-border bg-surface-card p-6 shadow-hard-sm">
        <div className="flex items-center gap-4">
          <UserAvatar name={displayName} src={avatarUrl} size="lg" />
          <div>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="press inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[0.8rem] text-muted-foreground hover:text-foreground disabled:opacity-60">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />} {uploading ? "uploading…" : "change avatar"}
            </button>
            {avatarUrl && <span className="ml-2 text-[0.75rem] text-primary inline-flex items-center gap-1"><Check className="h-3 w-3" /> set</span>}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
        </div>

        <div><Label htmlFor="dn" className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">display name</Label><Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="rounded-md border-border bg-background" /></div>
        <div><Label htmlFor="un" className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">username</Label><Input id="un" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-md border-border bg-background lowercase" /></div>
        <div><Label htmlFor="loc" className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">location / community</Label><Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. greenfield school" className="rounded-md border-border bg-background" /></div>
        <div><Label htmlFor="bio" className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-2 block">bio</Label><Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="a short line about you" className="rounded-md border-border bg-background resize-none" /></div>

        <div className="rounded-md border border-border bg-secondary/40 px-4 py-3">
          <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">account</p>
          <p className="mt-1 text-[0.85rem] text-foreground/85 lowercase">{user?.email}</p>
          <p className="mt-1 text-[0.72rem] text-muted-foreground">email is managed by your sign-in method.</p>
        </div>

        <Button type="submit" disabled={saving} className="press bg-primary text-primary-foreground shadow-hard-sm">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> save changes</>}</Button>
      </form>
    </div>
  );
}
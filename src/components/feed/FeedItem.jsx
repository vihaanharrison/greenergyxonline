import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Zap, Target, Loader2 } from "lucide-react";
import ShareMenu from "@/components/feed/ShareMenu";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel
} from "@/components/ui/alert-dialog";
import UserAvatar from "@/components/UserAvatar";
import TierBadge from "@/components/TierBadge";
import ReactionBar from "@/components/feed/ReactionBar";
import CommentThread from "@/components/feed/CommentThread";
import { materialColor, materialLabel, formatQty, timeAgo } from "@/lib/greenergy";

export default function FeedItem({ item, author, onDeleted }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isRecord = item.type === "record";
  const data = item.data;
  const ownerId = data.created_by_id;
  const isOwner = user && ownerId === user.id;
  const name = author?.display_name || data.contributor_name || data.author_name || "member";
  const username = author?.username;
  const tier = author?.tier;
  const xp = author?.xp;

  async function del() {
    setDeleting(true);
    try {
      await base44.entities[isRecord ? "RecyclingRecord" : "CommunityPost"].delete(data.id);
      toast({ title: "deleted" });
      onDeleted?.(data.id);
    } catch (e) { toast({ title: "could not delete", variant: "destructive" }); }
    finally { setDeleting(false); setConfirm(false); }
  }

  const shareUrl = ownerId ? `${window.location.origin}/u/${ownerId}` : window.location.origin;
  const shareTitle = isRecord
    ? `recycled ${formatQty(data)} of ${materialLabel(data.material)} on greenergyX`
    : `${data.title} — greenergyX`;

  return (
    <article className="rounded-md border border-border bg-surface-card p-4 sm:p-5 shadow-hard-sm animate-fade-up">
      {/* header */}
      <div className="flex items-start gap-3">
        <Link to={ownerId ? `/u/${ownerId}` : "#"}>
          <UserAvatar profile={author} name={name} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link to={ownerId ? `/u/${ownerId}` : "#"} className="font-heading text-[0.9rem] font-semibold lowercase text-foreground hover:text-primary">
              {name}
            </Link>
            {username && <span className="text-[0.72rem] text-muted-foreground lowercase">@{username}</span>}
            <TierBadge tier={tier} xp={xp} />
          </div>
          <p className="text-[0.72rem] text-muted-foreground">{timeAgo(data.date || data.created_date)}</p>
        </div>
        {isOwner && (
          <button onClick={() => setConfirm(true)} className="press text-muted-foreground hover:text-destructive" aria-label="delete">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* body */}
      <div className="mt-3">
        {isRecord ? (
          <>
            <p className="text-[0.95rem] text-foreground">
              recycled <span className="font-semibold tabular">{formatQty(data)}</span> of{" "}
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: materialColor(data.material) }} />
                <span className="font-semibold lowercase">{materialLabel(data.material)}</span>
              </span>
            </p>
            {data.notes && <p className="mt-2 text-[0.9rem] leading-relaxed text-foreground/85">{data.notes}</p>}
            {data.image_url && (
              <div className="mt-3 overflow-hidden rounded-md border border-border">
                <Image src={data.image_url} alt="recycling" className="h-72 w-full" fittingType="fill" />
              </div>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {data.xp_earned > 0 && (
                <span className="inline-flex items-center gap-1 rounded-sm border border-primary/50 bg-primary/15 px-2 py-0.5 text-[0.72rem] font-semibold text-primary">
                  <Zap className="h-3 w-3 fill-primary" /> +{data.xp_earned} xp
                </span>
              )}
              {data.challenge_id && (
                <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-secondary px-2 py-0.5 text-[0.72rem] text-muted-foreground">
                  <Target className="h-3 w-3" /> challenge
                </span>
              )}
              {data.location && <span className="text-[0.72rem] text-muted-foreground">· {data.location}</span>}
            </div>
          </>
        ) : (
          <>
            <h3 className="font-heading text-[1.05rem] font-semibold lowercase text-foreground leading-snug">{data.title}</h3>
            <p className="mt-1.5 text-[0.9rem] leading-relaxed text-foreground/85 whitespace-pre-wrap">{data.body}</p>
            {data.image_url && (
              <div className="mt-3 overflow-hidden rounded-md border border-border">
                <Image src={data.image_url} alt="post" className="h-72 w-full" fittingType="fill" />
              </div>
            )}
          </>
        )}
      </div>

      {/* footer */}
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        <ReactionBar targetType={isRecord ? "record" : "post"} targetId={data.id} ownerId={ownerId} />
        <CommentThread targetType={isRecord ? "record" : "post"} targetId={data.id} ownerId={ownerId} />
        <ShareMenu title={shareTitle} url={shareUrl} />
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent className="rounded-md border-border bg-surface-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading lowercase text-2xl text-foreground">delete this {isRecord ? "record" : "post"}?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">this can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="shadow-none rounded-md">cancel</AlertDialogCancel>
            <AlertDialogAction onClick={del} disabled={deleting} className="rounded-md bg-destructive text-destructive-foreground shadow-none">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
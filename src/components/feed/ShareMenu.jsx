import { Share2, Link2, Send, Twitter, Facebook, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function ShareMenu({ title, url }) {
  const { toast } = useToast();
  const text = title || "greenergyX — recycling is better together";
  const hasNative = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "link copied" });
    } catch {
      toast({ title: "could not copy link", variant: "destructive" });
    }
  }

  function native() {
    if (hasNative) navigator.share({ title, url }).catch(() => {});
    else copy();
  }

  function open(href) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="press ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[0.78rem] text-muted-foreground hover:text-foreground">
          <Share2 className="h-3.5 w-3.5" /> share
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-md border-border bg-surface-card">
        <DropdownMenuItem className="cursor-pointer rounded-sm" onClick={copy}>
          <Link2 className="h-4 w-4" /> copy link
        </DropdownMenuItem>
        {hasNative && (
          <DropdownMenuItem className="cursor-pointer rounded-sm" onClick={native}>
            <Send className="h-4 w-4" /> share via…
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer rounded-sm"
          onClick={() => open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)}
        >
          <Twitter className="h-4 w-4" /> post on X
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer rounded-sm"
          onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
        >
          <Facebook className="h-4 w-4" /> facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer rounded-sm"
          onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`)}
        >
          <MessageCircle className="h-4 w-4" /> whatsapp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
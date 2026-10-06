import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name) {
  if (!name) return "gx";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toLowerCase() || "gx";
}

export default function UserAvatar({ profile, user, name, src, className, size = "md" }) {
  const display = name || profile?.display_name || user?.full_name || "member";
  const avatar = src || profile?.avatar_url || user?.avatar_url;
  const sz = { sm: "h-7 w-7 text-[0.6rem]", md: "h-9 w-9 text-[0.7rem]", lg: "h-14 w-14 text-base", xl: "h-20 w-20 text-lg" }[size];
  return (
    <Avatar className={cn("rounded-md border border-border", sz, className)}>
      {avatar ? <AvatarImage src={avatar} alt={display} /> : null}
      <AvatarFallback className="rounded-md bg-accent/40 text-primary font-semibold lowercase">{initials(display)}</AvatarFallback>
    </Avatar>
  );
}
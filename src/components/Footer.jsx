import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import BrandMark from "@/components/BrandMark";

const LINKS = [
  ["feed", "/"], ["challenges", "/challenges"], ["leaderboard", "/leaderboard"],
  ["impact", "/impact"], ["shop", "/shop"], ["about", "/about"], ["changelog", "/changelog"]
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-editorial px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <BrandMark />
            <p className="mt-3 text-[0.82rem] leading-relaxed text-muted-foreground">
              record real recycling. earn XP. take on challenges. build community momentum.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {LINKS.map(([label, href]) => (
              <Link key={href} to={href} className="text-[0.82rem] lowercase text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-border pt-5">
          <p className="text-[0.72rem] text-muted-foreground">© {new Date().getFullYear()} greenergyX — a community recycling project.</p>
          <p className="text-[0.72rem] text-muted-foreground">every number comes from a real record. nothing invented.</p>
        </div>
      </div>
    </footer>
  );
}
import { Link } from "react-router-dom";
import { Recycle, Users, Target, BarChart3, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

const COMMUNITY_IMAGE = "https://media.base44.com/images/public/6ab28d95c80fc3641aee9d2d/76b5be542_generated_image.png";

const PILLARS = [
  { icon: Recycle, title: "record real recycling", body: "log what you recycled — material, amount, date. every record is real and dated. nothing estimated." },
  { icon: BarChart3, title: "track your progress", body: "earn XP, advance through tiers and watch your personal totals grow from actual records." },
  { icon: Target, title: "take on challenges", body: "join small measurable targets. progress derives from eligible records, not a button press." },
  { icon: Users, title: "see community impact", body: "public actions add to a transparent community total. encourage others through action, not slogans." }
];

export default function About() {
  return (
    <div>
      <section className="mx-auto max-w-editorial px-6 pt-12 md:pt-20 pb-10">
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-card px-3 py-1 text-[0.7rem] lowercase text-muted-foreground"><Leaf className="h-3 w-3 text-primary" /> about</span>
        <h1 className="mt-6 editorial-title text-foreground max-w-3xl" style={{ fontSize: "clamp(2.25rem,5vw,4rem)" }}>what is greenergyX?</h1>
        <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-foreground/85">
          greenergyX is a community platform that makes environmental participation measurable, visible and social. it started as a small Wix-based recycling site, and has grown into a fuller platform for recording real action.
        </p>
      </section>

      <section className="mx-auto max-w-editorial px-6 py-12 border-t border-border">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((p) => (
            <div key={p.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-card text-primary"><p.icon className="h-5 w-5" strokeWidth={1.8} /></span>
              <h2 className="mt-4 font-heading text-[1.05rem] font-semibold lowercase text-foreground">{p.title}</h2>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-editorial px-6 py-10">
        <div className="overflow-hidden rounded-md border border-border shadow-hard"><Image src={COMMUNITY_IMAGE} alt="community sorting recyclables" className="h-[260px] md:h-[420px] w-full" fittingType="fill" /></div>
      </section>

      <section className="mx-auto max-w-editorial px-6 py-12">
        <div className="rounded-md border border-border bg-surface-card p-8 md:p-12 text-center shadow-hard-sm">
          <h2 className="font-display text-3xl md:text-4xl lowercase text-foreground">participation, measured.</h2>
          <p className="mt-3 text-[0.95rem] text-muted-foreground max-w-md mx-auto">greenergyX doesn't recycle materials itself — it records and encourages the people who do.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="press bg-primary text-primary-foreground shadow-hard-sm"><Link to="/register">join greenergyX</Link></Button>
            <Button asChild variant="outline" className="shadow-none border-border"><Link to="/changelog">view changelog <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
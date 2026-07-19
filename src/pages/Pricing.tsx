import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidNavbar } from "@/components/layout/LiquidNavbar";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Home", href: "/home", isRouterLink: true },
  { name: "About", href: "/about", isRouterLink: true },
  { name: "Demo", href: "/demo", isRouterLink: true },
  { name: "Pricing", href: "/pricing", isRouterLink: true },
  { name: "Social Proof", href: "/social-proof", isRouterLink: true },
];

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    desc: "For curious minds exploring adaptive routines.",
    features: [
      "Adaptive daily plan",
      "Voice capture · 50 / day",
      "GTD inbox",
      "Single device",
    ],
    cta: "Start free",
    highlight: false,
    tag: "01",
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    desc: "For people who actually live a calendar.",
    features: [
      "Everything in Starter",
      "Unlimited voice & re-plans",
      "Cognitive-state scheduling",
      "Cross-device sync",
      "Calendar + Notion integrations",
    ],
    cta: "Go Pro",
    highlight: true,
    tag: "02",
  },
  {
    name: "Studio",
    price: "$32",
    period: "per month",
    desc: "For teams negotiating reality together.",
    features: [
      "Everything in Pro",
      "Shared adaptive workflows",
      "Team analytics & retros",
      "Priority support",
      "Custom methodology layer",
    ],
    cta: "Talk to us",
    highlight: false,
    tag: "03",
  },
];

const compare: Array<{
  label: string;
  starter: string | boolean;
  pro: string | boolean;
  studio: string | boolean;
}> = [
  { label: "Adaptive scheduling", starter: true, pro: true, studio: true },
  { label: "Voice capture", starter: "50 / day", pro: "Unlimited", studio: "Unlimited" },
  { label: "Cognitive-state planning", starter: false, pro: true, studio: true },
  { label: "Cross-device sync", starter: false, pro: true, studio: true },
  { label: "Integrations", starter: "1", pro: "10+", studio: "Custom" },
  { label: "Team workspaces", starter: false, pro: false, studio: true },
  { label: "Priority support", starter: false, pro: false, studio: true },
  { label: "Custom methodology layer", starter: false, pro: false, studio: true },
];

const Cell = ({ v }: { v: string | boolean }) => {
  if (v === true) return <Check className="size-4 text-foreground mx-auto" />;
  if (v === false) return <Minus className="size-4 text-muted-foreground/40 mx-auto" />;
  return <span className="text-sm text-foreground">{v}</span>;
};

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LiquidNavbar items={menuItems} />

      {/* HERO + TIERS with bleeding oversized title */}
      <section className="relative pt-[140px] md:pt-[180px] pb-24 md:pb-32 px-6">
        <div className="armory-container relative">
          {/* Billing toggle */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setYearly(!yearly)}
              className={cn(
                "relative h-6 w-11 rounded-full border border-[#373737] transition-colors",
                yearly ? "bg-[#262626]" : "bg-[#171717]"
              )}
              aria-label="Toggle billing period"
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                  yearly ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className="text-sm text-muted-foreground">Billed {yearly ? 'Yearly' : 'Monthly'}</span>
          </div>

          {/* Oversized bleeding title */}
          <h1
            aria-label="Pricing"
            className="pointer-events-none select-none font-medium tracking-[-0.05em] text-foreground leading-[0.85] text-center"
            style={{ fontSize: 'clamp(6rem, 18vw, 16rem)' }}
          >
            Pricing
          </h1>

          {/* Cards overlapping the title */}
          <div className="relative -mt-[6vw] md:-mt-[8vw] grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative flex flex-col p-8 md:p-10 min-h-[560px]",
                  "bg-[#0A0A0A] border border-[#373737]",
                  "rounded-[24px]",
                  "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]",
                  t.highlight && "ring-1 ring-[#525252]"
                )}
              >
                <span className="text-xs text-muted-foreground mb-6">{t.name} Plan</span>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white">
                    {t.price}
                  </span>
                  {t.price !== 'Free' && (
                    <span className="text-xl text-muted-foreground font-medium">/m</span>
                  )}
                </div>

                <div className="h-px bg-[#373737] mb-6" />

                <ul className="space-y-4 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-[#262626] flex items-center justify-center">
                        <Check className="size-3 text-white" strokeWidth={2.5} />
                      </span>
                      <span className="text-muted-foreground leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-10 rounded-full h-12 text-sm bg-white text-black hover:bg-white/90 font-medium"
                >
                  <Link to="/auth">Get Started</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* COMPARE */}
      <section className="armory-section">
        <div className="armory-container">
          <div className="mb-14">
            <p className="eyebrow mb-6">Compare</p>
            <h2 className="display-lg max-w-3xl">
              Every feature, side by side.
            </h2>
          </div>

          <div className="armory-card overflow-hidden">
            <div className="grid grid-cols-4 border-b border-border/60">
              <div className="px-6 py-5 eyebrow !mb-0">Feature</div>
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={cn(
                    "px-6 py-5 text-center border-l border-border/60 text-sm font-medium tracking-tight",
                    t.highlight && "text-foreground"
                  )}
                >
                  {t.name}
                </div>
              ))}
            </div>
            {compare.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-4 border-b border-border/30 last:border-0",
                  i % 2 === 1 && "bg-foreground/[0.015]"
                )}
              >
                <div className="px-6 py-5 text-sm text-foreground/90">{row.label}</div>
                <div className="px-6 py-5 border-l border-border/60 text-center">
                  <Cell v={row.starter} />
                </div>
                <div className="px-6 py-5 border-l border-border/60 text-center">
                  <Cell v={row.pro} />
                </div>
                <div className="px-6 py-5 border-l border-border/60 text-center">
                  <Cell v={row.studio} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="armory-section">
        <div className="armory-container">
          <div className="armory-card relative p-10 md:p-20 text-center overflow-hidden">
            <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 size-[520px] rounded-full bg-white/[0.03] blur-3xl" />
            <p className="eyebrow mb-8 justify-center">Get Started</p>
            <h2 className="display-lg max-w-2xl mx-auto">
              Stop planning. <span className="text-muted-foreground">Start adapting.</span>
            </h2>
            <div className="relative mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="rounded-lg px-8 h-12 text-base">
                <Link to="/auth">
                  Try SERA free <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Link to="/demo" className="btn-ghost-outline justify-center">
                <span className="icon-box"><ArrowRight className="size-3.5" /></span>
                <span>Watch demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} SERA
          </p>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            v0.1.0-alpha · Pricing
          </p>
        </div>
      </footer>
    </main>
  );
}

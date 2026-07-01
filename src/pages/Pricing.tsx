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
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LiquidNavbar items={menuItems} />

      {/* HERO */}
      <section className="relative pt-[130px] md:pt-[180px] pb-16 md:pb-24 px-6">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [background:radial-gradient(120%_120%_at_50%_0%,hsl(0_0%_10%)_0%,transparent_55%)]"
        />
        <div className="armory-container">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-8">
              <p className="eyebrow mb-6">Pricing · 2026</p>
              <h1 className="display-xl">
                Pay for adaptation. <br />
                <span className="text-muted-foreground">Not another planner.</span>
              </h1>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9 flex md:items-end">
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm">
                Three tiers. Zero lock-in. Cancel any time — your data always stays yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="armory-container grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "armory-card relative p-8 md:p-10 flex flex-col min-h-[560px]",
                t.highlight && "border-foreground/40"
              )}
            >
              {t.highlight && (
                <div aria-hidden className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-foreground/60 to-transparent" />
              )}
              <div className="flex items-start justify-between mb-10">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground/70 tracking-widest">
                    //{t.tag}
                  </span>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight">{t.name}</h3>
                </div>
                {t.highlight && (
                  <span className="rounded-full border border-foreground/30 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]">
                    Recommended
                  </span>
                )}
              </div>

              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-6xl font-medium tracking-[-0.045em]">{t.price}</span>
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground/80">
                {t.period}
              </p>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>

              <div className="my-8 h-px bg-border/60" />

              <ul className="space-y-4 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="size-4 text-foreground shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  "mt-10 rounded-lg h-12 text-base",
                  !t.highlight && "bg-foreground/10 text-foreground hover:bg-foreground/20"
                )}
                variant={t.highlight ? "default" : "secondary"}
              >
                <Link to="/auth">
                  {t.cta} <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
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

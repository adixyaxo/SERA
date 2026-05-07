import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidNavbar } from "@/components/layout/LiquidNavbar";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Home", href: "/", isRouterLink: true },
  { name: "About", href: "/about", isRouterLink: true },
  { name: "Demo", href: "/demo", isRouterLink: true },
  { name: "Pricing", href: "/pricing", isRouterLink: true },
  { name: "Social Proof", href: "/social-proof", isRouterLink: true },
];

const tiers = [
  {
    name: "Starter",
    price: "Free",
    desc: "For curious minds exploring adaptive routines.",
    features: ["Adaptive daily plan", "Voice capture (50/day)", "GTD inbox", "Single device"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
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
  },
  {
    name: "Studio",
    price: "$32",
    period: "/mo",
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
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LiquidNavbar items={menuItems} />

      <section className="relative pt-[110px] sm:pt-[140px] pb-12 sm:pb-24 px-4 sm:px-6">
        <div aria-hidden className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_0%,hsl(var(--accent)/0.08)_0%,transparent_60%)]" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-5">Pricing</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05]">
            Pay for adaptation. <br />
            <span className="text-muted-foreground">Not another planner.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Three tiers. Zero lock-in. Cancel any time — your data stays yours.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={cn(
                "relative rounded-2xl border p-6 sm:p-8 flex flex-col",
                t.highlight
                  ? "bg-card/80 border-accent/40 shadow-2xl shadow-accent/10"
                  : "bg-card/40 border-border/50 backdrop-blur-sm"
              )}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-foreground">
                  Most adaptive
                </div>
              )}
              <h3 className="text-lg font-medium tracking-tight">{t.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-[-0.04em]">{t.price}</span>
                {t.period && <span className="text-muted-foreground text-sm">{t.period}</span>}
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>

              <div className="my-6 h-px bg-border/60" />

              <ul className="space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="size-4 text-accent shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="mt-8 rounded-lg" variant={t.highlight ? "default" : "outline"}>
                <Link to="/auth">
                  {t.cta} <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-muted-foreground">
          Need something custom?{" "}
          <Link to="/auth" className="text-foreground underline underline-offset-4 hover:text-accent">
            Get in touch
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Calendar, Brain, Workflow, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LiquidNavbar } from "@/components/layout/LiquidNavbar";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Home", href: "/", isRouterLink: true },
  { name: "About", href: "/about", isRouterLink: true },
  { name: "Pricing", href: "/pricing", isRouterLink: true },
  { name: "Social Proof", href: "/social-proof", isRouterLink: true },
];

const demos = [
  {
    icon: Mic,
    title: "Voice capture",
    sub: "Say it. It's scheduled.",
    body: 'You say "remind me to call Maya at 4 about the launch" — SERA parses it, schedules it, sets context.',
  },
  {
    icon: Brain,
    title: "Cognitive scheduling",
    sub: "Match work to your state.",
    body: "Deep work moves to your peak window. Admin slides to low-energy slots. Meetings fit the gaps.",
  },
  {
    icon: Workflow,
    title: "Live re-planning",
    sub: "Reality intrudes. SERA adapts.",
    body: "A meeting runs over — SERA shuffles your day in seconds, preserving deadlines and energy budget.",
  },
  {
    icon: Calendar,
    title: "Continuity engine",
    sub: "One disruption ≠ ruined day.",
    body: "Skipped a block? It re-enters tomorrow with smarter context, not as accumulated guilt.",
  },
];

function VoiceWaveform() {
  return (
    <div className="flex items-end gap-1 h-12">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-accent"
          animate={{ height: ["20%", "100%", "30%", "70%", "25%"] }}
          transition={{ duration: 1.2 + (i % 3) * 0.2, repeat: Infinity, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

function ScheduleAnim() {
  return (
    <div className="space-y-2">
      {["09:00 — Deep work", "11:30 — Inbox", "14:00 — Strategy call", "16:00 — Review"].map((row, i) => (
        <motion.div
          key={row}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.15, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          className="rounded-md bg-card/80 border border-border/50 px-3 py-2 text-xs font-mono"
        >
          {row}
        </motion.div>
      ))}
    </div>
  );
}

function ReplanAnim() {
  return (
    <div className="relative h-24">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-6 rounded-md bg-accent/20 border border-accent/40"
          animate={{ y: [i * 28, i * 28 + 14, i * 28] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}

function ContinuityAnim() {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 h-12 rounded-md bg-card/80 border border-border/50"
          animate={{ backgroundColor: ["hsl(var(--card))", "hsl(var(--accent) / 0.3)", "hsl(var(--card))"] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

const visuals = [<VoiceWaveform />, <ScheduleAnim />, <ReplanAnim />, <ContinuityAnim />];

export default function Demo() {
  const [active, setActive] = useState(0);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LiquidNavbar items={menuItems} />

      <section className="relative pt-[140px] pb-16 px-6">
        <div aria-hidden className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_0%,hsl(var(--accent)/0.08)_0%,transparent_60%)]" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-5">Demo</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05]">
            See SERA <span className="text-muted-foreground">negotiate reality.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Four micro-demos. Each shows one capability. No fluff.
          </p>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            {demos.map((d, i) => (
              <button
                key={d.title}
                onClick={() => setActive(i)}
                className={cn(
                  "w-full text-left rounded-xl border p-5 transition-all duration-300 group",
                  active === i
                    ? "bg-card/80 border-accent/40 shadow-xl"
                    : "bg-card/30 border-border/40 hover:bg-card/60"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-lg p-2 transition-colors", active === i ? "bg-accent/20" : "bg-muted/40")}>
                    <d.icon className="size-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-base font-medium tracking-tight">{d.title}</h3>
                      <span className="text-[10px] font-mono text-muted-foreground">0{i + 1}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.sub}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-32 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 md:p-10 min-h-[400px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col"
                >
                  <p className="text-xs font-mono text-muted-foreground mb-2">DEMO {String(active + 1).padStart(2, "0")}</p>
                  <h2 className="text-2xl md:text-3xl font-medium tracking-tight">{demos[active].title}</h2>
                  <p className="mt-3 text-muted-foreground max-w-md">{demos[active].body}</p>
                  <div className="mt-8 flex-1 flex items-center justify-center rounded-xl bg-background/40 border border-border/30 p-8">
                    {visuals[active]}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Live preview · Loops automatically</p>
                <Button asChild size="sm">
                  <Link to="/auth">Try it yourself <ArrowRight className="ml-1 size-3" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

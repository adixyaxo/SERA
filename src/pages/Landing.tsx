import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Menu, X, Brain, Mic, Workflow, RefreshCw, Zap, Target, Sparkles, ChevronRight } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { SeraLogo } from "@/components/ui/sera-logo";
import { LiquidNavbar } from "@/components/layout/LiquidNavbar";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { RevealText } from "@/components/ui/reveal-text";

import HoverRevealCards from "@/components/ui/cards";
import Section from "@/components/ui/section";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { CinematicIntro } from "@/components/landing/CinematicIntro";
import BentoCard from "@/components/ui/bento-card";


const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring" as const, bounce: 0.3, duration: 1.5 },
    },
  },
};

const menuItems = [
  { name: "Home", href: "/home", isRouterLink: true },
  { name: "About", href: "/about", isRouterLink: true },
  { name: "Demo", href: "/demo", isRouterLink: true },
  { name: "Pricing", href: "/pricing", isRouterLink: true },
  { name: "Social Proof", href: "/social-proof", isRouterLink: true },
];

const FeatureCard: React.FC<{ icon?: React.ElementType; title: string; desc: string; className?: string }> = ({ icon: Icon, title, desc, className }) => (
  <div className={cn(
    "relative rounded-2xl border border-border bg-card p-8 transition-all duration-500 group overflow-hidden",
    "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_60px_-30px_rgba(0,0,0,0.6)]",
    "hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_hsl(var(--accent)/0.18)]",
    className
  )}>
    <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div aria-hidden className="absolute -top-20 -right-20 size-40 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative">
      <div className="rounded-xl bg-accent/10 p-3 w-fit mb-5 ring-1 ring-accent/20 group-hover:bg-accent/20 group-hover:ring-accent/40 transition-all">
        {Icon && <Icon className="size-5 text-accent" />}
      </div>
      <h3 className="text-h3 text-foreground mb-3 tracking-tight">{title}</h3>
      <p className="text-body text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </div>
);


const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
  const yVideo = useTransform(scrollY, [0, 1000], [0, 100]);
  const phoneVideoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [introDone, setIntroDone] = useState(prefersReduced);


  return (
    <main className="overflow-x-hidden bg-background text-foreground">
      <CinematicIntro phoneVideoRef={phoneVideoRef} onComplete={() => setIntroDone(true)} />
      <LiquidNavbar items={menuItems} />

      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100svh-80px)] sm:min-h-[calc(100vh-100px)] mt-[80px] sm:mt-[100px] flex flex-col justify-center pb-12 sm:pb-24 overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></motion.div>
        <div
          className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 grid grid-cols-12 gap-6 sm:gap-8 items-center transition-opacity duration-700"
          style={{ opacity: introDone ? 1 : 0 }}
        >
          <div className="col-span-12 lg:col-span-7 text-center lg:text-left">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
                  },
                },
                ...transitionVariants,
              }}
            >
              <Link
                to="/auth"
                className="hover:bg-background dark:hover:border-t-border bg-muted group flex w-fit items-center gap-4 rounded-lg border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950 mx-auto lg:mx-0"
              >
                <span className="text-foreground text-sm">Adaptive Routine OS — Now in Beta</span>
                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-lg duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </Link>

              <div className="mt-8">
                <div className="w-full overflow-hidden">
                  <RevealText
                    text="ADAPT"
                    textColor="text-foreground/60"
                    overlayColor="text-primary"
                    fontSize="text-[clamp(1.8rem,6.6vw,5.6rem)] font-black tracking-[-0.11em] leading-[0.85] whitespace-nowrap"
                    letterDelay={0.05}
                    className="flex-nowrap justify-center lg:justify-start -ml-1 [&>div]:gap-x-0 [&>div]:flex-nowrap [&_span]:!leading-[0.85] [&_span]:whitespace-nowrap"
                  />
                </div>
                <h1 className="mt-3 text-h1 font-black leading-[0.95] text-foreground tracking-[-0.04em]">
                  Routine OS for modern workflows
                </h1>
              </div>

              <p className="mt-8 text-body text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Highly customizable adaptive schedules for building modern workflows that look and feel the way you mean it.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Button asChild size="lg" className="rounded-lg px-6 text-base h-[46px]">
                  <Link to="/auth">
                    <span className="text-nowrap">Start Building</span>
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-[46px] rounded-lg px-6 text-base">
                  <Link to="/home#problem">
                    <span className="text-nowrap">See how it works</span>
                  </Link>
                </Button>
              </div>
            </AnimatedGroup>
          </div>

          <div className="col-span-12 lg:col-span-5 w-full max-w-xl mx-auto lg:mx-0 flex justify-center">
            <PhoneMockup videoRef={phoneVideoRef} videoSrc="/hero-video.mp4" />
          </div>
        </div>
      </section>

      {/* CUSTOMERS SLIDER */}
      <motion.div 
        className="bg-background pb-16 md:pb-24 border-b border-border/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="group relative m-auto max-w-6xl px-6">
          <div className="flex flex-col items-center md:flex-row gap-8 md:gap-0">
            <div className="md:max-w-48 md:border-r border-border md:pr-8 text-center md:text-right shrink-0">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">The Real Enemy</p>
            </div>
            <div className="relative py-6 w-full md:w-[calc(100%-12rem)] md:pl-8">
              <InfiniteSlider speedOnHover={20} speed={40} gap={48}>
                {[
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=70&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=70&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=70&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=70&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=70&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&q=70&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&q=70&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&q=70&auto=format&fit=crop",
                ].map((src, i) => (
                  <div key={i} className="flex">
                    <img
                      className="h-14 w-24 md:h-16 md:w-32 object-cover rounded-md opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                      src={src}
                      alt={`Showcase ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}

              </InfiniteSlider>

              <div className="bg-gradient-to-r from-background absolute inset-y-0 left-0 w-20 z-10 pointer-events-none md:left-8"></div>
              <div className="bg-gradient-to-l from-background absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============ SERVICES / WHAT SERA DOES ============ */}
      <section className="armory-section">
        <div className="armory-container">
          <div className="grid grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24">
            <div className="col-span-12 md:col-span-5">
              <p className="eyebrow mb-6">Services</p>
              <h2 className="display-lg">
                Integrate with the world's most adaptive routine engine.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7 flex items-end">
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
                Seamlessly connect your calendar, tasks and rituals to a system that observes,
                predicts, and reschedules in real time — built for the way modern work actually happens.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { t: "Adaptive Engine", d: "Reconfigures your day against energy, priority shifts, and real-world delays — automatically.", n: "01" },
              { t: "Voice Capture", d: "Speak intent. SERA classifies, slots, and schedules with sub-second latency across surfaces.", n: "02" },
              { t: "Continuity Loop", d: "One disruption doesn't ruin the day. Missed blocks are re-negotiated, never lost.", n: "03" },
              { t: "Method-Aware", d: "An execution layer over GTD, Atomic Habits, and Pomodoro — bring your framework, keep your flow.", n: "04" },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="armory-card p-7 md:p-8 min-h-[280px] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="size-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                    <Zap className="size-4 text-foreground" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/60 tracking-widest">{f.n}</span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium tracking-tight mb-3">{f.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATISTICS ============ */}
      <section className="armory-section">
        <div className="armory-container">
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 md:col-span-8">
              <p className="eyebrow mb-6">Statistics</p>
              <h2 className="display-lg text-muted-foreground">
                <span className="text-foreground">Quantifiable impact</span> across every day you use it. We measure success by the friction we remove.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-3 md:col-start-10 flex md:items-end md:justify-end">
              <Link to="/about" className="btn-ghost-outline">
                <span className="icon-box"><ArrowRight className="size-3.5" /></span>
                <span>View research</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { v: "87%", l: "of missed blocks auto-recovered within the same day." },
              { v: "3.4x", l: "faster capture-to-scheduled compared to typing." },
              { v: "99.9%", l: "sync uptime across calendar and task integrations." },
            ].map((s, i) => (
              <motion.div
                key={s.v}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="armory-card p-8 md:p-10"
              >
                <div className="text-5xl md:text-6xl font-medium tracking-[-0.04em] text-foreground tabular-nums mb-4">
                  {s.v}
                </div>
                <div className="h-px bg-border/60 my-5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CASE STUDIES / MEET SERA ============ */}
      <section className="armory-section">
        <div className="armory-container">
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 md:col-span-6">
              <p className="eyebrow mb-6">The Product</p>
              <h2 className="display-lg">
                Meet SERA — <br />
                <span className="text-muted-foreground">your adaptive routine system.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-5 md:col-start-8 flex md:items-end">
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Not another planner. A system that thinks, adjusts, and reacts with you — designed
                for lives that don't fit inside a static grid.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
                tag: "Dynamic Adaptation",
                title: "Reality-aware scheduling",
                copy: "SERA reads context — energy, interruptions, priority drift — and reshuffles automatically.",
              },
              {
                img: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1200&auto=format&fit=crop",
                tag: "Voice First",
                title: "Speak your day into place",
                copy: "Sub-second capture. Every phrase becomes a scheduled, classified, actionable block.",
              },
              {
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
                tag: "Continuity",
                title: "Disruption-proof by design",
                copy: "A missed hour reshapes the week — instead of collapsing the day.",
              },
            ].map((c, i) => (
              <motion.article
                key={c.tag}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="armory-card overflow-hidden group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-7">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/80 mb-3">
                    //2026 · {c.tag}
                  </p>
                  <h3 className="text-xl font-medium tracking-tight mb-3">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.copy}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EXPECTATION VS REALITY ============ */}
      <section className="armory-section">
        <div className="armory-container">
          <div className="mb-16">
            <p className="eyebrow mb-6">Reframe</p>
            <h2 className="display-lg max-w-3xl">
              Stop managing time. <span className="text-muted-foreground">Start managing reality.</span>
            </h2>
          </div>

          <div className="armory-card overflow-hidden">
            <div className="grid grid-cols-2 border-b border-border/60">
              <div className="px-6 md:px-8 py-5 eyebrow !mb-0">Expectation</div>
              <div className="px-6 md:px-8 py-5 eyebrow !mb-0 border-l border-border/60">Reality</div>
            </div>
            {[
              ["I'll follow my schedule", "You don't."],
              ["I'll catch up later", "You don't."],
              ["Tomorrow will be better", "It repeats."],
            ].map(([e, r], i) => (
              <div key={i} className="grid grid-cols-2 border-b border-border/30 last:border-0">
                <div className="px-6 md:px-8 py-7 md:py-8 text-lg md:text-xl">{e}</div>
                <div className="px-6 md:px-8 py-7 md:py-8 border-l border-border/60 text-lg md:text-xl text-muted-foreground">
                  {r}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-lg md:text-xl text-muted-foreground">
            Until your system adapts — <span className="text-foreground">nothing changes.</span>
          </p>
        </div>
      </section>

      {/* ============ TECH EDGE ============ */}
      <section className="armory-section">
        <div className="armory-container grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow mb-6">Under the Hood</p>
            <h2 className="display-lg">Research-backed intelligence.</h2>
            <p className="mt-8 text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
              SERA is built on adaptive scheduling, behavioral feedback loops, and
              cognitive-state-aware planning — not gimmicks.
            </p>
            <Link to="/about" className="btn-ghost-outline mt-10">
              <span className="icon-box"><ArrowRight className="size-3.5" /></span>
              <span>Read the paper</span>
            </Link>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 grid gap-3">
            {[
              { k: "01", t: "Adaptive scheduling algorithms" },
              { k: "02", t: "Behavioral feedback loops" },
              { k: "03", t: "Cognitive-state-aware planning" },
              { k: "04", t: "Mixed-initiative AI collaboration" },
            ].map((l) => (
              <div
                key={l.k}
                className="armory-card px-6 py-5 flex items-center gap-5"
              >
                <span className="text-[10px] font-mono text-muted-foreground/70 tracking-widest">{l.k}</span>
                <span className="text-base">{l.t}</span>
                <ArrowRight className="size-4 text-muted-foreground/50 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="armory-section">
        <div className="armory-container">
          <div className="armory-card relative p-10 md:p-20 text-center overflow-hidden">
            <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 size-[520px] rounded-full bg-white/[0.03] blur-3xl" />
            <p className="eyebrow mb-8 justify-center">Start</p>
            <h2 className="display-lg max-w-2xl mx-auto">
              Fix your system. <span className="text-muted-foreground">Fix your day.</span>
            </h2>
            <p className="relative mt-8 text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              Plans fail. Systems adapt. Life interrupts. SERA recalculates.
            </p>
            <div className="relative mt-12 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-lg px-8 h-12 text-base" onClick={() => navigate("/auth")}>
                Start adapting <ArrowRight className="ml-2 size-4" />
              </Button>
              <Link to="/pricing" className="btn-ghost-outline justify-center">
                <span className="icon-box"><ArrowRight className="size-3.5" /></span>
                <span>See pricing</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <SeraLogo size="sm" />
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} SERA — Adaptive Routine System
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;


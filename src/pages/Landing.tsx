import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  { name: "Home", href: "/", isRouterLink: true },
  { name: "About", href: "/about", isRouterLink: true },
  { name: "Demo", href: "/demo", isRouterLink: true },
  { name: "Pricing", href: "/pricing", isRouterLink: true },
  { name: "Social Proof", href: "/social-proof", isRouterLink: true },
];

const FeatureCard: React.FC<{ icon?: React.ElementType; title: string; desc: string; className?: string }> = ({ icon: Icon, title, desc, className }) => (
  <div className={cn(
    "relative rounded-2xl border border-border/40 p-8 transition-all duration-500 group overflow-hidden",
    "bg-gradient-to-br from-card/90 via-card/60 to-card/30 backdrop-blur-xl",
    "hover:border-accent/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_hsl(var(--accent)/0.25)]",
    className
  )}>
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
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
  const yVideo = useTransform(scrollY, [0, 1000], [0, 100]);

  return (
    <main className="overflow-x-hidden bg-background text-foreground">
      <LiquidNavbar items={menuItems} />

      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-100px)] mt-[100px] flex flex-col justify-center pb-24 overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></motion.div>
        <div className="mx-auto max-w-6xl px-6 relative z-10 grid grid-cols-12 gap-8 items-center">
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

          <div className="col-span-12 lg:col-span-5 w-full max-w-xl mx-auto lg:mx-0">
            <AnimatedGroup
              variants={{
                container: { visible: { transition: { delayChildren: 0.6 } } },
                item: transitionVariants.item,
              }}
            >
              <div className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-lg border border-border/40 shadow-2xl dark:border-white/5">
                <ZoomParallax
                  images={[
                    { src: "/hero-video.mp4", alt: "Workflow", video: true },
                    { src: "/hero-video.mp4", alt: "Workflow", video: true },
                    { src: "/hero-video.mp4", alt: "Workflow", video: true },
                  ]}
                />
              </div>
            </AnimatedGroup>
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
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&q=80&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&q=80&auto=format&fit=crop",
                ].map((src, i) => (
                  <div key={i} className="flex">
                    <img
                      className="h-14 w-24 md:h-16 md:w-32 object-cover rounded-md opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                      src={src}
                      alt={`Showcase ${i + 1}`}
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

      {/* PROBLEM */}
      <Section id="problem">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">The Real Enemy</p>
          <h2 className="text-h2 font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
            The system you trust is quietly failing you.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { t: "Static schedules ≠ real life", d: "The day you planned never matches the day you live." },
            { t: "To-do lists don't adapt — they accumulate", d: "Each unfinished task becomes tomorrow's burden." },
            { t: "Apps track tasks, not reality", d: "They measure intent, not what actually happened." },
            { t: "You plan for ideal days, not actual days", d: "Energy, context, and interruptions are never accounted for." },
          ].map((item, i) => (
            <FeatureCard key={i} title={item.t} desc={item.d} />
          ))}
        </div>

        <p className="mt-16 text-center text-lg md:text-xl font-semibold tracking-tight">
          Your life is dynamic. <span className="text-muted-foreground">Your system is not.</span>
        </p>
      </Section>

      {/* REFRAME */}
      <Section className="border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Reframe</p>
          <h2 className="text-h2 font-bold tracking-tight text-foreground leading-tight">
            Stop managing time. <br />
            <span className="text-muted-foreground">Start managing reality.</span>
          </h2>
          <p className="mt-8 text-body text-muted-foreground">
            Productivity isn't about managing hours. It's about aligning tasks with what's actually happening.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, label: "Energy", desc: "Match work to your cognitive state." },
            { icon: Target, label: "Context", desc: "Where you are shapes what you can do." },
            { icon: RefreshCw, label: "Interruptions", desc: "Reality intrudes — your system should absorb it." },
          ].map((c, i) => (
            <FeatureCard key={i} icon={c.icon} title={c.label} desc={c.desc} />
          ))}
        </div>
      </Section>

      {/* SOLUTION */}
      <Section id="solution" className="border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-lg px-4 py-1.5 mb-6">
            <Sparkles className="size-3.5 text-accent" />
            <span className="text-xs">Introducing</span>
          </div>
          <h2 className="text-h2 font-bold tracking-tight text-foreground leading-tight">
            Meet SERA — <br />
            <span className="gradient-text">your adaptive routine system.</span>
          </h2>
          <p className="mt-8 text-body text-muted-foreground">
            Not another planner. A system that thinks, adjusts, and reacts with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Brain, title: "Dynamic Adaptation", desc: "Late? SERA reschedules your day instantly.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" },
            { icon: Mic, title: "Voice-first Control", desc: "Say it. It's handled.", image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=800&auto=format&fit=crop" },
            { icon: Workflow, title: "Method-aware", desc: "GTD, Pomodoro, time-blocking — SERA adapts to your brain.", image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=800&auto=format&fit=crop" },
            { icon: RefreshCw, title: "Continuity Engine", desc: "One disruption doesn't ruin your entire day anymore.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" },
          ].map((f, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border/40 overflow-hidden bg-gradient-to-br from-card/90 via-card/50 to-background hover:border-accent/30 hover:shadow-[0_20px_60px_-15px_hsl(var(--accent)/0.3)] transition-all duration-500"
            >
              <div className="relative h-[260px] overflow-hidden">
                <motion.img
                  alt={f.title}
                  src={f.image}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ scale: 1.05, x: 0 }}
                  whileHover={{ scale: 1.18, x: -20 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>
              <div className="p-7">
                <div className="rounded-xl bg-accent/10 p-3 w-fit mb-4 ring-1 ring-accent/20 group-hover:bg-accent/20 group-hover:ring-accent/40 transition-all">
                  <f.icon className="size-5 text-accent" />
                </div>
                <h3 className="text-h3 text-foreground mb-3 tracking-tight">{f.title}</h3>
                <p className="text-body text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* REALITY VS EXPECTATION */}
      <Section id="reality" className="border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Reality Check</p>
          <h2 className="text-h2 font-bold tracking-tight text-foreground">Expectation vs. Reality</h2>
        </div>

        <div className="rounded-lg border border-border/50 overflow-hidden">
          <div className="grid grid-cols-2 border-b border-border/50 text-sm uppercase tracking-wider text-muted-foreground">
            <div className="p-5">Expectation</div>
            <div className="p-5 border-l border-border/50">Reality</div>
          </div>
          {[
            ["I'll follow my schedule", "You don't."],
            ["I'll catch up later", "You don't."],
            ["Tomorrow will be better", "It repeats."],
          ].map(([e, r], i) => (
            <div key={i} className="grid grid-cols-2 border-b border-border/30 last:border-0">
              <div className="p-6 text-lg">{e}</div>
              <div className="p-6 border-l border-border/50 text-lg text-muted-foreground">{r}</div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-lg md:text-xl font-medium tracking-tight text-muted-foreground">
          Until your system adapts — <span className="text-foreground">nothing changes.</span>
        </p>
      </Section>

      {/* PSYCHO HOOK */}
      <Section className="relative border-t border-border/50 overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1920&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a1628]/85 via-[#050a14]/90 to-[#0c1830]/85 backdrop-blur-sm" />
        <div aria-hidden className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_30%_20%,hsl(217_91%_60%/0.18),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(220_70%_30%/0.28),transparent_55%)]" />
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-h2 font-bold tracking-tight text-foreground leading-tight">
            You're not inconsistent. <br />
            <span className="text-muted-foreground">Your system is.</span>
          </h2>
          <p className="mt-8 text-body text-muted-foreground">
            Consistency is engineered, not forced. Your brain isn't built for static schedules.
          </p>
        </div>
      </Section>

      {/* TECH EDGE */}
      <Section id="tech" className="border-t border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Under the Hood</p>
            <h2 className="text-h2 font-bold tracking-tight text-foreground leading-tight">
              Research-backed intelligence.
            </h2>
            <p className="mt-8 text-body text-muted-foreground leading-relaxed">
              SERA is built on adaptive scheduling, behavioral feedback loops, and cognitive-state-aware planning — not gimmicks.
            </p>
          </div>
          <div className="md:col-span-5 grid gap-4">
            {[
              "Adaptive scheduling algorithms",
              "Behavioral feedback loops",
              "Cognitive-state-aware planning",
            ].map((line, i) => (
              <div key={i} className="rounded-lg border border-border/50 bg-card/60 backdrop-blur-sm p-5 flex items-center gap-3 hover:bg-card/80 transition-all duration-300">
                <div className="size-2 rounded-full bg-accent shrink-0" />
                <span className="text-body">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* HOVER REVEAL CARDS */}
      <Section className="border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">See SERA in Action</p>
          <h2 className="text-h2 font-bold tracking-tight text-foreground leading-tight">
            Built for real life.
          </h2>
        </div>
        <HoverRevealCards
          items={[
            {
              id: 1,
              title: 'Dynamic Adaptation',
              subtitle: 'Smart Scheduling',
              imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
            },
            {
              id: 2,
              title: 'Voice Control',
              subtitle: 'Hands-Free',
              imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=800&auto=format&fit=crop',
            },
            {
              id: 3,
              title: 'Method Aware',
              subtitle: 'GTD, Pomodoro & More',
              imageUrl: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=800&auto=format&fit=crop',
            },
            {
              id: 4,
              title: 'Continuity Engine',
              subtitle: 'Disruption-Proof',
              imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
            },
          ]}
        />
      </Section>

      {/* FINAL CTA */}
      <Section className="border-t border-border/50">
        <div className="glass-strong rounded-2xl p-12 md:p-20 text-center relative overflow-hidden border border-border/50">
          <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 size-[400px] rounded-full bg-accent/10 blur-3xl" />
          <h2 className="relative text-h2 font-bold tracking-tight text-foreground">
            Fix your system. <span className="text-muted-foreground">Fix your day.</span>
          </h2>
          <p className="relative mt-8 text-body text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Plans fail. Systems adapt. Life interrupts. SERA recalculates.
          </p>
          <div className="relative mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-lg px-8 h-12 text-base" onClick={() => navigate("/auth")}>
              Stop Planning. Start Adapting.
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg px-8 h-12 text-base" onClick={() => navigate("/auth")}>
              Take Back Control
            </Button>
          </div>
        </div>
      </Section>

      <footer className="border-t border-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <SeraLogo size="sm" />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SERA — Adaptive Routine System</p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;

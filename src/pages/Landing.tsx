import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Menu, X, Brain, Mic, Workflow, RefreshCcw, Zap, Target, Sparkles, ChevronRight } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { SeraLogo } from "@/components/ui/sera-logo";
import { LiquidNavbar } from "@/components/layout/LiquidNavbar";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { RevealText } from "@/components/ui/reveal-text";
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
  { name: "Problem", href: "#problem" },
  { name: "Solution", href: "#solution" },
  { name: "Reality", href: "#reality" },
  { name: "Tech", href: "#tech" },
];

const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode; showBlur?: boolean }> = ({ id, className, children, showBlur = true }) => (
  <section id={id} className={cn("relative py-24 md:py-32 px-6", className)}>
    <div className="mx-auto max-w-6xl">{children}</div>
    {showBlur && <ProgressiveBlur position="bottom" backgroundColor="hsl(var(--background))" blurAmount="6px" className="h-24 bottom-0" />}
  </section>
);

/* Unified card variants */
const FeatureCard: React.FC<{ icon: React.ElementType; title: string; desc: string; className?: string }> = ({ icon: Icon, title, desc, className }) => (
  <div className={cn("rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-8 hover:bg-card/90 hover:shadow-lg transition-all duration-300 group", className)}>
    <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4 group-hover:bg-accent/20 transition-colors">
      <Icon className="size-6 text-accent" />
    </div>
    <h3 className="text-h3 text-foreground mb-3">{title}</h3>
    <p className="text-body text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const InfoCard: React.FC<{ title: string; desc: string; className?: string }> = ({ title, desc, className }) => (
  <div className={cn("rounded-lg border border-border/50 bg-card/60 backdrop-blur-sm p-6 hover:bg-card/80 transition-all duration-300", className)}>
    <h3 className="text-h3 text-foreground mb-3">{title}</h3>
    <p className="text-body text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
  const yVideo = useTransform(scrollY, [0, 1000], [0, 100]);

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className="fixed z-50 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled && "glass-strong max-w-5xl rounded-2xl lg:px-6"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link to="/landing" className="flex items-center space-x-2">
                <SeraLogo size="sm" />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                {menuState ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={cn(
                "bg-background/95 mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent",
                menuState && "block"
              )}
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
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
                  <Link to="/landing#problem">
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
              <motion.div style={{ y: yVideo }} className="aspect-[4/3] sm:aspect-video lg:aspect-[4/3] relative overflow-hidden rounded-lg border border-border/40 shadow-2xl dark:border-white/5">
                <motion.video
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="size-full object-cover opacity-80"
                  src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
                ></motion.video>
              </motion.div>
            </AnimatedGroup>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className, children }) => (
  <section id={id} className={cn("relative py-24 md:py-32 px-6", className)}>
    <div className="mx-auto max-w-6xl">{children}</div>
  </section>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <HeroHeader />

      {/* HERO */}
      <section className="relative pt-36 md:pt-44 pb-20 px-6">
        {/* Ambient gradient */}
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-40 right-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <AnimatedGroup variants={{ container: { visible: { transition: { staggerChildren: 0.1 } } }, item: transitionVariants.item }}>
            <Link
              to="/auth"
              className="hover:bg-secondary group mx-auto flex w-fit items-center gap-3 rounded-full border p-1 pl-4 text-xs transition-colors duration-300 glass"
            >
              <span className="text-foreground">Adaptive Routine OS — Now in Beta</span>
              <span className="block h-3 w-0.5 border-l bg-border"></span>
              <div className="bg-background size-6 overflow-hidden rounded-full duration-500 flex items-center justify-center">
                <ArrowRight className="size-3" />
              </div>
            </Link>

            <h1 className="mt-10 text-balance text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight leading-[1.05]">
              You don't have a time problem.
              <br />
              <span className="bg-gradient-to-r from-foreground via-foreground/70 to-foreground/40 bg-clip-text text-transparent">
                You have a control problem.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-balance text-lg md:text-xl text-muted-foreground">
              Your schedule isn't broken because you're lazy. It's broken because it can't adapt to reality.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full px-7" onClick={() => navigate("/auth")}>
                Take Back Control
                <ArrowRight className="ml-1 size-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-7" onClick={() => navigate("/auth")}>
                See SERA in Action
              </Button>
            </div>
          </div>
        </div>
      </section>

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

        <p className="mt-16 text-center text-h2 font-semibold tracking-tight">
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
            { icon: RefreshCcw, label: "Interruptions", desc: "Reality intrudes — your system should absorb it." },
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
            { icon: Brain, title: "Dynamic Adaptation", desc: "Late? SERA reschedules your day instantly.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2340&auto=format&fit=crop" },
            { icon: Mic, title: "Voice-first Control", desc: "Say it. It's handled.", image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2340&auto=format&fit=crop" },
            { icon: Workflow, title: "Method-aware", desc: "GTD, Pomodoro, time-blocking — SERA adapts to your brain.", image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=2340&auto=format&fit=crop" },
            { icon: RefreshCcw, title: "Continuity Engine", desc: "One disruption doesn't ruin your entire day anymore.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop" },
          ].map((f, i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative h-[200px] overflow-hidden">
                <img
                  width="100%"
                  height="100%"
                  alt={f.title}
                  className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  src={f.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
              </div>
              <div className="p-6">
                <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4">
                  <f.icon className="size-6 text-accent" />
                </div>
                <h3 className="text-h3 text-foreground mb-3">{f.title}</h3>
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

        <p className="mt-12 text-center text-h2 font-medium tracking-tight text-muted-foreground">
          Until your system adapts… <span className="text-foreground">nothing changes.</span>
        </p>
      </Section>

      {/* PSYCH HOOK */}
      <Section className="border-t border-border/50">
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
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SERA · Adaptive Routine System</p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Menu, X, Brain, Mic, Workflow, RefreshCw, Zap, Target, Sparkles, ChevronRight } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { SeraLogo } from "@/components/ui/sera-logo";
import { LiquidNavbar } from "@/components/layout/LiquidNavbar";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { RevealText } from "@/components/ui/reveal-text";
import { CardCurtainReveal, CardCurtainRevealBody, CardCurtainRevealTitle, CardCurtainRevealDescription, CardCurtainRevealFooter } from "@/components/ui/card-curtain-reveal";
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
  { name: "About", href: "/about", isRouterLink: true },
  { name: "Demo", href: "/demo", isRouterLink: true },
  { name: "Pricing", href: "/pricing", isRouterLink: true },
  { name: "Social Proof", href: "/social-proof", isRouterLink: true },
];

const FeatureCard: React.FC<{ icon?: React.ElementType; title: string; desc: string; className?: string }> = ({ icon: Icon, title, desc, className }) => (
  <div className={cn("rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-8 hover:bg-card/90 hover:shadow-lg transition-all duration-300 group", className)}>
    <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4 group-hover:bg-accent/20 transition-colors">
      {Icon && <Icon className="size-6 text-accent" />}
    </div>
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
    <main className="overflow-x-hidden bg-background text-foreground">
      <LiquidNavbar items={menuItems} />

      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-100px)] mt-[100px] flex flex-col justify-center pb-24 overflow-hidden">
        <ProgressiveBlur position="bottom" height="25%" />
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
                <RevealText
                  text="ADAPTIVE"
                  textColor="text-foreground/60"
                  overlayColor="text-primary"
                  fontSize="text-h1 tracking-tighter"
                  className="justify-center lg:justify-start -ml-2"
                />
                <h1 className="mt-2 text-h1 font-black leading-tight text-foreground">
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
                    {
                      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
                      alt: "Modern architecture"
                    },
                    {
                      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
                      alt: "Urban cityscape"
                    },
                    {
                      src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop",
                      alt: "Abstract pattern"
                    }
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
              <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                {["nvidia", "column", "github", "nike", "lemonsqueezy", "laravel", "lilly", "openai"].map((logo) => (
                  <div key={logo} className="flex">
                    <img
                      className="mx-auto h-5 w-fit dark:invert opacity-60 hover:opacity-100 transition-opacity"
                      src={`https://html.tailus.io/blocks/customers/${logo}.svg`}
                      alt={`${logo} Logo`}
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
            <CardCurtainReveal key={i} className="rounded-lg border border-border/50 overflow-hidden">
              <div className="relative h-[200px] overflow-hidden">
                <img
                  width="100%"
                  height="100%"
                  alt={f.title}
                  className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  src={f.image}
                />
              </div>
              <CardCurtainRevealBody className="p-6">
                <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4">
                  <f.icon className="size-6 text-accent" />
                </div>
                <CardCurtainRevealTitle className="text-h3 text-foreground mb-3">
                  {f.title}
                </CardCurtainRevealTitle>
                <CardCurtainRevealDescription className="text-body text-muted-foreground leading-relaxed">
                  {f.desc}
                </CardCurtainRevealDescription>
              </CardCurtainRevealBody>
              <CardCurtainRevealFooter />
            </CardCurtainReveal>
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
          Until your system adapts — <span className="text-foreground">nothing changes.</span>
        </p>
      </Section>

      {/* PSYCHO HOOK */}
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

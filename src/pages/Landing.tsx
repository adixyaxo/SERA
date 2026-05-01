import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X, Brain, Mic, Workflow, RefreshCcw, Zap, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { SeraLogo } from "@/components/ui/sera-logo";
import { cn } from "@/lib/utils";
import LandingNav from "@/components/layout/LandingNav";

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
  { name: "Home", href: "/", isRoute: true },
  { name: "About", href: "/about", isRoute: true },
  { name: "Problem", href: "#problem" },
  { name: "Solution", href: "#solution" },
  { name: "Tech", href: "#tech" },
];

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <Link to="/" className="flex items-center space-x-2">
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
                    {item.isRoute ? (
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </a>
                    )}
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
                      {item.isRoute ? (
                        <Link
                          to={item.href}
                          className="text-muted-foreground hover:text-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth">
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth">
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
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
      <LandingNav />

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
          </AnimatedGroup>

          {/* Hard questions */}
          <div className="mt-24 grid gap-4 md:grid-cols-2 text-left">
            {[
              "How many plans did you not follow this week?",
              "Do you plan your day… or just rewrite failures every night?",
              "If your system works, why do you still feel behind?",
              "Why does one delay destroy your entire day?",
            ].map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass rounded-2xl p-6 md:p-7"
              >
                <p className="text-lg md:text-xl font-medium leading-snug">"{q}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section id="problem">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">The Real Enemy</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl mx-auto leading-tight">
            The system you trust is quietly failing you.
          </h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {[
            { t: "Static schedules ≠ real life", d: "The day you planned never matches the day you live." },
            { t: "To-do lists don't adapt — they accumulate", d: "Each unfinished task becomes tomorrow's burden." },
            { t: "Apps track tasks, not reality", d: "They measure intent, not what actually happened." },
            { t: "You plan for ideal days, not actual days", d: "Energy, context, and interruptions are never accounted for." },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-7">
              <h3 className="text-xl font-semibold mb-2">{item.t}</h3>
              <p className="text-muted-foreground">{item.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-3xl md:text-4xl font-semibold tracking-tight">
          Your life is dynamic. <span className="text-muted-foreground">Your system is not.</span>
        </p>
      </Section>

      {/* REFRAME */}
      <Section className="border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">Reframe</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            Stop managing time. <br />
            <span className="text-muted-foreground">Start managing reality.</span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground">
            Productivity isn't about managing hours. It's about aligning tasks with what's actually happening.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            { icon: Zap, label: "Energy", desc: "Match work to your cognitive state." },
            { icon: Target, label: "Context", desc: "Where you are shapes what you can do." },
            { icon: RefreshCcw, label: "Interruptions", desc: "Reality intrudes — your system should absorb it." },
          ].map((c, i) => (
            <div key={i} className="glass rounded-2xl p-7 text-center">
              <c.icon className="size-7 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-2">{c.label}</h3>
              <p className="text-muted-foreground text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SOLUTION */}
      <Section id="solution" className="border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="size-3.5 text-accent" />
            <span className="text-xs">Introducing</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            Meet SERA — <br />
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              your adaptive routine system.
            </span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground">
            Not another planner. A system that thinks, adjusts, and reacts with you.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {[
            { icon: Brain, title: "Dynamic Adaptation", desc: "Late? SERA reschedules your day instantly." },
            { icon: Mic, title: "Voice-first Control", desc: "Say it. It's handled." },
            { icon: Workflow, title: "Method-aware", desc: "GTD, Pomodoro, time-blocking — SERA adapts to your brain." },
            { icon: RefreshCcw, title: "Continuity Engine", desc: "One disruption doesn't ruin your entire day anymore." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-7 group hover:glow-soft transition-smooth">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-accent/10 p-3">
                  <f.icon className="size-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* REALITY VS EXPECTATION */}
      <Section id="reality" className="border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">Reality Check</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Expectation vs. Reality</h2>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
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

        <p className="mt-12 text-center text-2xl md:text-3xl font-medium tracking-tight text-muted-foreground">
          Until your system adapts… <span className="text-foreground">nothing changes.</span>
        </p>
      </Section>

      {/* PSYCH HOOK */}
      <Section className="border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            You're not inconsistent. <br />
            <span className="text-muted-foreground">Your system is.</span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground">
            Consistency is engineered, not forced. Your brain isn't built for static schedules.
          </p>
        </div>
      </Section>

      {/* TECH EDGE */}
      <Section id="tech" className="border-t border-border/50">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">Under the Hood</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Research-backed intelligence.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              SERA is built on adaptive scheduling, behavioral feedback loops, and cognitive-state-aware planning — not gimmicks.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              "Adaptive scheduling algorithms",
              "Behavioral feedback loops",
              "Cognitive-state-aware planning",
            ].map((line, i) => (
              <div key={i} className="glass rounded-xl p-5 flex items-center gap-3">
                <div className="size-2 rounded-full bg-accent" />
                <span className="text-base">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="border-t border-border/50">
        <div className="glass-strong rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 size-[400px] rounded-full bg-accent/10 blur-3xl" />
          <h2 className="relative text-4xl md:text-6xl font-semibold tracking-tight">
            Fix your system. <span className="text-muted-foreground">Fix your day.</span>
          </h2>
          <p className="relative mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Plans fail. Systems adapt. Life interrupts. SERA recalculates.
          </p>
          <div className="relative mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="rounded-full px-8" onClick={() => navigate("/auth")}>
              Stop Planning. Start Adapting.
              <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => navigate("/auth")}>
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

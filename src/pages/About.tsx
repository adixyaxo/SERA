import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { ArrowRight, Brain, Workflow, RefreshCcw, Sparkles, BookOpen, Lock, GitBranch, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeraLogo } from "@/components/ui/sera-logo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutPage from "@/components/ui/about-page";
import { LiquidNavbar } from "@/components/layout/LiquidNavbar";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    icon: Brain,
    title: "Externalized Cognition",
    body: "Planning lives outside the brain. SERA holds memory, intent, and triggers so decisions become environment-assisted, not mentally taxing.",
    ref: "Heylighen & Vidal — GTD: The Science Behind Stress-Free Productivity",
  },
  {
    icon: Workflow,
    title: "Adaptive Scheduling",
    body: "A constraint-aware engine that reconfigures plans against time conflicts, priority shifts, energy levels and real-world delays.",
    ref: "Mahes (2024), Souza (2024), Gervasio et al.",
  },
  {
    icon: RefreshCcw,
    title: "Cognitive-State-Aware",
    body: "Chronobiology, task-difficulty modeling and behavioral feedback loops align scheduling with how humans actually function.",
    ref: "Self-Determination Theory · Goal-Setting Theory",
  },
  {
    icon: Sparkles,
    title: "Mixed-Initiative AI",
    body: "The system suggests, you confirm or edit, the system learns. A collaborative loop instead of rigid automation.",
    ref: "Weber et al. — PTIME · Marikyan et al. (2022)",
  },
  {
    icon: GitBranch,
    title: "Framework Layer",
    body: "An execution layer over GTD, Atomic Habits and Make It Stick — structuring tasks, reinforcing habits, closing reflection loops.",
    ref: "Integrates with the methods you already trust",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    body: "Local-first options, encrypted sync and user-controlled data policies. Behavioral signals stay yours.",
    ref: "Adaptive intelligence with consent at the core",
  },
];

const flow = ["Capture", "Understand", "Plan", "Present", "Confirm", "Execute", "Learn"];

const menuItems = [
  { name: "Home", href: "/landing", isRouterLink: true },
  { name: "Philosophy", href: "#philosophy" },
  { name: "Architecture", href: "#architecture" },
  { name: "References", href: "#references" },
];



export default function About() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <LiquidNavbar items={menuItems} />

      {/* HERO + ABOUT (new layout) */}
      <AboutPage />

      {/* CORE STATEMENT */}
      <section id="philosophy" className="px-6 py-24 border-t border-border/50">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-6">Core Philosophy</p>
          <h2 className="text-3xl md:text-5xl font-medium leading-tight">
            Most systems ask <span className="text-muted-foreground">"what should you do next?"</span>
            <br />
            SERA asks <span className="text-foreground">"given your current state, environment, and goals — what is realistically optimal right now?"</span>
          </h2>
          <p className="mt-8 text-muted-foreground max-w-2xl">
            It doesn't just manage tasks. It continuously negotiates reality on your behalf —
            acting as a mixed-initiative intelligent system that interprets input, predicts
            constraints, and restructures schedules in real time.
          </p>
        </div>
      </section>

      {/* HORIZONTAL SCROLL — GSAP */}
      <section ref={sectionRef} className="relative h-screen overflow-hidden border-t border-border/50">
        <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-10 pointer-events-none">
          <div className="mx-auto max-w-6xl flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Three converging principles · six pillars
              </p>
              <h3 className="text-2xl md:text-3xl font-medium">What SERA is built on</h3>
            </div>
            <p className="hidden md:block text-xs text-muted-foreground">scroll →</p>
          </div>
        </div>

        <div className="h-full flex items-center">
          <div ref={trackRef} className="flex gap-6 px-6 md:px-16 will-change-transform">
            {principles.map((p, i) => (
              <article
                key={p.title}
                className="glass rounded-3xl p-8 md:p-10 w-[80vw] sm:w-[60vw] md:w-[420px] shrink-0 flex flex-col justify-between min-h-[60vh]"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-2xl glass-strong flex items-center justify-center">
                      <p.icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, "0")} / {String(principles.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h4 className="text-2xl font-medium mb-4 tracking-tight">{p.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
                <p className="text-xs text-muted-foreground/80 mt-8 pt-6 border-t border-border/50 italic">
                  {p.ref}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="px-6 py-32 border-t border-border/50">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-6">System Architecture</p>
          <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-16 max-w-3xl">
            A continuous loop, not a static planner.
          </h2>

          <div className="flex flex-wrap items-center gap-3 mb-20">
            {flow.map((step, i) => (
              <React.Fragment key={step}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-2.5 rounded-full glass text-sm font-medium"
                >
                  {step}
                </motion.div>
                {i < flow.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground/60" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border/50 rounded-2xl overflow-hidden">
            {[
              { title: "Voice + Input Layer", body: "ASR, natural language parsing, low-friction capture across surfaces." },
              { title: "NLU Engine", body: "Intent classification and slot extraction — time, task, priority, context." },
              { title: "Scheduling Engine", body: "Constraint solver combining heuristics with optimization, generating multiple candidate plans." },
              { title: "LLM Layer", body: "Translates system decisions into human-readable suggestions with explainability." },
              { title: "Execution Layer", body: "Connects to calendar APIs and task systems — Google, Outlook, and beyond." },
              { title: "Learning Loop", body: "Tracks accept/reject signals to continuously refine personalization models." },
            ].map((c) => (
              <div key={c.title} className="bg-background p-8">
                <h4 className="font-medium mb-2">{c.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="px-6 py-32 border-t border-border/50">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm uppercase tracking-widest text-muted-foreground">References</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-16">
            Standing on real research.
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">Papers</h4>
              <ul className="space-y-4 text-foreground/90">
                <li>Heylighen & Vidal — <span className="text-muted-foreground">GTD: The Science Behind Stress-Free Productivity</span></li>
                <li>Mahes (2024) — <span className="text-muted-foreground">Adaptive Scheduling in Service Systems</span></li>
                <li>Souza (2024) — <span className="text-muted-foreground">Adaptive Scheduling Algorithm (ASA)</span></li>
                <li>Gervasio et al. — <span className="text-muted-foreground">Learning User Preferences for Scheduling</span></li>
                <li>Weber et al. — <span className="text-muted-foreground">PTIME Adaptive Assistant System</span></li>
                <li>Marikyan et al. (2022) — <span className="text-muted-foreground">Digital Assistants & Productivity</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">Books</h4>
              <ul className="space-y-4 text-foreground/90">
                <li>Getting Things Done <span className="text-muted-foreground">— David Allen</span></li>
                <li>Atomic Habits <span className="text-muted-foreground">— James Clear</span></li>
                <li>Make It Stick <span className="text-muted-foreground">— Brown, Roediger, McDaniel</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 border-t border-border/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight">
            Stop managing time. <br />
            <span className="text-muted-foreground">Start negotiating reality.</span>
          </h2>
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/auth">Try SERA <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/landing">Back to home</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-border/50 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SERA · Smart Everyday Routine Assistant
      </footer>
    </main>
  );
}

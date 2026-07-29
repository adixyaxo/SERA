import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mic, Calendar, Brain, Workflow, ArrowRight, Send, Sparkles, Square } from "lucide-react";
import { Link } from "react-router-dom";
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

const demos = [
  { icon: Mic, title: "Voice capture", sub: "Say it. It's scheduled." },
  { icon: Brain, title: "Cognitive scheduling", sub: "Match work to your state." },
  { icon: Workflow, title: "Live re-planning", sub: "Reality intrudes. SERA adapts." },
  { icon: Calendar, title: "Continuity engine", sub: "One disruption ≠ ruined day." },
];

/* ---------- 3D Tilt Card ---------- */
function Tilt3DCard({ children, active, onClick, index }: { children: React.ReactNode; active: boolean; onClick: () => void; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [-50, 50], [12, -12]);
  const rotateY = useTransform(sx, [-50, 50], [-12, 12]);

  const handleMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }}
      className={cn(
        "relative cursor-pointer rounded-2xl border p-5 transition-colors duration-300",
        active ? "bg-card/90 border-accent/50 shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.4)]" : "bg-card/40 border-border/40 hover:bg-card/60"
      )}
    >
      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="relative">
        {children}
        <span className="absolute -top-1 right-0 text-[10px] font-mono text-muted-foreground" style={{ transform: "translateZ(20px)" }}>
          0{index + 1}
        </span>
      </div>
      {active && (
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
      )}
    </motion.div>
  );
}

/* ---------- Interactive Voice Demo ---------- */
function VoiceDemo() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [scheduled, setScheduled] = useState<string | null>(null);

  const phrases = [
    'Remind me to call Maya at 4 about the launch',
    'Block 9 to 11 for deep work tomorrow',
    'Move my 3pm to Friday',
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);

  const start = () => {
    setRecording(true);
    setScheduled(null);
    const phrase = phrases[phraseIdx % phrases.length];
    setTranscript("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTranscript(phrase.slice(0, i));
      if (i >= phrase.length) {
        clearInterval(id);
        setRecording(false);
        setTimeout(() => setScheduled(phrase), 400);
        setPhraseIdx((p) => p + 1);
      }
    }, 35);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end gap-1 h-14">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn("w-1 rounded-full", recording ? "bg-accent" : "bg-muted-foreground/30")}
            animate={recording ? { height: ["20%", "100%", "30%", "70%", "25%"] } : { height: "20%" }}
            transition={{ duration: 0.8 + (i % 4) * 0.15, repeat: recording ? Infinity : 0, delay: i * 0.03 }}
          />
        ))}
      </div>
      <div className="min-h-[60px] rounded-lg bg-background/60 border border-border/40 p-3 text-sm font-mono">
        {transcript || <span className="text-muted-foreground">Tap the mic to dictate…</span>}
        {recording && <span className="inline-block w-1.5 h-4 bg-accent ml-1 animate-pulse" />}
      </div>
      <AnimatePresence>
        {scheduled && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-2 text-xs flex items-center gap-2"
          >
            <Sparkles className="size-3 text-accent" /> Scheduled: <span className="font-medium">{scheduled}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <Button size="sm" onClick={start} disabled={recording} className="rounded-full">
        {recording ? <><Square className="size-3 mr-1" /> Listening</> : <><Mic className="size-3 mr-1" /> Tap to speak</>}
      </Button>
    </div>
  );
}

/* ---------- Interactive Schedule Sort ---------- */
function ScheduleDemo() {
  const initial = [
    { t: "09:00", task: "Inbox triage", energy: "low" },
    { t: "10:00", task: "Strategy doc", energy: "high" },
    { t: "13:00", task: "Deep coding", energy: "high" },
    { t: "15:00", task: "Stand-up", energy: "med" },
    { t: "16:00", task: "Review PRs", energy: "med" },
  ];
  const [sorted, setSorted] = useState(false);
  const order = ["high", "med", "low"];
  const list = sorted
    ? [...initial].sort((a, b) => order.indexOf(a.energy) - order.indexOf(b.energy)).map((x, i) => ({ ...x, t: ["09:00","10:30","13:00","15:00","16:00"][i] }))
    : initial;

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{sorted ? "Re-sorted by energy peak" : "Original schedule"}</p>
        <Button size="sm" variant="outline" className="rounded-full text-xs h-7" onClick={() => setSorted((s) => !s)}>
          {sorted ? "Reset" : "Let SERA sort"}
        </Button>
      </div>
      <motion.div layout className="space-y-2">
        {list.map((row) => (
          <motion.div
            layout
            key={row.task}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="rounded-md bg-card/80 border border-border/50 px-3 py-2 text-xs font-mono flex items-center justify-between"
          >
            <span><span className="text-muted-foreground mr-3">{row.t}</span>{row.task}</span>
            <span className={cn(
              "text-[10px] uppercase px-2 py-0.5 rounded-full border",
              row.energy === "high" && "border-accent/50 text-accent bg-accent/10",
              row.energy === "med" && "border-border/60 text-muted-foreground",
              row.energy === "low" && "border-border/40 text-muted-foreground/60"
            )}>{row.energy}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- Mini AI Chat ---------- */
function ChatDemo() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<{ role: "u" | "a"; text: string }[]>([
    { role: "a", text: "Hi — I'm SERA. Tell me what fell apart today." },
  ]);
  const replies: Record<string, string> = {
    default: "I can re-shuffle your day. Want me to push the rest 30 min and protect your deep-work block?",
    meeting: "Got it — I'll cushion the next slot and move admin work to your low-energy window.",
    tired: "Lower-cognitive tasks queued. Deep work moves to tomorrow's peak window.",
  };
  const send = () => {
    if (!input.trim()) return;
    const u = input;
    setInput("");
    setMsgs((m) => [...m, { role: "u", text: u }]);
    setTimeout(() => {
      const key = u.toLowerCase().includes("meet") ? "meeting" : u.toLowerCase().includes("tired") ? "tired" : "default";
      setMsgs((m) => [...m, { role: "a", text: replies[key] }]);
    }, 600);
  };
  return (
    <div className="w-full">
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl px-3 py-2 text-xs max-w-[85%]",
              m.role === "u" ? "bg-accent/15 border border-accent/30 ml-auto" : "bg-card/80 border border-border/40"
            )}
          >
            {m.text}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Try: meeting ran over"
          className="flex-1 rounded-full bg-background/60 border border-border/40 px-3 py-1.5 text-xs outline-none focus:border-accent/40"
        />
        <Button size="sm" onClick={send} className="rounded-full h-8 w-8 p-0"><Send className="size-3" /></Button>
      </div>
    </div>
  );
}

/* ---------- Continuity ---------- */
function ContinuityDemo() {
  const [skipDay, setSkipDay] = useState<number | null>(null);
  return (
    <div className="space-y-3 w-full">
      <p className="text-xs text-muted-foreground">Click a day to skip — watch SERA redistribute.</p>
      <div className="flex gap-2">
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <button
            key={i}
            onClick={() => setSkipDay(skipDay === i ? null : i)}
            className={cn(
              "flex-1 h-16 rounded-md border text-xs font-medium transition-all",
              skipDay === i
                ? "bg-muted/30 border-border/40 text-muted-foreground/50 line-through"
                : skipDay !== null && i === (skipDay + 1) % 7
                ? "bg-accent/20 border-accent/50 text-foreground"
                : "bg-card/80 border-border/50"
            )}
          >
            {d}
          </button>
        ))}
      </div>
      {skipDay !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent">
          ✓ Tasks re-balanced into next day's low-load window.
        </motion.p>
      )}
    </div>
  );
}

const visuals = [<VoiceDemo />, <ScheduleDemo />, <ChatDemo />, <ContinuityDemo />];

export default function Demo() {
  const [active, setActive] = useState(0);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LiquidNavbar items={menuItems} />

      {/* Full-screen demo: nav-height compensated on desktop, natural scroll on mobile */}
      <section
        className="px-6 pt-24 md:pt-28 pb-10 md:pb-8 md:h-screen md:overflow-hidden flex flex-col"
      >
        <div className="mx-auto max-w-3xl text-center mb-6 md:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">Demo</p>
          <h1 className="text-3xl md:text-5xl font-black tracking-[-0.04em] leading-[1.05]">
            See SERA <span className="text-muted-foreground">negotiate reality.</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Four interactive demos. Try them. They respond.
          </p>
        </div>

        <div className="mx-auto max-w-6xl w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 md:min-h-0">
          <div className="lg:col-span-5 space-y-3 md:overflow-y-auto md:pr-1" style={{ perspective: 1200 }}>
            {demos.map((d, i) => (
              <Tilt3DCard key={d.title} active={active === i} onClick={() => setActive(i)} index={i}>
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-lg p-2 transition-colors", active === i ? "bg-accent/20" : "bg-muted/40")}>
                    <d.icon className="size-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium tracking-tight">{d.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.sub}</p>
                  </div>
                </div>
              </Tilt3DCard>
            ))}
          </div>

          <div className="lg:col-span-7 md:min-h-0">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-[20px] p-6 md:p-8 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <p className="text-xs font-mono text-muted-foreground mb-1">DEMO {String(active + 1).padStart(2, "0")}</p>
                  <h2 className="text-xl md:text-2xl font-medium tracking-tight">{demos[active].title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{demos[active].sub}</p>
                  <div className="mt-4 flex-1 flex items-center justify-center rounded-xl bg-background/40 border border-border/30 p-5 md:p-6 min-h-0 overflow-auto">
                    {visuals[active]}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Interactive · Try it</p>
                <Button asChild size="sm">
                  <Link to="/auth">Use it for real <ArrowRight className="ml-1 size-3" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


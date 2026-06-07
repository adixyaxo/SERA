import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Check, Trash2, Flame, Sparkles, BookOpen, BarChart3, CalendarClock, ArrowRight, AlertTriangle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { FloatingBackground } from "@/components/dashboard/FloatingBackground";
import { SeraFAB } from "@/components/sera/SeraFAB";
import { useMonkDay, formatDate, addDays, MonkTask } from "@/hooks/useMonkDay";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type View = "today" | "tomorrow" | "accountability" | "journal" | "insights";

const VIEWS: { id: View; label: string; icon: any }[] = [
  { id: "today", label: "Today", icon: Target },
  { id: "tomorrow", label: "Plan Tomorrow", icon: CalendarClock },
  { id: "accountability", label: "Accountability", icon: AlertTriangle },
  { id: "journal", label: "Journal", icon: BookOpen },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

const MonkMode = () => {
  const [view, setView] = useState<View>("today");
  const [date, setDate] = useState(new Date());
  const isToday = formatDate(date) === formatDate(new Date());

  return (
    <div className="min-h-screen w-full relative">
      <FloatingBackground />
      <Header />
      <main className="pt-28 sm:pt-32 pb-28 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground/70 mb-1">
                <Flame className="h-3 w-3" /> Monk Mode
              </div>
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight">
                {isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h1>
              <p className="text-sm text-muted-foreground/70 mt-1 italic">
                Plan deliberately. Execute honestly. Reflect daily.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-background/40 backdrop-blur-md rounded-full border border-border/30 p-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setDate(addDays(date, -1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <button onClick={() => setDate(new Date())} className="text-xs px-3 text-muted-foreground hover:text-foreground transition-colors">
                Today
              </button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setDate(addDays(date, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Segmented control */}
          <div className="flex overflow-x-auto gap-1 bg-background/30 backdrop-blur-md rounded-2xl border border-border/30 p-1 no-scrollbar">
            {VIEWS.map(v => {
              const Active = view === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors min-h-[40px]",
                    Active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                  )}
                >
                  {Active && (
                    <motion.div layoutId="monk-pill" className="absolute inset-0 bg-foreground/10 rounded-xl border border-border/40" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <v.icon className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10">{v.label}</span>
                </button>
              );
            })}
          </div>

          {/* Views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={view + formatDate(date)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {view === "today" && <TodayView date={date} />}
              {view === "tomorrow" && <TodayView date={addDays(date, 1)} planningMode />}
              {view === "accountability" && <AccountabilityView date={date} />}
              {view === "journal" && <JournalView date={date} />}
              {view === "insights" && <InsightsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <SeraFAB />
    </div>
  );
};

/* ---------------- TODAY ---------------- */
const TodayView = ({ date, planningMode = false }: { date: Date; planningMode?: boolean }) => {
  const { tasks, plan, journal, loading, addTask, toggleTask, deleteTask, setFrog, saveJournal } = useMonkDay(date);
  const [newTitle, setNewTitle] = useState("");
  const frog = tasks.find(t => t.id === plan?.frog_task_id) || tasks.find(t => t.priority === "frog");
  const others = tasks.filter(t => t.id !== frog?.id);
  const completed = tasks.filter(t => t.completed_at).length;
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="glass rounded-2xl p-5 bg-background/40 backdrop-blur-md border border-border/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground/70">
            {planningMode ? "Tomorrow's plan" : "Today's execution"}
          </span>
          <span className="text-xs text-muted-foreground">{completed}/{tasks.length}</span>
        </div>
        <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-foreground/60" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* Frog */}
      <div className={cn(
        "rounded-2xl p-6 border transition-all",
        frog
          ? "bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30"
          : "bg-background/30 border-dashed border-border/40"
      )}>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500/80 mb-2">
          <Flame className="h-3 w-3" /> Eat the frog
        </div>
        {frog ? (
          <div className="flex items-start gap-4">
            <button
              onClick={() => toggleTask(frog)}
              className={cn(
                "mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                frog.completed_at ? "bg-amber-500 border-amber-500 text-background" : "border-amber-500/50 hover:border-amber-500"
              )}
            >
              {frog.completed_at && <Check className="h-3.5 w-3.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={cn("text-lg font-light", frog.completed_at && "line-through text-muted-foreground")}>
                {frog.title}
              </div>
              <div className="text-xs text-muted-foreground/70 mt-1">
                {frog.estimate_minutes}m{frog.postpone_count > 0 && ` · postponed ×${frog.postpone_count}`}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFrog(null)} className="text-xs text-muted-foreground">Clear</Button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground/70">
            Pick the hardest, most important task. Star it below to set your frog.
          </div>
        )}
      </div>

      {/* Add task */}
      <form
        onSubmit={(e) => { e.preventDefault(); addTask(newTitle); setNewTitle(""); }}
        className="flex gap-2"
      >
        <Input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder={planningMode ? "Add a task for tomorrow…" : "What needs to happen today?"}
          className="bg-background/40 border-border/30 rounded-xl h-12"
        />
        <Button type="submit" size="icon" className="h-12 w-12 rounded-xl shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {/* Tasks */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">Loading…</div>
        ) : others.length === 0 && !frog ? (
          <div className="text-center py-12 text-sm text-muted-foreground/60">
            {planningMode ? "Set the intentions that shape tomorrow." : "Empty page. Empty mind. Start with one thing."}
          </div>
        ) : (
          <AnimatePresence>
            {others.map(t => (
              <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t)} onDelete={() => deleteTask(t.id)} onFrog={() => setFrog(t.id)} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Quick reflection */}
      {!planningMode && (
        <div className="glass rounded-2xl p-5 bg-background/40 backdrop-blur-md border border-border/30 space-y-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground/70">Quick reflection</div>
          <Textarea
            placeholder="One sentence on how today went…"
            value={journal?.free_form ?? ""}
            onChange={e => saveJournal({ free_form: e.target.value })}
            className="bg-transparent border-border/20 resize-none min-h-[60px] focus-visible:ring-0"
          />
        </div>
      )}
    </div>
  );
};

const TaskRow = ({ task, onToggle, onDelete, onFrog }: { task: MonkTask; onToggle: () => void; onDelete: () => void; onFrog: () => void }) => {
  const done = !!task.completed_at;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-background/30 hover:bg-background/50 border border-border/20 transition-colors"
    >
      <button
        onClick={onToggle}
        className={cn(
          "h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all",
          done ? "bg-foreground border-foreground text-background" : "border-border/60 hover:border-foreground"
        )}
      >
        {done && <Check className="h-3 w-3" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm truncate", done && "line-through text-muted-foreground/60")}>{task.title}</div>
        <div className="text-[10px] text-muted-foreground/60 flex items-center gap-2 mt-0.5">
          <span>{task.estimate_minutes}m</span>
          {task.postpone_count > 0 && (
            <span className={cn("flex items-center gap-1", task.postpone_count >= 3 ? "text-red-400" : "text-amber-500/80")}>
              <AlertTriangle className="h-2.5 w-2.5" /> postponed ×{task.postpone_count}
            </span>
          )}
        </div>
      </div>
      <button onClick={onFrog} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-amber-500 transition-all" title="Make frog">
        <Flame className="h-4 w-4" />
      </button>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};

/* ---------------- ACCOUNTABILITY ---------------- */
const AccountabilityView = ({ date }: { date: Date }) => {
  const { user } = useAuth();
  const dateStr = formatDate(date);
  const dow = date.getDay();
  const [entries, setEntries] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [tt, ch] = await Promise.all([
      supabase.from("timetable_entries").select("*").eq("user_id", user.id).eq("day_of_week", dow).order("start_time"),
      (supabase as any).from("monk_schedule_checkins").select("*").eq("user_id", user.id).eq("check_date", dateStr),
    ]);
    setEntries(tt.data || []);
    const map: Record<string, string> = {};
    (ch.data || []).forEach((c: any) => { map[c.timetable_entry_id] = c.status; });
    setCheckins(map);
    setLoading(false);
  };

  useMemo(() => { load(); }, [user, dateStr, dow]);

  const setStatus = async (entryId: string, status: string) => {
    if (!user) return;
    setCheckins(prev => ({ ...prev, [entryId]: status }));
    await (supabase as any).from("monk_schedule_checkins").upsert(
      { user_id: user.id, timetable_entry_id: entryId, check_date: dateStr, status },
      { onConflict: "user_id,timetable_entry_id,check_date" }
    );
  };

  const total = entries.length;
  const followed = Object.values(checkins).filter(s => s === "followed").length;
  const partial = Object.values(checkins).filter(s => s === "partial").length;
  const score = total ? Math.round(((followed + partial * 0.5) / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-6 bg-background/40 backdrop-blur-md border border-border/30 text-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground/70 mb-2">Schedule adherence</div>
        <div className="text-5xl font-extralight">{score}%</div>
        <div className="text-xs text-muted-foreground/60 mt-2">{followed} followed · {partial} partial · {total - followed - partial} skipped</div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">Loading schedule…</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground/60">
            No timetable blocks for this day. Build your schedule in the Timetable tab.
          </div>
        ) : entries.map(e => (
          <div key={e.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/30 border border-border/20">
            <div className="text-xs text-muted-foreground/70 w-24 tabular-nums">{e.start_time?.slice(0,5)}–{e.end_time?.slice(0,5)}</div>
            <div className="flex-1 text-sm truncate">{e.title}</div>
            <div className="flex gap-1">
              {[
                { s: "followed", label: "✓", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" },
                { s: "partial", label: "~", cls: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
                { s: "skipped", label: "✗", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
              ].map(b => (
                <button
                  key={b.s}
                  onClick={() => setStatus(e.id, b.s)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs border transition-all",
                    checkins[e.id] === b.s ? b.cls : "border-border/30 text-muted-foreground/60 hover:text-foreground"
                  )}
                >{b.label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- JOURNAL ---------------- */
const JournalView = ({ date }: { date: Date }) => {
  const { journal, saveJournal } = useMonkDay(date);
  const prompts: { key: "went_well" | "time_wasted" | "improve_tomorrow"; label: string; placeholder: string }[] = [
    { key: "went_well", label: "What went well today?", placeholder: "Wins, however small…" },
    { key: "time_wasted", label: "What wasted your time?", placeholder: "Honest, no guilt." },
    { key: "improve_tomorrow", label: "What needs improvement tomorrow?", placeholder: "One concrete shift." },
  ];

  return (
    <div className="space-y-4">
      {prompts.map(p => (
        <div key={p.key} className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground/70">{p.label}</label>
          <Textarea
            value={(journal as any)?.[p.key] ?? ""}
            onChange={e => saveJournal({ [p.key]: e.target.value } as any)}
            placeholder={p.placeholder}
            className="bg-background/30 border-border/20 rounded-xl min-h-[90px] resize-none"
          />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <RatingPicker label="Energy" value={journal?.energy ?? null} onChange={v => saveJournal({ energy: v })} />
        <RatingPicker label="Clarity" value={journal?.clarity ?? null} onChange={v => saveJournal({ clarity: v })} />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-muted-foreground/70">Free writing</label>
        <Textarea
          value={journal?.free_form ?? ""}
          onChange={e => saveJournal({ free_form: e.target.value })}
          placeholder="Long-form. Markdown supported."
          className="bg-background/30 border-border/20 rounded-xl min-h-[160px] resize-none"
        />
      </div>
    </div>
  );
};

const RatingPicker = ({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <label className="text-xs uppercase tracking-widest text-muted-foreground/70">{label}</label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={cn(
            "flex-1 h-10 rounded-lg border text-sm transition-all",
            value === n ? "bg-foreground/10 border-foreground/40 text-foreground" : "border-border/30 text-muted-foreground/60 hover:text-foreground"
          )}
        >{n}</button>
      ))}
    </div>
  </div>
);

/* ---------------- INSIGHTS ---------------- */
const InsightsView = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ completion: number; frogRate: number; journalDays: number; streak: number } | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useMemo(() => {
    if (!user) return;
    (async () => {
      const since = formatDate(addDays(new Date(), -14));
      const [tasksRes, journalsRes, plansRes] = await Promise.all([
        (supabase as any).from("monk_tasks").select("plan_date, completed_at, priority").eq("user_id", user.id).gte("plan_date", since),
        (supabase as any).from("monk_journal_entries").select("entry_date").eq("user_id", user.id).gte("entry_date", since),
        (supabase as any).from("monk_daily_plans").select("plan_date, frog_task_id").eq("user_id", user.id).gte("plan_date", since),
      ]);
      const tasks = tasksRes.data || [];
      const journals = journalsRes.data || [];
      const plans = plansRes.data || [];
      const completion = tasks.length ? Math.round((tasks.filter((t: any) => t.completed_at).length / tasks.length) * 100) : 0;
      const frogs = tasks.filter((t: any) => t.priority === "frog");
      const frogRate = frogs.length ? Math.round((frogs.filter((t: any) => t.completed_at).length / frogs.length) * 100) : 0;
      // streak: consecutive days back from today with any completed task
      const completedByDate = new Set<string>(tasks.filter((t: any) => t.completed_at).map((t: any) => t.plan_date));
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const d = formatDate(addDays(new Date(), -i));
        if (completedByDate.has(d)) streak++;
        else break;
      }
      setStats({ completion, frogRate, journalDays: journals.length, streak });
    })();
  }, [user]);

  const generateInsight = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("monk-insights", { body: {} });
      if (error) throw error;
      setAiInsight(data?.insight || "No insight available.");
    } catch (e: any) {
      toast.error(e.message || "Could not generate insight");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Completion" value={`${stats?.completion ?? 0}%`} />
        <Stat label="Frog rate" value={`${stats?.frogRate ?? 0}%`} />
        <Stat label="Journal days" value={`${stats?.journalDays ?? 0}/14`} />
        <Stat label="Streak" value={`${stats?.streak ?? 0}d`} />
      </div>

      <div className="glass rounded-2xl p-6 bg-background/40 backdrop-blur-md border border-border/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> AI pattern review
          </div>
          <Button size="sm" variant="ghost" onClick={generateInsight} disabled={generating} className="text-xs">
            {generating ? "Analyzing…" : "Generate"} <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        {aiInsight ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{aiInsight}</p>
        ) : (
          <p className="text-sm text-muted-foreground/60">
            Get a personalized pattern review across the last 14 days — when you perform best, what derails you, what to change tomorrow.
          </p>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl p-4 bg-background/40 backdrop-blur-md border border-border/30">
    <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{label}</div>
    <div className="text-2xl font-extralight mt-1">{value}</div>
  </div>
);

export default MonkMode;

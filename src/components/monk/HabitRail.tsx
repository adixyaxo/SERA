import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDate } from "@/hooks/useMonkDay";

type Habit = {
  id: string;
  name: string;
  category: string | null;
  frequency: string;
};

interface Props {
  date: Date;
}

export function HabitRail({ date }: Props) {
  const { user } = useAuth();
  const dateStr = formatDate(date);
  const isToday = dateStr === formatDate(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, boolean>>({});
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [hRes, lRes, allLogsRes] = await Promise.all([
      supabase.from("habits").select("id,name,category,frequency").eq("user_id", user.id).eq("archived", false).order("created_at"),
      supabase.from("habit_logs").select("habit_id,completed").eq("date_string", dateStr),
      // pull last 60 days of completed logs to compute streaks
      supabase.from("habit_logs").select("habit_id,date_string,completed").eq("completed", true).gte("date_string", formatDate(new Date(Date.now() - 60 * 86400000))),
    ]);
    const hs = (hRes.data || []) as Habit[];
    setHabits(hs);
    const m: Record<string, boolean> = {};
    (lRes.data || []).forEach((l: any) => { m[l.habit_id] = l.completed; });
    setLogs(m);

    // compute streak per habit (consecutive days ending today/yesterday)
    const byHabit: Record<string, Set<string>> = {};
    (allLogsRes.data || []).forEach((l: any) => {
      (byHabit[l.habit_id] ??= new Set()).add(l.date_string);
    });
    const sm: Record<string, number> = {};
    hs.forEach(h => {
      const set = byHabit[h.id] || new Set();
      let streak = 0;
      const cursor = new Date();
      // If today not done, allow starting from yesterday
      if (!set.has(formatDate(cursor))) cursor.setDate(cursor.getDate() - 1);
      while (set.has(formatDate(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
      sm[h.id] = streak;
    });
    setStreaks(sm);
    setLoading(false);
  }, [user, dateStr]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (habitId: string) => {
    const current = !!logs[habitId];
    setLogs(prev => ({ ...prev, [habitId]: !current }));
    if (!current) {
      const { error } = await supabase
        .from("habit_logs")
        .upsert({ habit_id: habitId, date_string: dateStr, completed: true }, { onConflict: "habit_id,date_string" });
      if (error) { toast.error("Could not log habit"); load(); return; }
      setStreaks(prev => ({ ...prev, [habitId]: (prev[habitId] || 0) + (isToday ? 1 : 0) }));
    } else {
      const { error } = await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("date_string", dateStr);
      if (error) { toast.error("Could not unlog habit"); load(); return; }
      setStreaks(prev => ({ ...prev, [habitId]: Math.max(0, (prev[habitId] || 0) - (isToday ? 1 : 0)) }));
    }
  };

  const addHabit = async () => {
    if (!user || !newName.trim()) return;
    const { error } = await supabase.from("habits").insert({
      user_id: user.id,
      name: newName.trim(),
      frequency: "daily",
      category: "General",
      start_date: formatDate(new Date()),
    });
    if (error) { toast.error("Could not add habit"); return; }
    setNewName("");
    setAdding(false);
    load();
  };

  const completedCount = habits.filter(h => logs[h.id]).length;

  return (
    <div className="glass rounded-2xl p-5 bg-background/40 backdrop-blur-md border border-border/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground/70">
          <Flame className="h-3 w-3" /> Daily habits
          {habits.length > 0 && (
            <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">· {completedCount}/{habits.length}</span>
          )}
        </div>
        <button
          onClick={() => setAdding(v => !v)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>

      {adding && (
        <form onSubmit={(e) => { e.preventDefault(); addHabit(); }} className="flex gap-2">
          <Input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g. Meditate 10m"
            className="bg-background/40 border-border/30 rounded-xl h-9 text-sm"
          />
          <Button type="submit" size="sm" className="h-9 rounded-xl">Save</Button>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground/60 py-4 text-center">Loading habits…</div>
      ) : habits.length === 0 ? (
        <div className="text-sm text-muted-foreground/60 py-4 text-center">
          No habits yet. Define the small daily acts that compound.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {habits.map(h => {
            const done = !!logs[h.id];
            const streak = streaks[h.id] || 0;
            return (
              <motion.button
                key={h.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggle(h.id)}
                className={cn(
                  "group flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-full border text-sm transition-all min-h-[40px]",
                  done
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                    : "bg-background/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
                )}
              >
                <span className={cn(
                  "h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                  done ? "bg-emerald-500 border-emerald-500 text-background" : "border-border/60"
                )}>
                  {done && <Check className="h-3 w-3" />}
                </span>
                <span className={cn("truncate max-w-[140px]", done && "line-through opacity-80")}>{h.name}</span>
                {streak > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-amber-400/90 tabular-nums">
                    <Flame className="h-2.5 w-2.5" />{streak}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Plus, Settings2, Trash2, Bell, Target, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate } from "@/hooks/useMonkDay";

type Habit = {
  id: string;
  name: string;
  category: string | null;
  frequency: string;
  target_per_week: number;
  reminder_time: string | null;
  notes: string | null;
  color: string | null;
  icon: string | null;
  cue: string | null;
  reward: string | null;
  difficulty: string;
};

const COLORS = ["emerald", "sky", "violet", "amber", "rose", "slate"];
const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-200", dot: "bg-emerald-500" },
  sky:     { bg: "bg-sky-500/15",     border: "border-sky-500/40",     text: "text-sky-200",     dot: "bg-sky-500" },
  violet:  { bg: "bg-violet-500/15",  border: "border-violet-500/40",  text: "text-violet-200",  dot: "bg-violet-500" },
  amber:   { bg: "bg-amber-500/15",   border: "border-amber-500/40",   text: "text-amber-200",   dot: "bg-amber-500" },
  rose:    { bg: "bg-rose-500/15",    border: "border-rose-500/40",    text: "text-rose-200",    dot: "bg-rose-500" },
  slate:   { bg: "bg-slate-500/15",   border: "border-slate-500/40",   text: "text-slate-200",   dot: "bg-slate-500" },
};
const getColor = (c: string | null) => COLOR_CLASSES[c || "emerald"] || COLOR_CLASSES.emerald;

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
  const [weekCounts, setWeekCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<Habit | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Habit | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const sixtyAgo = formatDate(new Date(Date.now() - 60 * 86400000));
    const weekAgo = formatDate(new Date(Date.now() - 6 * 86400000));
    const [hRes, lRes, allLogsRes] = await Promise.all([
      supabase.from("habits").select("*").eq("user_id", user.id).eq("archived", false).order("created_at"),
      supabase.from("habit_logs").select("habit_id,completed").eq("date_string", dateStr),
      supabase.from("habit_logs").select("habit_id,date_string,completed").eq("completed", true).gte("date_string", sixtyAgo),
    ]);
    const hs = ((hRes.data || []) as any[]) as Habit[];
    setHabits(hs);
    const m: Record<string, boolean> = {};
    (lRes.data || []).forEach((l: any) => { m[l.habit_id] = l.completed; });
    setLogs(m);

    const byHabit: Record<string, Set<string>> = {};
    (allLogsRes.data || []).forEach((l: any) => {
      (byHabit[l.habit_id] ??= new Set()).add(l.date_string);
    });
    const sm: Record<string, number> = {};
    const wk: Record<string, number> = {};
    hs.forEach(h => {
      const set = byHabit[h.id] || new Set();
      let streak = 0;
      const cursor = new Date();
      if (!set.has(formatDate(cursor))) cursor.setDate(cursor.getDate() - 1);
      while (set.has(formatDate(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
      sm[h.id] = streak;
      // weekly count (last 7 days incl. today)
      let count = 0;
      for (let i = 0; i < 7; i++) {
        const d = formatDate(new Date(Date.now() - i * 86400000));
        if (set.has(d)) count++;
      }
      wk[h.id] = count;
    });
    setStreaks(sm);
    setWeekCounts(wk);
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
      setWeekCounts(prev => ({ ...prev, [habitId]: Math.min(7, (prev[habitId] || 0) + 1) }));
    } else {
      const { error } = await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("date_string", dateStr);
      if (error) { toast.error("Could not unlog habit"); load(); return; }
      setStreaks(prev => ({ ...prev, [habitId]: Math.max(0, (prev[habitId] || 0) - (isToday ? 1 : 0)) }));
      setWeekCounts(prev => ({ ...prev, [habitId]: Math.max(0, (prev[habitId] || 0) - 1) }));
    }
  };

  const addHabit = async () => {
    if (!user || !newName.trim()) return;
    const { error } = await (supabase as any).from("habits").insert({
      user_id: user.id,
      name: newName.trim(),
      frequency: "daily",
      category: "General",
      start_date: formatDate(new Date()),
      target_per_week: 7,
      color: "emerald",
      difficulty: "easy",
    });
    if (error) { toast.error("Could not add habit"); return; }
    setNewName("");
    setAdding(false);
    load();
  };

  const saveEdit = async (patch: Partial<Habit>) => {
    if (!editing) return;
    const { error } = await (supabase as any).from("habits").update(patch).eq("id", editing.id);
    if (error) { toast.error("Update failed"); return; }
    toast.success("Habit updated");
    setEditing(null);
    load();
  };

  const deleteHabit = async (id: string) => {
    // Permanently delete the habit and all its logs (logs cascade via FK if configured;
    // we explicitly delete to be safe).
    await supabase.from("habit_logs").delete().eq("habit_id", id);
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) { toast.error("Could not delete habit"); return; }
    toast.success("Habit deleted");
    setConfirmDelete(null);
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
          {adding ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />} {adding ? "Cancel" : "Add"}
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
        <div className="space-y-2">
          {habits.map(h => {
            const done = !!logs[h.id];
            const streak = streaks[h.id] || 0;
            const wk = weekCounts[h.id] || 0;
            const target = h.target_per_week || 7;
            const pct = Math.min(100, Math.round((wk / target) * 100));
            const c = getColor(h.color);
            return (
              <div
                key={h.id}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-background/30 border-border/20",
                  done && "bg-background/50"
                )}
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggle(h.id)}
                  className={cn(
                    "h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all",
                    done ? cn(c.dot, "border-transparent text-background") : "border-border/60 hover:border-foreground"
                  )}
                  aria-label={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done && <Check className="h-3.5 w-3.5" />}
                </motion.button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm truncate", done && "line-through opacity-70")}>{h.name}</span>
                    {streak > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-400/90 tabular-nums">
                        <Flame className="h-2.5 w-2.5" />{streak}
                      </span>
                    )}
                    {h.reminder_time && (
                      <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60 tabular-nums">
                        <Bell className="h-2.5 w-2.5" />{h.reminder_time.slice(0,5)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-foreground/5 rounded-full overflow-hidden">
                      <div className={cn("h-full transition-all", c.dot)} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 tabular-nums">{wk}/{target}</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(h)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all p-1"
                  aria-label="Edit habit"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setConfirmDelete(h)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
                  aria-label="Delete habit"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border/40">
          <DialogHeader>
            <DialogTitle className="text-lg font-light flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Habit settings
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tune how this habit shows up, when it nudges you, and why it matters.
            </DialogDescription>
          </DialogHeader>
          {editing && <EditForm habit={editing} onSave={saveEdit} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this habit permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirmDelete?.name}" and all its history will be erased. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && deleteHabit(confirmDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------------- edit form ---------------- */
function EditForm({
  habit, onSave, onCancel,
}: {
  habit: Habit;
  onSave: (patch: Partial<Habit>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(habit.name);
  const [category, setCategory] = useState(habit.category || "General");
  const [frequency, setFrequency] = useState(habit.frequency || "daily");
  const [difficulty, setDifficulty] = useState(habit.difficulty || "easy");
  const [target, setTarget] = useState<number>(habit.target_per_week || 7);
  const [reminder, setReminder] = useState(habit.reminder_time?.slice(0, 5) || "");
  const [color, setColor] = useState(habit.color || "emerald");
  const [cue, setCue] = useState(habit.cue || "");
  const [reward, setReward] = useState(habit.reward || "");
  const [notes, setNotes] = useState(habit.notes || "");

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground/70">Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} className="bg-background/40 border-border/30 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground/70">Category</Label>
          <Input value={category} onChange={e => setCategory(e.target.value)} className="bg-background/40 border-border/30 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground/70">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="bg-background/40 border-border/30 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekdays">Weekdays</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground/70">Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="bg-background/40 border-border/30 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy (2 min)</SelectItem>
              <SelectItem value="medium">Medium (10 min)</SelectItem>
              <SelectItem value="hard">Hard (30 min+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1">
            <Bell className="h-3 w-3" /> Reminder
          </Label>
          <Input type="time" value={reminder} onChange={e => setReminder(e.target.value)} className="bg-background/40 border-border/30 rounded-xl" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground/70 flex items-center justify-between">
          <span className="flex items-center gap-1"><Target className="h-3 w-3" /> Weekly target</span>
          <span className="text-foreground tabular-nums normal-case tracking-normal">{target} / 7 days</span>
        </Label>
        <Slider value={[target]} min={1} max={7} step={1} onValueChange={(v) => setTarget(v[0])} />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground/70">Color</Label>
        <div className="flex gap-2">
          {COLORS.map(k => (
            <button
              key={k}
              type="button"
              onClick={() => setColor(k)}
              className={cn(
                "h-7 w-7 rounded-full transition-all",
                COLOR_CLASSES[k].dot,
                color === k ? "ring-2 ring-offset-2 ring-offset-background ring-foreground/60 scale-110" : "opacity-70 hover:opacity-100"
              )}
              aria-label={k}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground/70">Cue — what triggers it?</Label>
        <Input value={cue} onChange={e => setCue(e.target.value)} placeholder="After morning coffee…" className="bg-background/40 border-border/30 rounded-xl" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground/70">Reward — why it matters</Label>
        <Input value={reward} onChange={e => setReward(e.target.value)} placeholder="Feel sharp all morning…" className="bg-background/40 border-border/30 rounded-xl" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground/70">Notes</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any rules, exceptions, or reflection…" className="bg-background/40 border-border/30 rounded-xl resize-none min-h-[70px]" />
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button
          className="flex-1"
          onClick={() => onSave({
            name: name.trim() || habit.name,
            category,
            frequency,
            difficulty,
            target_per_week: target,
            reminder_time: reminder ? `${reminder}:00` : null,
            color,
            cue: cue || null,
            reward: reward || null,
            notes: notes || null,
          })}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

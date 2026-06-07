import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type MonkTask = {
  id: string;
  user_id: string;
  plan_date: string;
  title: string;
  notes: string | null;
  estimate_minutes: number | null;
  priority: "low" | "med" | "high" | "frog";
  order_index: number;
  completed_at: string | null;
  postpone_count: number;
  origin_date: string;
};

export type MonkPlan = {
  id: string;
  plan_date: string;
  frog_task_id: string | null;
  intention: string | null;
  energy_forecast: number | null;
};

export type MonkJournal = {
  id?: string;
  entry_date: string;
  went_well: string | null;
  time_wasted: string | null;
  improve_tomorrow: string | null;
  energy: number | null;
  clarity: number | null;
  mood: string | null;
  free_form: string | null;
};

export const formatDate = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: Date, n: number) => {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
};

const CARRY_KEY = "monk_last_carry";

export function useMonkDay(date: Date) {
  const { user } = useAuth();
  const dateStr = formatDate(date);
  const [tasks, setTasks] = useState<MonkTask[]>([]);
  const [plan, setPlan] = useState<MonkPlan | null>(null);
  const [journal, setJournal] = useState<MonkJournal | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // auto carry-forward (once per local day)
    const today = formatDate(new Date());
    const lastCarry = localStorage.getItem(CARRY_KEY);
    if (dateStr === today && lastCarry !== today) {
      const yesterday = formatDate(addDays(new Date(), -1));
      try {
        await supabase.rpc("monk_carry_forward" as any, {
          _user_id: user.id,
          _from_date: yesterday,
          _to_date: today,
        });
        localStorage.setItem(CARRY_KEY, today);
      } catch (e) {
        console.warn("carry-forward failed", e);
      }
    }

    const [tRes, pRes, jRes] = await Promise.all([
      supabase.from("monk_tasks" as any).select("*").eq("user_id", user.id).eq("plan_date", dateStr).order("order_index", { ascending: true }),
      supabase.from("monk_daily_plans" as any).select("*").eq("user_id", user.id).eq("plan_date", dateStr).maybeSingle(),
      supabase.from("monk_journal_entries" as any).select("*").eq("user_id", user.id).eq("entry_date", dateStr).maybeSingle(),
    ]);

    setTasks(((tRes.data as any) || []) as MonkTask[]);
    setPlan((pRes.data as any) || null);
    setJournal(((jRes.data as any) || { entry_date: dateStr, went_well: "", time_wasted: "", improve_tomorrow: "", energy: null, clarity: null, mood: null, free_form: "" }) as MonkJournal);
    setLoading(false);
  }, [user, dateStr]);

  useEffect(() => { load(); }, [load]);

  const addTask = async (title: string, priority: MonkTask["priority"] = "med", estimate = 30) => {
    if (!user || !title.trim()) return;
    const order = tasks.length;
    const { data, error } = await (supabase as any)
      .from("monk_tasks")
      .insert({ user_id: user.id, plan_date: dateStr, title: title.trim(), priority, estimate_minutes: estimate, order_index: order, origin_date: dateStr })
      .select()
      .single();
    if (error) { toast.error("Could not add task"); return; }
    setTasks(prev => [...prev, data as MonkTask]);
  };

  const updateTask = async (id: string, patch: Partial<MonkTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    const { error } = await (supabase as any).from("monk_tasks").update(patch).eq("id", id);
    if (error) { toast.error("Update failed"); load(); }
  };

  const toggleTask = async (t: MonkTask) => {
    const completed_at = t.completed_at ? null : new Date().toISOString();
    updateTask(t.id, { completed_at });
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await (supabase as any).from("monk_tasks").delete().eq("id", id);
  };

  const setFrog = async (taskId: string | null) => {
    if (!user) return;
    const payload = { user_id: user.id, plan_date: dateStr, frog_task_id: taskId };
    const { data, error } = await (supabase as any)
      .from("monk_daily_plans")
      .upsert(payload, { onConflict: "user_id,plan_date" })
      .select()
      .single();
    if (error) { toast.error("Could not set frog"); return; }
    setPlan(data as MonkPlan);
    // sync priority on tasks
    if (taskId) updateTask(taskId, { priority: "frog" });
  };

  const updatePlan = async (patch: Partial<MonkPlan>) => {
    if (!user) return;
    const payload = { user_id: user.id, plan_date: dateStr, ...plan, ...patch };
    const { data } = await (supabase as any)
      .from("monk_daily_plans")
      .upsert(payload, { onConflict: "user_id,plan_date" })
      .select()
      .single();
    if (data) setPlan(data as MonkPlan);
  };

  const saveJournal = async (patch: Partial<MonkJournal>) => {
    if (!user) return;
    const next = { ...journal, ...patch, entry_date: dateStr };
    setJournal(next as MonkJournal);
    const payload = { user_id: user.id, entry_date: dateStr, ...next };
    delete (payload as any).id;
    await (supabase as any).from("monk_journal_entries").upsert(payload, { onConflict: "user_id,entry_date" });
  };

  return { tasks, plan, journal, loading, addTask, updateTask, toggleTask, deleteTask, setFrog, updatePlan, saveJournal, reload: load };
}

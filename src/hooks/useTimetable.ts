import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface TimetableEntry {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  color: string;
  repeat_type: string;
  location: string | null;
}

export type TimetableFormData = Omit<TimetableEntry, "id" | "user_id">;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function useTimetable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("timetable_entries" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching timetable:", error);
    } else {
      setEntries((data as any[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const addEntry = async (data: TimetableFormData) => {
    if (!user) return;
    const { error } = await supabase.from("timetable_entries" as any).insert({
      ...data,
      user_id: user.id,
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Entry added" });
      fetchEntries();
    }
  };

  const updateEntry = async (id: string, data: Partial<TimetableFormData>) => {
    if (!user) return;
    const { error } = await supabase
      .from("timetable_entries" as any)
      .update(data as any)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Entry updated" });
      fetchEntries();
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("timetable_entries" as any)
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Entry deleted" });
      fetchEntries();
    }
  };

  const getEntriesForDay = (dayIndex: number) =>
    entries.filter((e) => e.day_of_week === dayIndex);

  return { entries, loading, addEntry, updateEntry, deleteEntry, getEntriesForDay, DAYS };
}

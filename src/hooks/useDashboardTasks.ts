import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export interface DashboardTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  energyRequired: 'high' | 'medium' | 'low';
  deadline?: string;
  gtd_status: string;
  source: 'gtd' | 'habit';
  category?: string;
  description?: string;
  completed?: boolean;
  habit_id?: string;
  isOverdue?: boolean;
}

export interface HabitWithStatus {
  id: string;
  name: string;
  category: string;
  frequency: string;
  completedToday: boolean;
  streak: number;
}

export interface DashboardData {
  tasks: DashboardTask[];
  habits: HabitWithStatus[];
  isLoading: boolean;
  completedToday: number;
  totalActive: number;
  refetch: () => void;
  completeTask: (taskId: string) => Promise<void>;
  uncompleteTask: (taskId: string) => Promise<void>;
  toggleHabit: (habitId: string, completed: boolean) => Promise<void>;
}

function mapPriorityToEnergy(priority: string): 'high' | 'medium' | 'low' {
  if (priority === 'high') return 'high';
  if (priority === 'medium') return 'medium';
  return 'low';
}

export function useDashboardTasks(): DashboardData {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [habits, setHabits] = useState<HabitWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(0);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const now = new Date();

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch all in parallel
      const [tasksRes, habitsRes, habitLogsRes, completedTodayRes] = await Promise.all([
        // Active GTD tasks
        supabase
          .from('cards')
          .select('card_id, title, description, priority, deadline, gtd_status, created_at')
          .eq('user_id', user.id)
          .eq('type', 'task')
          .neq('status', 'completed')
          .neq('status', 'reject')
          .is('completed_at', null)
          .order('created_at', { ascending: false }),
        // Active habits
        supabase
          .from('habits')
          .select('id, name, category, frequency, start_date, created_at')
          .eq('user_id', user.id)
          .eq('archived', false),
        // Today's habit logs
        supabase
          .from('habit_logs')
          .select('habit_id, completed')
          .eq('date_string', todayStr),
        // Completed tasks today
        supabase
          .from('cards')
          .select('card_id')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', `${todayStr}T00:00:00`),
      ]);

      // Process GTD tasks
      const gtdTasks: DashboardTask[] = (tasksRes.data || [])
        .filter((t) => t.title && t.title.trim())
        .map((t) => {
          const deadline = t.deadline ? new Date(t.deadline) : undefined;
          const isOverdue = deadline ? deadline < now : false;
          return {
            id: t.card_id,
            title: t.title,
            priority: (t.priority || 'medium') as 'high' | 'medium' | 'low',
            energyRequired: mapPriorityToEnergy(t.priority || 'medium'),
            deadline: t.deadline ? format(new Date(t.deadline), 'MMM d') : undefined,
            gtd_status: t.gtd_status || 'LATER',
            source: 'gtd' as const,
            description: t.description || undefined,
            isOverdue,
          };
        });

      // Process habits as tasks
      const todayLogs = new Map(
        (habitLogsRes.data || []).map((l) => [l.habit_id, l.completed])
      );

      const habitTasks: DashboardTask[] = (habitsRes.data || []).map((h) => ({
        id: `habit-${h.id}`,
        title: h.name,
        priority: 'medium' as const,
        energyRequired: 'low' as const,
        gtd_status: 'NOW',
        source: 'habit' as const,
        category: h.category || 'General',
        completed: todayLogs.get(h.id) || false,
        habit_id: h.id,
      }));

      // Process habit streaks
      const habitsWithStatus: HabitWithStatus[] = (habitsRes.data || []).map((h) => ({
        id: h.id,
        name: h.name,
        category: h.category || 'General',
        frequency: h.frequency,
        completedToday: todayLogs.get(h.id) || false,
        streak: 0, // We'll calculate this separately if needed
      }));

      setTasks([...gtdTasks, ...habitTasks]);
      setHabits(habitsWithStatus);
      setCompletedToday(completedTodayRes.data?.length || 0);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, todayStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards', filter: `user_id=eq.${user.id}` }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${user.id}` }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_logs' }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadData]);

  const completeTask = useCallback(async (taskId: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setCompletedToday((prev) => prev + 1);

    const { error } = await supabase
      .from('cards')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('card_id', taskId);

    if (error) {
      console.error('Failed to complete task:', error);
      loadData();
    }
  }, [loadData]);

  const uncompleteTask = useCallback(async (taskId: string) => {
    setCompletedToday((prev) => Math.max(0, prev - 1));

    const { error } = await supabase
      .from('cards')
      .update({ status: 'pending', completed_at: null })
      .eq('card_id', taskId);

    if (error) {
      console.error('Failed to uncomplete task:', error);
    }
    loadData();
  }, [loadData]);

  const toggleHabit = useCallback(async (habitId: string, completed: boolean) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.habit_id === habitId ? { ...t, completed } : t
      )
    );
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, completedToday: completed } : h
      )
    );

    if (completed) {
      const { error } = await supabase
        .from('habit_logs')
        .upsert(
          { habit_id: habitId, date_string: todayStr, completed: true },
          { onConflict: 'habit_id,date_string' }
        );
      if (error) {
        console.error('Failed to log habit:', error);
        loadData();
      }
    } else {
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('date_string', todayStr);
      if (error) {
        console.error('Failed to unlog habit:', error);
        loadData();
      }
    }
  }, [todayStr, loadData]);

  return {
    tasks,
    habits,
    isLoading,
    completedToday,
    totalActive: tasks.filter((t) => t.source === 'gtd').length,
    refetch: loadData,
    completeTask,
    uncompleteTask,
    toggleHabit,
  };
}

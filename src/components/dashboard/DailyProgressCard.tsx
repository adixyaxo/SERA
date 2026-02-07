import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Target, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { HabitWithStatus } from '@/hooks/useDashboardTasks';
import { cn } from '@/lib/utils';

interface DailyProgressCardProps {
  completedToday: number;
  totalActive: number;
  habits: HabitWithStatus[];
  onToggleHabit: (habitId: string, completed: boolean) => Promise<void>;
}

export function DailyProgressCard({
  completedToday,
  totalActive,
  habits,
  onToggleHabit,
}: DailyProgressCardProps) {
  const habitsCompleted = habits.filter((h) => h.completedToday).length;
  const habitsTotal = habits.length;
  const habitProgress = habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-medium">Daily Progress</h3>
          <p className="text-xs text-muted-foreground">Tasks & habits today</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-accent/5 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <CheckCircle2 className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xl font-semibold">{completedToday}</p>
          <p className="text-[11px] text-muted-foreground">Tasks done</p>
        </div>
        <div className="p-3 rounded-xl bg-primary/5 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-semibold">{habitsCompleted}/{habitsTotal}</p>
          <p className="text-[11px] text-muted-foreground">Habits</p>
        </div>
      </div>

      {/* Habit Progress */}
      {habitsTotal > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Habit streak</span>
            <span className="font-medium text-accent">{habitProgress}%</span>
          </div>
          <Progress value={habitProgress} className="h-2" />
        </div>
      )}

      {/* Habit Checklist */}
      {habits.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium">Today's Habits</p>
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => onToggleHabit(habit.id, !habit.completedToday)}
              className={cn(
                'w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all',
                habit.completedToday
                  ? 'bg-accent/5 opacity-60'
                  : 'bg-muted/20 hover:bg-muted/40'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                habit.completedToday
                  ? 'bg-accent border-accent'
                  : 'border-border/60 hover:border-accent'
              )}>
                {habit.completedToday && (
                  <CheckCircle2 className="w-3 h-3 text-accent-foreground" />
                )}
              </div>
              <span className={cn(
                'text-sm flex-1',
                habit.completedToday && 'line-through text-muted-foreground'
              )}>
                {habit.name}
              </span>
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
                {habit.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

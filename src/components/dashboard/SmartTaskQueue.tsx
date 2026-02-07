import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Brain, Coffee, ArrowUp, ArrowDown, Minus,
  Check, Undo2, Calendar, Tag, ListTodo, Repeat,
  AlertTriangle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DashboardTask } from '@/hooks/useDashboardTasks';
import { toast } from 'sonner';

interface SmartTaskQueueProps {
  tasks: DashboardTask[];
  currentEnergyLevel: 'high' | 'medium' | 'low';
  onCompleteTask: (taskId: string) => Promise<void>;
  onUncompleteTask: (taskId: string) => Promise<void>;
  onToggleHabit: (habitId: string, completed: boolean) => Promise<void>;
}

type FilterTab = 'all' | 'today' | 'overdue' | 'habits';

const energyConfig = {
  high: { icon: Zap, label: 'High Energy', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  medium: { icon: Brain, label: 'Medium Energy', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  low: { icon: Coffee, label: 'Low Energy', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
};

const priorityConfig = {
  high: { icon: ArrowUp, color: 'text-red-400', label: 'High' },
  medium: { icon: Minus, color: 'text-yellow-500', label: 'Med' },
  low: { icon: ArrowDown, color: 'text-muted-foreground', label: 'Low' },
};

export function SmartTaskQueue({
  tasks,
  currentEnergyLevel,
  onCompleteTask,
  onUncompleteTask,
  onToggleHabit,
}: SmartTaskQueueProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(new Set());

  const currentConfig = energyConfig[currentEnergyLevel];
  const CurrentIcon = currentConfig.icon;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'habits') return task.source === 'habit';
    if (activeFilter === 'overdue') return task.isOverdue && task.source === 'gtd';
    if (activeFilter === 'today') return task.gtd_status === 'NOW' || task.source === 'habit';
    return true;
  });

  // Sort: energy match first, then by priority, then habits last if not in habit tab
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed habits at bottom
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    // Overdue first
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    // Energy match
    if (a.energyRequired === currentEnergyLevel && b.energyRequired !== currentEnergyLevel) return -1;
    if (b.energyRequired === currentEnergyLevel && a.energyRequired !== currentEnergyLevel) return 1;
    // Priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const overdueCount = tasks.filter((t) => t.isOverdue && t.source === 'gtd').length;
  const habitsTotal = tasks.filter((t) => t.source === 'habit').length;
  const habitsCompleted = tasks.filter((t) => t.source === 'habit' && t.completed).length;

  const handleComplete = async (task: DashboardTask) => {
    if (task.source === 'habit' && task.habit_id) {
      await onToggleHabit(task.habit_id, !task.completed);
      toast.success(task.completed ? 'Habit unchecked' : 'Habit completed! 🎯');
    } else {
      setRecentlyCompleted((prev) => new Set(prev).add(task.id));
      await onCompleteTask(task.id);
      toast.success('Task completed! ✅', {
        action: {
          label: 'Undo',
          onClick: async () => {
            await onUncompleteTask(task.id);
            setRecentlyCompleted((prev) => {
              const next = new Set(prev);
              next.delete(task.id);
              return next;
            });
          },
        },
      });
    }
  };

  const filters: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today', count: tasks.filter((t) => t.gtd_status === 'NOW' || t.source === 'habit').length },
    { key: 'overdue', label: 'Overdue', count: overdueCount },
    { key: 'habits', label: 'Habits', count: habitsTotal },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', currentConfig.bg)}>
            <CurrentIcon className={cn('w-5 h-5', currentConfig.color)} />
          </div>
          <div>
            <h3 className="font-medium text-base">Smart Task Queue</h3>
            <p className="text-xs text-muted-foreground">
              {sortedTasks.length} tasks • {currentConfig.label.toLowerCase()} right now
            </p>
          </div>
        </div>
        {habitsTotal > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Habits</p>
            <p className="text-sm font-semibold text-accent">{habitsCompleted}/{habitsTotal}</p>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-muted/30">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              activeFilter === f.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {f.label}
            {f.count !== undefined && f.count > 0 && (
              <span className={cn(
                'px-1.5 py-0 rounded-full text-[10px]',
                f.key === 'overdue' && f.count > 0
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-muted text-muted-foreground'
              )}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {sortedTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground"
            >
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {activeFilter === 'overdue' ? 'No overdue tasks! 🎉' : 'No tasks to show'}
              </p>
            </motion.div>
          ) : (
            sortedTasks.map((task, index) => {
              const isHabit = task.source === 'habit';
              const isCompleted = isHabit ? task.completed : recentlyCompleted.has(task.id);
              const isRecommended = task.energyRequired === currentEnergyLevel && !isCompleted;
              const PriorityIcon = priorityConfig[task.priority].icon;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isCompleted ? 0.5 : 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    'group flex items-center gap-3 p-3 rounded-xl transition-all',
                    isCompleted && 'line-through decoration-muted-foreground/50',
                    isRecommended
                      ? `${currentConfig.bg} ${currentConfig.border} border`
                      : task.isOverdue
                      ? 'bg-destructive/5 border border-destructive/20'
                      : 'bg-muted/20 hover:bg-muted/40'
                  )}
                >
                  {/* Completion Button */}
                  <button
                    onClick={() => handleComplete(task)}
                    className={cn(
                      'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                      isCompleted
                        ? 'bg-accent border-accent'
                        : isHabit
                        ? 'border-accent/50 hover:border-accent hover:bg-accent/10'
                        : 'border-border/60 hover:border-accent hover:bg-accent/10'
                    )}
                  >
                    {isCompleted && <Check className="w-3 h-3 text-accent-foreground" />}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        isCompleted && 'text-muted-foreground'
                      )}>
                        {task.title}
                      </p>
                      {isRecommended && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent/20 text-accent shrink-0">
                          Best fit
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      {/* Source badge */}
                      <span className="flex items-center gap-1">
                        {isHabit ? (
                          <><Repeat className="w-3 h-3" /> Habit</>
                        ) : (
                          <><ListTodo className="w-3 h-3" /> {task.gtd_status}</>
                        )}
                      </span>
                      {task.deadline && (
                        <>
                          <span>•</span>
                          <span className={cn(
                            'flex items-center gap-1',
                            task.isOverdue && 'text-destructive font-medium'
                          )}>
                            {task.isOverdue && <AlertTriangle className="w-3 h-3" />}
                            <Calendar className="w-3 h-3" />
                            {task.deadline}
                          </span>
                        </>
                      )}
                      {task.category && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {task.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Priority indicator */}
                  {!isHabit && (
                    <PriorityIcon className={cn('w-4 h-4 shrink-0', priorityConfig[task.priority].color)} />
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <div className="flex gap-3 text-xs text-muted-foreground">
          {Object.entries(energyConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="flex items-center gap-1">
                <Icon className={cn('w-3 h-3', config.color)} />
                <span className="capitalize">{key}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">
            GTD <span className="font-medium text-foreground">{tasks.filter((t) => t.source === 'gtd').length}</span>
          </span>
          <span className="text-muted-foreground/30">|</span>
          <span className="text-[11px] text-muted-foreground">
            Habits <span className="font-medium text-foreground">{habitsTotal}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

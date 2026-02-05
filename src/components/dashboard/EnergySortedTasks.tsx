import { motion } from "framer-motion";
import { Zap, Brain, Coffee, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { EnergyWindow } from "@/hooks/useCalibration";

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  energyRequired: 'high' | 'medium' | 'low';
  deadline?: string;
  gtd_status?: string;
}

interface EnergySortedTasksProps {
  tasks: Task[];
  currentEnergyLevel: 'high' | 'medium' | 'low';
  energyWindows?: EnergyWindow;
}

const energyConfig = {
  high: {
    icon: Zap,
    label: 'High Energy',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  medium: {
    icon: Brain,
    label: 'Medium Energy',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  low: {
    icon: Coffee,
    label: 'Low Energy',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
  },
};

const priorityConfig = {
  high: { icon: ArrowUp, color: 'text-red-400' },
  medium: { icon: Minus, color: 'text-yellow-500' },
  low: { icon: ArrowDown, color: 'text-muted-foreground' },
};

export function EnergySortedTasks({ tasks, currentEnergyLevel, energyWindows }: EnergySortedTasksProps) {
  // Sort tasks to show matching energy level first
  const sortedTasks = [...tasks].sort((a, b) => {
    // Prioritize tasks that match current energy level
    if (a.energyRequired === currentEnergyLevel && b.energyRequired !== currentEnergyLevel) return -1;
    if (b.energyRequired === currentEnergyLevel && a.energyRequired !== currentEnergyLevel) return 1;
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const currentConfig = energyConfig[currentEnergyLevel];
  const CurrentIcon = currentConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 space-y-4"
    >
      {/* Header with current energy indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${currentConfig.bg} flex items-center justify-center`}>
            <CurrentIcon className={`w-5 h-5 ${currentConfig.color}`} />
          </div>
          <div>
            <h3 className="font-medium">Smart Task Queue</h3>
            <p className="text-xs text-muted-foreground">
              Sorted for your {currentConfig.label.toLowerCase()} right now
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${currentConfig.bg} ${currentConfig.color}`}>
          {currentConfig.label}
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks to show</p>
          </div>
        ) : (
          sortedTasks.map((task, index) => {
            const taskEnergy = energyConfig[task.energyRequired];
            const TaskEnergyIcon = taskEnergy.icon;
            const PriorityIcon = priorityConfig[task.priority].icon;
            const isRecommended = task.energyRequired === currentEnergyLevel;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isRecommended
                    ? `${currentConfig.bg} ${currentConfig.border} border`
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                {/* Energy indicator */}
                <div className={`w-8 h-8 rounded-lg ${taskEnergy.bg} flex items-center justify-center`}>
                  <TaskEnergyIcon className={`w-4 h-4 ${taskEnergy.color}`} />
                </div>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium truncate ${isRecommended ? '' : 'text-muted-foreground'}`}>
                      {task.title}
                    </p>
                    {isRecommended && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{task.gtd_status?.toLowerCase() || 'next'}</span>
                    {task.deadline && (
                      <>
                        <span>•</span>
                        <span>{task.deadline}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <PriorityIcon className={`w-4 h-4 ${priorityConfig[task.priority].color}`} />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Energy legend */}
      <div className="flex justify-center gap-4 pt-2 text-xs text-muted-foreground">
        {Object.entries(energyConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-1">
              <Icon className={`w-3 h-3 ${config.color}`} />
              <span className="capitalize">{key}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

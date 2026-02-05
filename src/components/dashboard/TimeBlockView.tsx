import { motion } from "framer-motion";
import { Clock, Zap, Coffee, Moon, Brain, ChevronRight } from "lucide-react";
import { UserCalibration, EnergyWindow } from "@/hooks/useCalibration";

interface TimeBlockViewProps {
  calibration: UserCalibration;
  tasks?: Array<{
    id: string;
    title: string;
    duration: number;
    energyRequired: 'high' | 'medium' | 'low';
    startHour?: number;
  }>;
}

const getEnergyIcon = (level: 'high' | 'medium' | 'low') => {
  switch (level) {
    case 'high': return Zap;
    case 'medium': return Brain;
    case 'low': return Coffee;
  }
};

const getEnergyColor = (level: 'high' | 'medium' | 'low') => {
  switch (level) {
    case 'high': return 'from-green-500 to-emerald-500';
    case 'medium': return 'from-yellow-500 to-orange-500';
    case 'low': return 'from-blue-400 to-cyan-500';
  }
};

export function TimeBlockView({ calibration, tasks = [] }: TimeBlockViewProps) {
  const currentHour = new Date().getHours();
  
  // Generate time blocks based on energy windows
  const generateBlocks = () => {
    const blocks: Array<{
      startHour: number;
      endHour: number;
      energy: 'high' | 'medium' | 'low';
      label: string;
      tasks: typeof tasks;
    }> = [];

    // Deep work block
    blocks.push({
      startHour: calibration.deep_work_start,
      endHour: calibration.deep_work_end,
      energy: 'high',
      label: 'Deep Work',
      tasks: tasks.filter(t => t.energyRequired === 'high'),
    });

    // Slump block
    blocks.push({
      startHour: calibration.slump_start,
      endHour: calibration.slump_end,
      energy: 'low',
      label: 'Admin / Recharge',
      tasks: tasks.filter(t => t.energyRequired === 'low'),
    });

    // Evening block
    if (calibration.chronotype === 'night_owl') {
      blocks.push({
        startHour: 19,
        endHour: 23,
        energy: 'high',
        label: 'Evening Peak',
        tasks: [],
      });
    }

    return blocks.sort((a, b) => a.startHour - b.startHour);
  };

  const blocks = generateBlocks();
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Today's Timeline</h3>
            <p className="text-xs text-muted-foreground">
              Energy-aware blocks • {calibration.chronotype?.replace('_', ' ')}
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Now: {formatHour(currentHour)}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Time axis */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        {/* Blocks */}
        <div className="space-y-4 pl-4">
          {blocks.map((block, index) => {
            const Icon = getEnergyIcon(block.energy);
            const isActive = currentHour >= block.startHour && currentHour < block.endHour;
            const isPast = currentHour >= block.endHour;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${isPast ? 'opacity-50' : ''}`}
              >
                {/* Time marker */}
                <div className="absolute left-0 top-3 flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      isActive
                        ? 'bg-primary border-primary'
                        : 'bg-background border-muted-foreground'
                    }`}
                  />
                </div>

                {/* Block content */}
                <div className="ml-8">
                  <div className="text-xs text-muted-foreground mb-1">
                    {formatHour(block.startHour)} - {formatHour(block.endHour)}
                  </div>
                  
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${getEnergyColor(block.energy)} bg-opacity-10 border-l-4 ${
                      isActive ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, var(--${block.energy === 'high' ? 'green' : block.energy === 'medium' ? 'yellow' : 'blue'}-500) 0%, transparent 100%)`,
                      opacity: 0.1,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getEnergyColor(block.energy)} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{block.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          {block.energy === 'high' && 'High-focus tasks'}
                          {block.energy === 'medium' && 'Regular tasks'}
                          {block.energy === 'low' && 'Light tasks, emails, breaks'}
                        </p>
                      </div>
                      {isActive && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-primary"
                        />
                      )}
                    </div>

                    {/* Tasks in this block */}
                    {block.tasks.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {block.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-sm flex-1">{task.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {task.duration}m
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Wind down indicator */}
          <div className="relative opacity-60">
            <div className="absolute left-0 top-3 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-muted bg-background" />
            </div>
            <div className="ml-8">
              <div className="text-xs text-muted-foreground mb-1">
                {calibration.wind_down_time || '22:00'}
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30">
                <Moon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Wind down</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

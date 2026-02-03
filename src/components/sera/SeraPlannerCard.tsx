import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Target,
  Clock,
  Loader2,
  RefreshCw,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSeraPlanner } from '@/hooks/useSeraPlanner';
import { cn } from '@/lib/utils';

export function SeraPlannerCard() {
  const { plan, isLoading, analyzeTasks } = useSeraPlanner();

  // Auto-analyze on mount
  useEffect(() => {
    analyzeTasks();
  }, []);

  const workloadConfig = {
    light: {
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
      label: 'Light'
    },
    moderate: {
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      label: 'Balanced'
    },
    heavy: {
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      label: 'Heavy'
    },
    overloaded: {
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      label: 'Overloaded'
    },
  };

  const workloadKey = plan?.analysis?.workload || 'moderate';
  const workload = workloadConfig[workloadKey as keyof typeof workloadConfig] || workloadConfig.moderate;

  return (
    <motion.div
      className="glass rounded-3xl p-6 animate-fade-in w-full"
      layout
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-medium">AI Planner</h3>
            <p className="text-xs text-muted-foreground">Smart insights</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={analyzeTasks}
          disabled={isLoading}
          className="h-9 w-9 rounded-lg hover:bg-accent/10"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {/* Loading State */}
        {isLoading && !plan && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="relative mx-auto w-12 h-12 mb-3">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accent/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <Brain className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Analyzing your tasks...</p>
          </motion.div>
        )}

        {/* Content */}
        {plan && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Workload Indicator */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Current Workload</span>
              </div>
              <Badge
                variant="outline"
                className={cn("px-3 py-0.5 text-xs font-medium", workload.color)}
              >
                {workload.label}
              </Badge>
            </div>

            {/* Today's Focus */}
            {plan.today_focus && plan.today_focus.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-accent">
                  <Target className="w-4 h-4" />
                  <span>Today's Focus</span>
                </div>
                <div className="grid gap-2">
                  {plan.today_focus.slice(0, 2).map((focus, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm text-muted-foreground bg-accent/5 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-accent/60" />
                        <span className="capitalize font-medium text-foreground">
                          {focus.suggested_time}
                        </span>
                      </div>
                      <span className="text-xs opacity-70">{focus.duration_estimate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Tip */}
            {plan.recommendations && plan.recommendations.length > 0 && (
              <div className="pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500/80" />
                  <span className="text-muted-foreground">Strategic Tip</span>
                </div>
                <p className="text-sm text-muted-foreground/80 leading-relaxed italic">
                  "{plan.recommendations[0]?.suggestion}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
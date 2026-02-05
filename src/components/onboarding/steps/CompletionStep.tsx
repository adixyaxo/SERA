import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Zap, Brain, Calendar } from "lucide-react";
import { UserCalibration } from "@/hooks/useCalibration";

interface CompletionStepProps {
  calibration: Partial<UserCalibration>;
  onFinish: () => void;
}

export function CompletionStep({ calibration, onFinish }: CompletionStepProps) {
  const insights = [
    {
      icon: Brain,
      label: 'Your Profile',
      value: `${calibration.chronotype?.replace('_', ' ')} × ${calibration.methodology?.replace('_', ' ')}`,
    },
    {
      icon: Zap,
      label: 'Peak Hours',
      value: `${calibration.deep_work_start}:00 - ${calibration.deep_work_end}:00`,
    },
    {
      icon: Calendar,
      label: 'Max Focus',
      value: `${calibration.max_focus_hours} hours/day`,
    },
  ];

  return (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative w-32 h-32 mx-auto"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Sparkles className="w-12 h-12 text-primary" />
          </motion.div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-light"
        >
          Calibration Complete!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground max-w-md mx-auto"
        >
          SERA is now tuned to your unique rhythm and preferences
        </motion.p>
      </div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 max-w-md mx-auto space-y-4"
      >
        <h3 className="font-medium text-left">Your Digital Twin Profile</h3>
        <div className="space-y-3">
          {insights.map(({ icon: Icon, label, value }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium capitalize">{value}</p>
              </div>
              <Check className="w-4 h-4 text-green-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <p className="text-sm text-muted-foreground">
          Your dashboard is now personalized based on your {calibration.methodology?.replace('_', ' ')} workflow
        </p>
        
        <Button
          size="lg"
          onClick={onFinish}
          className="px-10 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Enter Your Dashboard
          </motion.span>
        </Button>
      </motion.div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Clock, Mic } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  userName?: string;
}

export function WelcomeStep({ onNext, userName }: WelcomeStepProps) {
  const features = [
    { icon: Brain, label: "Learns your rhythm", delay: 0.2 },
    { icon: Clock, label: "Adapts to your schedule", delay: 0.3 },
    { icon: Mic, label: "Voice-first interaction", delay: 0.4 },
  ];

  return (
    <div className="text-center space-y-8">
      {/* Animated SERA icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
      >
        <Sparkles className="w-12 h-12 text-primary-foreground" />
      </motion.div>

      <div className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-light tracking-tight"
        >
          Welcome{userName ? `, ${userName}` : ""}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-xl text-muted-foreground max-w-md mx-auto"
        >
          Let's calibrate SERA to understand your unique productivity DNA
        </motion.p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-4">
        {features.map(({ icon: Icon, label, delay }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm"
          >
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{label}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          size="lg"
          onClick={onNext}
          className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          Begin Calibration
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="ml-2"
          >
            →
          </motion.span>
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-muted-foreground"
      >
        This will take about 2-3 minutes
      </motion.p>
    </div>
  );
}

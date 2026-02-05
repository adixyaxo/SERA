import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Clock, AlertTriangle, Check, Split, MessageCircle } from "lucide-react";

interface ScenarioStepProps {
  onComplete: (response: string) => void;
  onBack: () => void;
}

const scenarios = [
  {
    id: 'push',
    icon: Clock,
    label: 'Push to Later',
    desc: 'Move the study session to your 7:00 PM slot',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'split',
    icon: Split,
    label: 'Split It Up',
    desc: 'Break it into two 30-minute blocks tomorrow',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'ask',
    icon: MessageCircle,
    label: 'Ask Me Later',
    desc: "Notify me once I'm home and let me decide",
    color: 'from-green-500 to-emerald-500',
  },
];

export function ScenarioStep({ onComplete, onBack }: ScenarioStepProps) {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedResponse(id);
    setTimeout(() => setShowConfirmation(true), 300);
  };

  const handleConfirm = () => {
    if (selectedResponse) {
      onComplete(selectedResponse);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-light"
        >
          Quick Stress Test
        </motion.h2>
        <p className="text-muted-foreground">
          Let's see how you prefer SERA to handle conflicts
        </p>
      </div>

      {/* Scenario Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-3xl p-8 space-y-6 border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent"
      >
        {/* Notification Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="w-3 h-3" />
              <span>4:05 PM</span>
            </div>
            <h3 className="text-lg font-medium">Schedule Conflict Detected</h3>
          </div>
        </div>

        {/* Scenario Description */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
          <Car className="w-8 h-8 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Current situation:</p>
            <p className="font-medium">
              You're stuck in traffic. Your <span className="text-primary">4:30 PM Study Session</span> is at risk.
            </p>
          </div>
        </div>

        {/* SERA Message */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative pl-12"
          >
            <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-primary border-2 border-background" />
            <div className="glass p-4 rounded-2xl">
              <p className="text-sm font-medium text-primary mb-2">SERA</p>
              <p className="text-muted-foreground">
                "I see you're running late. How would you like me to handle your study session?"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Response Options */}
        <div className="grid gap-3 pt-4">
          {scenarios.map(({ id, icon: Icon, label, desc, color }, index) => (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(id)}
              disabled={showConfirmation}
              className={`relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden ${
                selectedResponse === id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground bg-card/50'
              }`}
            >
              {selectedResponse === id && (
                <motion.div
                  layoutId="selected"
                  className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10`}
                />
              )}
              <div className="relative flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{label}</h4>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                {selectedResponse === id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Confirmation */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl p-6 text-center space-y-4 border border-green-500/30"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Perfect!</h3>
              <p className="text-sm text-muted-foreground">
                SERA now knows how you prefer to handle schedule conflicts
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedResponse}
          className="px-8"
        >
          Complete Setup →
        </Button>
      </div>
    </div>
  );
}

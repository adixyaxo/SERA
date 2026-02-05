import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Inbox, LayoutGrid, Zap, Timer, Leaf, Check } from "lucide-react";
import { Methodology } from "@/hooks/useCalibration";

interface MethodologyStepProps {
  onNext: (data: { methodology: Methodology; open_loop_handling: string; buffer_minutes: number }) => void;
  onBack: () => void;
  initialData?: {
    methodology?: Methodology;
    open_loop_handling?: string;
    buffer_minutes?: number;
  };
}

const methodologies = [
  {
    value: 'gtd' as Methodology,
    icon: Inbox,
    label: 'GTD',
    desc: 'Capture → Clarify → Organize',
    preview: 'SERA will show a prominent Quick Capture inbox and context-based task views.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    value: 'time_blocking' as Methodology,
    icon: LayoutGrid,
    label: 'Time Blocking',
    desc: 'Dedicated slots for each task',
    preview: 'SERA will display a vertical timeline with color-coded blocks aligned to your energy.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    value: 'nuke_the_day' as Methodology,
    icon: Zap,
    label: 'Nuke the Day',
    desc: 'Aggressive task clearing',
    preview: 'SERA will prioritize your most impactful tasks and push you to complete them fast.',
    color: 'from-orange-500 to-red-500',
  },
  {
    value: 'pomodoro' as Methodology,
    icon: Timer,
    label: 'Pomodoro',
    desc: '25-min focus intervals',
    preview: 'SERA will show a focus timer and track your Pomodoro sessions automatically.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    value: 'organic' as Methodology,
    icon: Leaf,
    label: 'Organic',
    desc: 'Flexible guidance',
    preview: 'SERA will gently remind you of tasks without strict structure.',
    color: 'from-teal-500 to-cyan-500',
  },
];

const bufferOptions = [
  { value: 0, label: 'Back-to-back is fine' },
  { value: 5, label: '5 min breather' },
  { value: 10, label: '10 min buffer' },
  { value: 15, label: '15 min transition' },
];

export function MethodologyStep({ onNext, onBack, initialData }: MethodologyStepProps) {
  const [methodology, setMethodology] = useState<Methodology>(initialData?.methodology || 'organic');
  const [openLoopHandling, setOpenLoopHandling] = useState(initialData?.open_loop_handling || 'capture_later');
  const [bufferMinutes, setBufferMinutes] = useState(initialData?.buffer_minutes || 5);

  const selectedMethod = methodologies.find(m => m.value === methodology);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-light"
        >
          Your Productivity Language
        </motion.h2>
        <p className="text-muted-foreground">
          SERA adapts its interface and suggestions to match your workflow
        </p>
      </div>

      {/* Methodology Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {methodologies.map(({ value, icon: Icon, label, desc, color }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMethodology(value)}
            className={`relative p-5 rounded-2xl border-2 transition-all text-left overflow-hidden ${
              methodology === value
                ? 'border-primary bg-card'
                : 'border-border bg-card/50 hover:border-muted-foreground'
            }`}
          >
            {methodology === value && (
              <motion.div
                layoutId="selectedMethod"
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`}
              />
            )}
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium">{label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              {methodology === value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Adaptive Preview */}
      <AnimatePresence mode="wait">
        {selectedMethod && (
          <motion.div
            key={methodology}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`glass rounded-2xl p-6 border border-primary/20 bg-gradient-to-br ${selectedMethod.color} bg-opacity-5`}
          >
            <h4 className="font-medium text-sm text-primary mb-2">
              How SERA will adapt:
            </h4>
            <p className="text-muted-foreground">{selectedMethod.preview}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open Loop Handling */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium">When you capture a thought...</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOpenLoopHandling('capture_later')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              openLoopHandling === 'capture_later'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <h4 className="font-medium">Capture & Sort Later</h4>
            <p className="text-sm text-muted-foreground">Quick dump, organize when ready</p>
          </button>
          <button
            onClick={() => setOpenLoopHandling('prompt_immediately')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              openLoopHandling === 'prompt_immediately'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <h4 className="font-medium">Prompt Immediately</h4>
            <p className="text-sm text-muted-foreground">Ask for category & deadline right away</p>
          </button>
        </div>
      </div>

      {/* Buffer Preference */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium">Between meetings, I need...</h3>
        <div className="flex flex-wrap gap-2">
          {bufferOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setBufferMinutes(value)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                bufferMinutes === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={() => onNext({
            methodology,
            open_loop_handling: openLoopHandling,
            buffer_minutes: bufferMinutes,
          })}
          className="px-8"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}

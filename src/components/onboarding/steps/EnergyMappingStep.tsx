import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Zap, Coffee, Battery } from "lucide-react";
import { EnergyWindow, Chronotype } from "@/hooks/useCalibration";

interface EnergyMappingStepProps {
  onNext: (data: { chronotype: Chronotype; energy_windows: EnergyWindow; deep_work_start: number; deep_work_end: number }) => void;
  onBack: () => void;
  initialData?: {
    chronotype?: Chronotype;
    energy_windows?: EnergyWindow;
    deep_work_start?: number;
    deep_work_end?: number;
  };
}

const chronotypes = [
  { value: 'morning_lark' as Chronotype, icon: Sun, label: 'Morning Lark', desc: 'Peak energy before noon' },
  { value: 'third_bird' as Chronotype, icon: Coffee, label: 'Third Bird', desc: 'Standard midday peak' },
  { value: 'night_owl' as Chronotype, icon: Moon, label: 'Night Owl', desc: 'Peak energy in evening' },
];

const hours = Array.from({ length: 24 }, (_, i) => i);

export function EnergyMappingStep({ onNext, onBack, initialData }: EnergyMappingStepProps) {
  const [chronotype, setChronotype] = useState<Chronotype>(initialData?.chronotype || 'third_bird');
  const [energyWindows, setEnergyWindows] = useState<EnergyWindow>(initialData?.energy_windows || {});
  const [deepWorkStart, setDeepWorkStart] = useState(initialData?.deep_work_start || 9);
  const [deepWorkEnd, setDeepWorkEnd] = useState(initialData?.deep_work_end || 12);
  const [isDragging, setIsDragging] = useState(false);
  const [currentEnergy, setCurrentEnergy] = useState<'high' | 'medium' | 'low'>('high');

  const getDefaultEnergyForHour = useCallback((hour: number, type: Chronotype): 'high' | 'medium' | 'low' => {
    if (type === 'morning_lark') {
      if (hour >= 6 && hour < 12) return 'high';
      if (hour >= 12 && hour < 15) return 'medium';
      return 'low';
    } else if (type === 'night_owl') {
      if (hour >= 18 && hour < 24) return 'high';
      if (hour >= 14 && hour < 18) return 'medium';
      return 'low';
    } else {
      if (hour >= 9 && hour < 12) return 'high';
      if (hour >= 12 && hour < 17) return 'medium';
      return 'low';
    }
  }, []);

  const handleChronotypeChange = (type: Chronotype) => {
    setChronotype(type);
    // Pre-fill energy windows based on chronotype
    const newWindows: EnergyWindow = {};
    hours.forEach(hour => {
      newWindows[hour] = getDefaultEnergyForHour(hour, type);
    });
    setEnergyWindows(newWindows);
    
    // Set default deep work based on chronotype
    if (type === 'morning_lark') {
      setDeepWorkStart(6);
      setDeepWorkEnd(10);
    } else if (type === 'night_owl') {
      setDeepWorkStart(19);
      setDeepWorkEnd(23);
    } else {
      setDeepWorkStart(9);
      setDeepWorkEnd(12);
    }
  };

  const handleHourClick = (hour: number) => {
    setEnergyWindows(prev => ({
      ...prev,
      [hour]: currentEnergy,
    }));
  };

  const handleHourDrag = (hour: number) => {
    if (isDragging) {
      setEnergyWindows(prev => ({
        ...prev,
        [hour]: currentEnergy,
      }));
    }
  };

  const getEnergyColor = (level: 'high' | 'medium' | 'low' | undefined) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-400';
      default: return 'bg-muted';
    }
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-light"
        >
          Map Your Energy Rhythm
        </motion.h2>
        <p className="text-muted-foreground">
          SERA will schedule demanding tasks during your peak hours
        </p>
      </div>

      {/* Chronotype Selection */}
      <div className="grid grid-cols-3 gap-4">
        {chronotypes.map(({ value, icon: Icon, label, desc }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChronotypeChange(value)}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              chronotype === value
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-muted-foreground'
            }`}
          >
            <Icon className={`w-8 h-8 mb-3 ${chronotype === value ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="font-medium">{label}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Energy Painting Tool */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Fine-tune your energy curve
          </h3>
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setCurrentEnergy(level)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  currentEnergy === level
                    ? `${getEnergyColor(level)} text-white`
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Click or drag across hours to paint your energy levels
        </p>

        {/* 24-hour grid */}
        <div
          className="grid grid-cols-12 gap-1"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {hours.map((hour) => (
            <motion.div
              key={hour}
              whileHover={{ scale: 1.1 }}
              onMouseDown={() => handleHourClick(hour)}
              onMouseEnter={() => handleHourDrag(hour)}
              className={`h-12 rounded-lg cursor-pointer transition-colors ${
                getEnergyColor(energyWindows[hour] || getDefaultEnergyForHour(hour, chronotype))
              } flex items-end justify-center pb-1`}
            >
              <span className="text-[10px] text-white/80 font-medium">
                {hour % 3 === 0 ? formatHour(hour) : ''}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-xs text-muted-foreground">High Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-400" />
            <span className="text-xs text-muted-foreground">Low / Recharge</span>
          </div>
        </div>
      </div>

      {/* Deep Work Window */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Battery className="w-4 h-4 text-primary" />
          Your "Golden Hours" for Deep Work
        </h3>
        <div className="flex items-center gap-4">
          <select
            value={deepWorkStart}
            onChange={(e) => setDeepWorkStart(Number(e.target.value))}
            className="bg-muted rounded-lg px-4 py-2 text-foreground"
          >
            {hours.map((h) => (
              <option key={h} value={h}>{formatHour(h)}</option>
            ))}
          </select>
          <span className="text-muted-foreground">to</span>
          <select
            value={deepWorkEnd}
            onChange={(e) => setDeepWorkEnd(Number(e.target.value))}
            className="bg-muted rounded-lg px-4 py-2 text-foreground"
          >
            {hours.map((h) => (
              <option key={h} value={h}>{formatHour(h)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={() => onNext({
            chronotype,
            energy_windows: energyWindows,
            deep_work_start: deepWorkStart,
            deep_work_end: deepWorkEnd,
          })}
          className="px-8"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}

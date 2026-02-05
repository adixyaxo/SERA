import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, Train, PersonStanding, Home, Clock, AlertTriangle, Plus, X } from "lucide-react";
import { CommuteType, BlackoutHour } from "@/hooks/useCalibration";

interface ConstraintsStepProps {
  onNext: (data: {
    commute: CommuteType;
    commute_duration_minutes: number;
    voice_mode_on_transit: boolean;
    blackout_hours: BlackoutHour[];
    max_focus_hours: number;
  }) => void;
  onBack: () => void;
  initialData?: {
    commute?: CommuteType;
    commute_duration_minutes?: number;
    voice_mode_on_transit?: boolean;
    blackout_hours?: BlackoutHour[];
    max_focus_hours?: number;
  };
}

const commuteTypes = [
  { value: 'walking' as CommuteType, icon: PersonStanding, label: 'Walking' },
  { value: 'driving' as CommuteType, icon: Car, label: 'Driving' },
  { value: 'public_transit' as CommuteType, icon: Train, label: 'Public Transit' },
  { value: 'remote' as CommuteType, icon: Home, label: 'Remote / WFH' },
];

const focusHoursOptions = [3, 4, 5, 6, 7, 8];

export function ConstraintsStep({ onNext, onBack, initialData }: ConstraintsStepProps) {
  const [commute, setCommute] = useState<CommuteType>(initialData?.commute || 'remote');
  const [commuteDuration, setCommuteDuration] = useState(initialData?.commute_duration_minutes || 0);
  const [voiceModeOnTransit, setVoiceModeOnTransit] = useState(initialData?.voice_mode_on_transit ?? true);
  const [blackoutHours, setBlackoutHours] = useState<BlackoutHour[]>(initialData?.blackout_hours || []);
  const [maxFocusHours, setMaxFocusHours] = useState(initialData?.max_focus_hours || 6);
  
  const [newBlackout, setNewBlackout] = useState({ start: 9, end: 17, label: '' });

  const addBlackoutPeriod = () => {
    if (newBlackout.label.trim()) {
      setBlackoutHours([...blackoutHours, { ...newBlackout }]);
      setNewBlackout({ start: 9, end: 17, label: '' });
    }
  };

  const removeBlackoutPeriod = (index: number) => {
    setBlackoutHours(blackoutHours.filter((_, i) => i !== index));
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    return hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-light"
        >
          The Physics of Your Life
        </motion.h2>
        <p className="text-muted-foreground">
          Help SERA understand your real-world constraints
        </p>
      </div>

      {/* Commute Type */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Car className="w-4 h-4 text-primary" />
          How do you get around?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commuteTypes.map(({ value, icon: Icon, label }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCommute(value)}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                commute === value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <Icon className={`w-6 h-6 ${commute === value ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm">{label}</span>
            </motion.button>
          ))}
        </div>

        {commute !== 'remote' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 pt-4"
          >
            <div className="flex items-center gap-4">
              <label className="text-sm text-muted-foreground">Average commute time:</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={commuteDuration}
                  onChange={(e) => setCommuteDuration(Number(e.target.value))}
                  className="w-20"
                  min={0}
                  max={180}
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceModeOnTransit}
                onChange={(e) => setVoiceModeOnTransit(e.target.checked)}
                className="w-5 h-5 rounded border-border"
              />
              <span className="text-sm">Enable Voice-Only mode during transit</span>
            </label>
          </motion.div>
        )}
      </div>

      {/* Blackout Hours */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Recurring "Blackout" Periods
        </h3>
        <p className="text-sm text-muted-foreground">
          Times when you're strictly unavailable for personal tasks (lectures, work blocks, etc.)
        </p>

        {/* Existing blackouts */}
        <div className="space-y-2">
          {blackoutHours.map((period, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="font-medium">{period.label}</span>
                <span className="text-sm text-muted-foreground">
                  {formatHour(period.start)} – {formatHour(period.end)}
                </span>
              </div>
              <button
                onClick={() => removeBlackoutPeriod(index)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add new blackout */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Input
            placeholder="e.g., University Lectures"
            value={newBlackout.label}
            onChange={(e) => setNewBlackout({ ...newBlackout, label: e.target.value })}
            className="flex-1 min-w-[150px]"
          />
          <select
            value={newBlackout.start}
            onChange={(e) => setNewBlackout({ ...newBlackout, start: Number(e.target.value) })}
            className="bg-muted rounded-lg px-3 py-2 text-sm"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{formatHour(i)}</option>
            ))}
          </select>
          <span className="text-muted-foreground">to</span>
          <select
            value={newBlackout.end}
            onChange={(e) => setNewBlackout({ ...newBlackout, end: Number(e.target.value) })}
            className="bg-muted rounded-lg px-3 py-2 text-sm"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{formatHour(i)}</option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={addBlackoutPeriod}
            disabled={!newBlackout.label.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Burnout Guardrail */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Daily Focus Limit (Burnout Guardrail)
        </h3>
        <p className="text-sm text-muted-foreground">
          Maximum high-intensity hours SERA will schedule in a single day
        </p>
        <div className="flex flex-wrap gap-2">
          {focusHoursOptions.map((hours) => (
            <button
              key={hours}
              onClick={() => setMaxFocusHours(hours)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                maxFocusHours === hours
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {hours} hours
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
            commute,
            commute_duration_minutes: commuteDuration,
            voice_mode_on_transit: voiceModeOnTransit,
            blackout_hours: blackoutHours,
            max_focus_hours: maxFocusHours,
          })}
          className="px-8"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}

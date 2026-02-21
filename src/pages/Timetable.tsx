import { useState, useRef, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { FloatingBackground } from "@/components/dashboard/FloatingBackground";
import { useTimetable, TimetableFormData, TimetableEntry } from "@/hooks/useTimetable";
import { motion } from "framer-motion";
import { Plus, MapPin, Repeat, Trash2, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);
const CELL_HEIGHT = 64;
const CELL_HEIGHT_MOBILE = 48;
const COLORS = [
  "#7E9EF9", "#F97066", "#F9A846", "#4ADE80",
  "#A78BFA", "#F472B6", "#38BDF8", "#FBBF24",
];

const formatTime = (t: string) => {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${m} ${ampm}`;
};

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":");
  return parseInt(h) * 60 + parseInt(m);
};

const minutesToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

interface DragState {
  entryId: string;
  startX: number;
  startY: number;
  offsetY: number;
  originalDay: number;
  originalStartMin: number;
  duration: number;
  currentDay: number;
  currentStartMin: number;
  active: boolean;
}

export default function Timetable() {
  const { entries, loading, addEntry, updateEntry, deleteEntry, getEntriesForDay, DAYS } = useTimetable();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<TimetableEntry | null>(null);
  const [mobileDay, setMobileDay] = useState(new Date().getDay());
  const [drag, setDrag] = useState<DragState | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const dayColRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [form, setForm] = useState<TimetableFormData>({
    title: "",
    description: null,
    day_of_week: new Date().getDay(),
    start_time: "09:00",
    end_time: "10:00",
    color: COLORS[0],
    repeat_type: "weekly",
    location: null,
  });

  const openCreate = (day?: number) => {
    setEditEntry(null);
    setForm({
      title: "",
      description: null,
      day_of_week: day ?? new Date().getDay(),
      start_time: "09:00",
      end_time: "10:00",
      color: COLORS[0],
      repeat_type: "weekly",
      location: null,
    });
    setDialogOpen(true);
  };

  const openEdit = (entry: TimetableEntry) => {
    if (drag?.active) return;
    setEditEntry(entry);
    setForm({
      title: entry.title,
      description: entry.description,
      day_of_week: entry.day_of_week,
      start_time: entry.start_time.slice(0, 5),
      end_time: entry.end_time.slice(0, 5),
      color: entry.color,
      repeat_type: entry.repeat_type,
      location: entry.location,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    if (editEntry) {
      await updateEntry(editEntry.id, form);
    } else {
      await addEntry(form);
    }
    setDialogOpen(false);
  };

  // === Drag-and-drop logic ===
  const handleDragStart = useCallback((e: React.PointerEvent, entry: TimetableEntry) => {
    e.preventDefault();
    e.stopPropagation();
    const startMin = timeToMinutes(entry.start_time);
    const endMin = timeToMinutes(entry.end_time);

    setDrag({
      entryId: entry.id,
      startX: e.clientX,
      startY: e.clientY,
      offsetY: 0,
      originalDay: entry.day_of_week,
      originalStartMin: startMin,
      duration: endMin - startMin,
      currentDay: entry.day_of_week,
      currentStartMin: startMin,
      active: false,
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.active && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;

    // Determine which day column we're over
    let newDay = drag.originalDay;
    for (let i = 0; i < 7; i++) {
      const col = dayColRefs.current[i];
      if (col) {
        const rect = col.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          newDay = i;
          break;
        }
      }
    }

    // Calculate new start time based on vertical movement
    const deltaMinutes = Math.round((dy / CELL_HEIGHT) * 60);
    let newStartMin = drag.originalStartMin + deltaMinutes;
    // Snap to 15-minute intervals
    newStartMin = Math.round(newStartMin / 15) * 15;
    // Clamp to grid bounds (6AM to 9PM)
    newStartMin = Math.max(360, Math.min(newStartMin, 21 * 60 - drag.duration));

    setDrag((prev) =>
      prev
        ? { ...prev, active: true, currentDay: newDay, currentStartMin: newStartMin }
        : null
    );
  }, [drag]);

  const handleDragEnd = useCallback(async () => {
    if (!drag) return;
    if (drag.active) {
      const newStart = minutesToTime(drag.currentStartMin);
      const newEnd = minutesToTime(drag.currentStartMin + drag.duration);
      await updateEntry(drag.entryId, {
        day_of_week: drag.currentDay,
        start_time: newStart,
        end_time: newEnd,
      });
      toast({ title: "Entry moved", description: `${DAYS[drag.currentDay]} at ${formatTime(newStart)}` });
    }
    setDrag(null);
  }, [drag, updateEntry, toast, DAYS]);

  const renderEntry = (entry: TimetableEntry, compact = false) => {
    const isDragging = drag?.active && drag.entryId === entry.id;
    const startMin = isDragging ? drag.currentStartMin : timeToMinutes(entry.start_time);
    const endMin = isDragging ? drag.currentStartMin + drag.duration : timeToMinutes(entry.end_time);
    const cellH = compact ? CELL_HEIGHT_MOBILE : CELL_HEIGHT;
    const top = ((startMin - 360) / 60) * cellH;
    const height = Math.max(((endMin - startMin) / 60) * cellH, compact ? 24 : 32);

    return (
      <motion.div
        key={entry.id}
        layout={!isDragging}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isDragging ? 0.85 : 1,
          scale: isDragging ? 1.04 : 1,
          boxShadow: isDragging ? "0 8px 30px rgba(0,0,0,0.18)" : "none",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "absolute left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-lg sm:rounded-xl cursor-pointer group overflow-hidden",
          isDragging ? "z-50 ring-2 ring-accent" : "z-10"
        )}
        style={{
          top: `${top}px`,
          height: `${height}px`,
          backgroundColor: entry.color + "22",
          borderLeft: `3px solid ${entry.color}`,
        }}
        onClick={() => openEdit(entry)}
      >
        <div className="p-1 sm:p-2 h-full flex flex-col justify-between relative">
          {/* Drag handle */}
          {!compact && (
            <div
              className="absolute top-0.5 right-0.5 p-0.5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity touch-none"
              onPointerDown={(e) => handleDragStart(e, entry)}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={() => setDrag(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={12} className="text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-foreground truncate pr-4">{entry.title}</p>
            {height > 40 && (
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                {isDragging
                  ? `${formatTime(minutesToTime(drag!.currentStartMin))} - ${formatTime(minutesToTime(drag!.currentStartMin + drag!.duration))}`
                  : `${formatTime(entry.start_time)} - ${formatTime(entry.end_time)}`}
              </p>
            )}
          </div>
          {height > 60 && entry.location && (
            <p className="text-[9px] text-muted-foreground flex items-center gap-0.5 truncate">
              <MapPin size={8} /> {entry.location}
            </p>
          )}
          {entry.repeat_type !== "none" && (
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Repeat size={10} className="text-muted-foreground" />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Ghost preview shown in the target day column during drag
  const renderDragGhost = (dayIdx: number) => {
    if (!drag?.active || drag.currentDay !== dayIdx) return null;
    const entry = entries.find((e) => e.id === drag.entryId);
    if (!entry) return null;

    const top = ((drag.currentStartMin - 360) / 60) * CELL_HEIGHT;
    const height = Math.max((drag.duration / 60) * CELL_HEIGHT, 32);

    return (
      <div
        className="absolute left-1 right-1 rounded-xl z-40 pointer-events-none border-2 border-dashed border-accent/50"
        style={{
          top: `${top}px`,
          height: `${height}px`,
          backgroundColor: entry.color + "10",
        }}
      >
        <div className="p-2">
          <p className="text-[10px] font-medium text-accent truncate">{entry.title}</p>
          <p className="text-[9px] text-muted-foreground">
            {formatTime(minutesToTime(drag.currentStartMin))} - {formatTime(minutesToTime(drag.currentStartMin + drag.duration))}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading timetable...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      <FloatingBackground />
      <Header />

      <main className="pt-24 sm:pt-28 pb-24 sm:pb-16 px-2 sm:px-8 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Title bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-md flex items-center justify-between"
          >
            <div>
              <h1 className="text-xl sm:text-3xl font-light">Weekly Timetable</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {entries.length} scheduled {entries.length === 1 ? "entry" : "entries"}
                {" · "}
                <span className="text-accent">Drag entries to reschedule</span>
              </p>
            </div>
            <Button onClick={() => openCreate()} size="sm" className="rounded-full gap-1">
              <Plus size={16} /> <span className="hidden sm:inline">Add Entry</span>
            </Button>
          </motion.div>

          {/* Mobile day selector */}
          <div className="flex sm:hidden items-center justify-between glass rounded-2xl p-2 bg-background/60">
            <Button variant="ghost" size="icon" onClick={() => setMobileDay((d) => (d === 0 ? 6 : d - 1))}>
              <ChevronLeft size={18} />
            </Button>
            <span className="font-semibold text-sm">{DAYS[mobileDay]}</span>
            <Button variant="ghost" size="icon" onClick={() => setMobileDay((d) => (d === 6 ? 0 : d + 1))}>
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Desktop Week Grid */}
          <div ref={gridRef} className="hidden sm:block glass rounded-3xl bg-background/60 backdrop-blur-md overflow-hidden">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/30">
              <div className="p-2" />
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    "p-3 text-center text-xs font-semibold border-l border-border/20",
                    i === new Date().getDay() && "bg-accent/10 text-accent",
                    drag?.active && drag.currentDay === i && "bg-accent/5"
                  )}
                >
                  {day.slice(0, 3)}
                  <button
                    onClick={() => openCreate(i)}
                    className="ml-1 opacity-0 hover:opacity-100 transition-opacity inline-flex"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[60px_repeat(7,1fr)] overflow-y-auto max-h-[calc(100vh-260px)]">
              {/* Time labels */}
              <div className="relative">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-16 flex items-start justify-end pr-2 pt-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      {hour === 0 ? "12 AM" : hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((_, dayIdx) => (
                <div
                  key={dayIdx}
                  ref={(el) => { dayColRefs.current[dayIdx] = el; }}
                  className={cn(
                    "relative border-l border-border/10",
                    drag?.active && drag.currentDay === dayIdx && "bg-accent/[0.03]"
                  )}
                >
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-border/5 hover:bg-accent/5 transition-colors cursor-pointer"
                      onClick={() => {
                        setForm((f) => ({
                          ...f,
                          day_of_week: dayIdx,
                          start_time: `${String(hour).padStart(2, "0")}:00`,
                          end_time: `${String(hour + 1).padStart(2, "0")}:00`,
                        }));
                        openCreate(dayIdx);
                      }}
                    />
                  ))}
                  {/* Drag ghost preview */}
                  {renderDragGhost(dayIdx)}
                  {/* Entries - hide original during drag if moved to different day */}
                  {getEntriesForDay(dayIdx).map((e) => {
                    if (drag?.active && drag.entryId === e.id && drag.currentDay !== dayIdx) return null;
                    return renderEntry(e);
                  })}
                  {/* Show dragged entry in new day */}
                  {drag?.active && drag.currentDay === dayIdx && drag.originalDay !== dayIdx && (() => {
                    const entry = entries.find((e) => e.id === drag.entryId);
                    return entry ? renderEntry(entry) : null;
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Day View */}
          <div className="sm:hidden glass rounded-2xl bg-background/60 backdrop-blur-md overflow-hidden">
            <div className="relative overflow-y-auto max-h-[calc(100vh-280px)]">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-12 flex items-start border-b border-border/5 cursor-pointer hover:bg-accent/5"
                  onClick={() => {
                    openCreate(mobileDay);
                    setForm((f) => ({
                      ...f,
                      day_of_week: mobileDay,
                      start_time: `${String(hour).padStart(2, "0")}:00`,
                      end_time: `${String(hour + 1).padStart(2, "0")}:00`,
                    }));
                  }}
                >
                  <div className="w-12 shrink-0 text-[10px] text-muted-foreground text-right pr-2 pt-1">
                    {hour === 0 ? "12AM" : hour > 12 ? `${hour - 12}PM` : hour === 12 ? "12PM" : `${hour}AM`}
                  </div>
                  <div className="relative flex-1" />
                </div>
              ))}
              {/* Overlay entries */}
              <div className="absolute top-0 left-12 right-0 bottom-0 pointer-events-none">
                <div className="relative h-full pointer-events-auto">
                  {getEntriesForDay(mobileDay).map((e) => renderEntry(e, true))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass border-border max-w-md mx-2 sm:mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editEntry ? "Edit Entry" : "New Timetable Entry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title (e.g., Math Class)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              placeholder="Description (optional)"
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value || null })}
            />
            <Input
              placeholder="Location (optional)"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value || null })}
            />

            <Select
              value={String(form.day_of_week)}
              onValueChange={(v) => setForm({ ...form, day_of_week: parseInt(v) })}
            >
              <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
              <SelectContent>
                {DAYS.map((d, i) => (
                  <SelectItem key={i} value={String(i)}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Start</label>
                <Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">End</label>
                <Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
              </div>
            </div>

            <Select value={form.repeat_type} onValueChange={(v) => setForm({ ...form, repeat_type: v })}>
              <SelectTrigger>
                <div className="flex items-center gap-2"><Repeat size={14} /><SelectValue /></div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Every week</SelectItem>
                <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                <SelectItem value="none">No repeat</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-transform",
                      form.color === c ? "border-foreground scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setForm({ ...form, color: c })}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {editEntry && (
                <Button variant="destructive" size="sm" className="rounded-full" onClick={async () => { await deleteEntry(editEntry.id); setDialogOpen(false); }}>
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              )}
              <div className="flex-1" />
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button size="sm" className="rounded-full" onClick={handleSubmit}>{editEntry ? "Save" : "Add"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

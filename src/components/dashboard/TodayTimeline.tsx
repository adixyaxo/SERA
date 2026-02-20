import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  color?: string;
  allDay?: boolean;
}

export function TodayTimeline() {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!user) return;

    const loadTimeline = async () => {
      setIsLoading(true);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const { data: eventsData } = await supabase
        .from('events')
        .select('id, title, start_time, end_time, color, all_day')
        .eq('user_id', user.id)
        .gte('start_time', monthStart.toISOString())
        .lte('start_time', monthEnd.toISOString())
        .order('start_time', { ascending: true });

      const timelineItems: TimelineEvent[] = (eventsData || []).map((e) => {
        const startTime = parseISO(e.start_time);
        return {
          id: e.id,
          date: format(startTime, 'MMM d'),
          time: e.all_day ? 'All day' : format(startTime, 'HH:mm'),
          title: e.title,
          color: e.color || undefined,
          allDay: e.all_day || false,
        };
      });

      setEvents(timelineItems);
      setIsLoading(false);
    };

    loadTimeline();
  }, [user, currentMonth]);

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  if (isLoading) {
    return (
      <div className="glass rounded-3xl p-6 animate-pulse">
        <div className="h-5 w-32 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-muted/50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium">Monthly Events</h3>
            <p className="text-xs text-muted-foreground">{events.length} events this month</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMonthChange(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium w-20 text-center">
            {format(currentMonth, 'MMM yyyy')}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMonthChange(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No events this month</p>
          <p className="text-xs mt-1">Schedule events in the Calendar tab</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {events.map((event, index) => {
            const isToday = isSameDay(parseISO(new Date().toISOString()), new Date());
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group"
              >
                <div
                  className="w-1.5 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: event.color || 'hsl(var(--primary))' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {event.date} • {event.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

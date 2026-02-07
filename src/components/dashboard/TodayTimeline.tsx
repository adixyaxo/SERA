import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Brain, Coffee } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, isToday, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  type: 'event' | 'task';
  status: 'completed' | 'active' | 'upcoming';
}

export function TodayTimeline() {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadTimeline = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const [eventsRes, tasksRes] = await Promise.all([
        supabase
          .from('events')
          .select('id, title, start_time, end_time')
          .eq('user_id', user.id)
          .gte('start_time', todayStart.toISOString())
          .lte('start_time', todayEnd.toISOString())
          .order('start_time', { ascending: true }),
        supabase
          .from('cards')
          .select('card_id, title, deadline, gtd_status')
          .eq('user_id', user.id)
          .eq('type', 'task')
          .eq('gtd_status', 'NOW')
          .neq('status', 'completed')
          .is('completed_at', null),
      ]);

      const now = new Date();
      const currentHour = now.getHours();

      const timelineItems: TimelineEvent[] = [];

      // Add events
      (eventsRes.data || []).forEach((e) => {
        const startTime = parseISO(e.start_time);
        const endTime = e.end_time ? parseISO(e.end_time) : null;
        const status: TimelineEvent['status'] = 
          endTime && endTime < now ? 'completed' :
          startTime <= now && (!endTime || endTime > now) ? 'active' : 'upcoming';

        timelineItems.push({
          id: e.id,
          time: format(startTime, 'HH:mm'),
          title: e.title,
          type: 'event',
          status,
        });
      });

      // Add NOW tasks as timeline items (spread across morning/afternoon)
      const nowTasks = tasksRes.data || [];
      const startHour = 9;
      nowTasks.slice(0, 4).forEach((t, i) => {
        const taskHour = startHour + i * 2;
        const status: TimelineEvent['status'] = 
          taskHour < currentHour ? 'completed' :
          taskHour === currentHour ? 'active' : 'upcoming';

        timelineItems.push({
          id: t.card_id,
          time: `${String(taskHour).padStart(2, '0')}:00`,
          title: t.title,
          type: 'task',
          status,
        });
      });

      // Sort by time
      timelineItems.sort((a, b) => a.time.localeCompare(b.time));
      setEvents(timelineItems);
      setIsLoading(false);
    };

    loadTimeline();
  }, [user]);

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
      className="glass rounded-3xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-medium">Today's Timeline</h3>
          <p className="text-xs text-muted-foreground">{events.length} items scheduled</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No events or tasks today</p>
          <p className="text-xs mt-1">Add NOW tasks or schedule events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 group"
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  event.status === 'completed' && 'bg-muted-foreground/30',
                  event.status === 'active' && 'bg-accent animate-pulse',
                  event.status === 'upcoming' && 'bg-border'
                )}
              />
              <div className="text-sm text-muted-foreground font-mono w-14">
                {event.time}
              </div>
              <div
                className={cn(
                  'flex-1 text-sm',
                  event.status === 'active' && 'text-accent font-medium',
                  event.status === 'completed' && 'text-muted-foreground line-through'
                )}
              >
                {event.title}
              </div>
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full',
                event.type === 'event' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
              )}>
                {event.type === 'event' ? 'Event' : 'Task'}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

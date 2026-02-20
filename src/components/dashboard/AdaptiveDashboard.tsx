import { useCalibration } from "@/hooks/useCalibration";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { FloatingBackground } from "@/components/dashboard/FloatingBackground";
import { SeraFAB } from "@/components/sera/SeraFAB";
import { VoiceOverlay } from "@/components/dashboard/VoiceOverlay";
import { QuickCaptureInbox } from "@/components/dashboard/QuickCaptureInbox";
import { TimeBlockView } from "@/components/dashboard/TimeBlockView";
import { TodayTimeline } from "@/components/dashboard/TodayTimeline";
import { SmartTaskQueue } from "@/components/dashboard/SmartTaskQueue";
import { DailyProgressCard } from "@/components/dashboard/DailyProgressCard";
import { FocusModeCard } from "@/components/dashboard/FocusModeCard";
import { GTDWidget } from "@/components/dashboard/GTDWidget";
import { GTDAnalytics } from "@/components/dashboard/GTDAnalytics";
import { SeraPlannerCard } from "@/components/sera/SeraPlannerCard";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardTasks } from "@/hooks/useDashboardTasks";
import { motion } from "framer-motion";

export function AdaptiveDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { calibration, loading } = useCalibration();
  const [currentEnergyLevel, setCurrentEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');

  const {
    tasks,
    habits,
    isLoading: tasksLoading,
    completedToday,
    totalActive,
    completeTask,
    uncompleteTask,
    toggleHabit,
  } = useDashboardTasks();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!loading && calibration && !calibration.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [calibration, loading, navigate]);

  useEffect(() => {
    if (calibration?.energy_windows) {
      const hour = new Date().getHours();
      const energyLevel = calibration.energy_windows[hour] || 'medium';
      setCurrentEnergyLevel(energyLevel);
    }
  }, [calibration]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading your dashboard...</div>
      </div>
    );
  }

  const isGTDMode = calibration?.methodology === 'gtd';
  const isTimeBlockMode = calibration?.methodology === 'time_blocking';

  // Build task data for TimeBlockView
  const timeBlockTasks = tasks
    .filter((t) => t.source === 'gtd')
    .map((t) => ({
      id: t.id,
      title: t.title,
      duration: 30,
      energyRequired: t.energyRequired,
    }));

  return (
    <div className="min-h-screen w-full relative">
      <FloatingBackground />
      <Header />

      <main className="pt-24 sm:pt-28 pb-24 sm:pb-16 px-3 sm:px-8 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Greeting Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-4 sm:p-6 rounded-3xl bg-background/60 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-3xl font-light mb-1">{getGreeting()}</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {totalActive > 0
                    ? `You have ${totalActive} active task${totalActive !== 1 ? 's' : ''} and ${habits.length} habit${habits.length !== 1 ? 's' : ''} today.`
                    : "Your task queue is clear. Time to capture some ideas!"}
                </p>
              </div>
              {completedToday > 0 && (
                <div className="hidden sm:block text-right">
                  <p className="text-2xl font-semibold text-accent">{completedToday}</p>
                  <p className="text-xs text-muted-foreground">done today</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* GTD Mode: Show Quick Capture prominently */}
              {isGTDMode && <QuickCaptureInbox />}

              {/* Time Block Mode: Show Timeline */}
              {isTimeBlockMode && calibration && (
                <TimeBlockView
                  calibration={calibration}
                  tasks={timeBlockTasks}
                />
              )}

              {/* Default: Show today's timeline */}
              {!isGTDMode && !isTimeBlockMode && <TodayTimeline />}

              {/* Smart Task Queue – Real data */}
              <SmartTaskQueue
                tasks={tasks}
                currentEnergyLevel={currentEnergyLevel}
                onCompleteTask={completeTask}
                onUncompleteTask={uncompleteTask}
                onToggleHabit={toggleHabit}
              />

              {/* AI Planner */}
              <SeraPlannerCard />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Daily Progress + Habits */}
              <DailyProgressCard
                completedToday={completedToday}
                totalActive={totalActive}
                habits={habits}
                onToggleHabit={toggleHabit}
              />

              <FocusModeCard />
              <GTDWidget />
              <GTDAnalytics />
            </div>
          </div>
        </div>
      </main>

      <VoiceOverlay />
      <SeraFAB />

      <div className="fixed bottom-2 left-2 text-[0.5rem] text-muted-foreground/50 select-none z-50">
        made by aditya
      </div>
    </div>
  );
}

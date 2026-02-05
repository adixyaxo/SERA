import { useCalibration } from "@/hooks/useCalibration";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { FloatingBackground } from "@/components/dashboard/FloatingBackground";
import { SeraFAB } from "@/components/sera/SeraFAB";
import { VoiceOverlay } from "@/components/dashboard/VoiceOverlay";
import { QuickCaptureInbox } from "@/components/dashboard/QuickCaptureInbox";
import { TimeBlockView } from "@/components/dashboard/TimeBlockView";
import { EnergySortedTasks } from "@/components/dashboard/EnergySortedTasks";
import { TimelineWidget } from "@/components/dashboard/TimelineWidget";
import { FocusModeCard } from "@/components/dashboard/FocusModeCard";
import { GTDWidget } from "@/components/dashboard/GTDWidget";
import { GTDAnalytics } from "@/components/dashboard/GTDAnalytics";
import { SeraPlannerCard } from "@/components/sera/SeraPlannerCard";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// Mock tasks for demo
const mockTasks = [
  { id: "1", title: "Complete project proposal", priority: "high" as const, energyRequired: "high" as const, deadline: "Today", gtd_status: "NOW" },
  { id: "2", title: "Review team feedback", priority: "medium" as const, energyRequired: "medium" as const, deadline: "Tomorrow", gtd_status: "NEXT" },
  { id: "3", title: "Respond to emails", priority: "low" as const, energyRequired: "low" as const, gtd_status: "NEXT" },
  { id: "4", title: "Strategic planning session", priority: "high" as const, energyRequired: "high" as const, deadline: "This week", gtd_status: "NEXT" },
  { id: "5", title: "Update documentation", priority: "low" as const, energyRequired: "low" as const, gtd_status: "LATER" },
];

export function AdaptiveDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { calibration, loading } = useCalibration();
  const [currentEnergyLevel, setCurrentEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check if user needs onboarding
    if (!loading && calibration && !calibration.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [calibration, loading, navigate]);

  // Determine current energy level based on time and calibration
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

  return (
    <div className="min-h-screen w-full relative">
      <FloatingBackground />
      <Header />

      <main className="pt-32 sm:pt-28 pb-24 sm:pb-16 px-4 sm:px-8 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Greeting Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl bg-background/60 backdrop-blur-md"
          >
            <h1 className="text-2xl sm:text-3xl font-light mb-2">{getGreeting()}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {calibration?.methodology === 'gtd' && "Your GTD inbox is ready. Capture thoughts, then process."}
              {calibration?.methodology === 'time_blocking' && "Your time blocks are set. Focus on what matters."}
              {calibration?.methodology === 'pomodoro' && "Ready for focused intervals? Let's start a session."}
              {calibration?.methodology === 'nuke_the_day' && "Let's crush today's tasks. Maximum impact mode."}
              {(!calibration?.methodology || calibration?.methodology === 'organic') && "Here's your productivity overview. Use SERA to stay on track."}
            </p>
          </motion.div>

          {/* Main Grid - Adaptive based on methodology */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* GTD Mode: Show Quick Capture prominently */}
              {isGTDMode && <QuickCaptureInbox />}

              {/* Time Block Mode: Show Timeline */}
              {isTimeBlockMode && calibration && (
                <TimeBlockView
                  calibration={calibration}
                  tasks={mockTasks.map(t => ({ ...t, duration: 30 }))}
                />
              )}

              {/* Default: Show regular timeline */}
              {!isGTDMode && !isTimeBlockMode && <TimelineWidget />}

              {/* Energy-Sorted Tasks */}
              <EnergySortedTasks
                tasks={mockTasks}
                currentEnergyLevel={currentEnergyLevel}
                energyWindows={calibration?.energy_windows}
              />

              {/* AI Planner */}
              <SeraPlannerCard />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <FocusModeCard />
              
              {/* Show GTD Widget for GTD users, or regular widget otherwise */}
              <GTDWidget />
              <GTDAnalytics />
            </div>
          </div>
        </div>
      </main>

      {/* Voice Overlay - Always visible */}
      <VoiceOverlay />

      {/* SERA FAB */}
      <SeraFAB />

      <div className="fixed bottom-2 left-2 text-[0.5rem] text-muted-foreground/50 select-none z-50">
        made by aditya
      </div>
    </div>
  );
}

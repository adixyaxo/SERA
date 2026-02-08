import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, CheckCircle2, Target, Zap, Flame, Calendar, ListTodo, Folder, Activity } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useTaskAnalytics } from "@/hooks/useTaskAnalytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import { FloatingBackground } from "@/components/dashboard/FloatingBackground";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, eachDayOfInterval } from "date-fns";

interface HabitAnalytics {
  totalHabits: number;
  completionRate: number;
  bestStreak: number;
  todayCompleted: number;
  weeklyData: { date: string; completed: number; total: number }[];
}

const Analytics = () => {
  const { analytics, isLoading } = useTaskAnalytics();
  const { user } = useAuth();
  const [habitAnalytics, setHabitAnalytics] = useState<HabitAnalytics | null>(null);

  const loadHabitAnalytics = useCallback(async () => {
    if (!user) return;
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const [habitsRes, logsRes] = await Promise.all([
      supabase.from('habits').select('id, name').eq('user_id', user.id).eq('archived', false),
      supabase.from('habit_logs').select('habit_id, date_string, completed')
        .gte('date_string', format(subDays(new Date(), 6), 'yyyy-MM-dd'))
        .lte('date_string', todayStr),
    ]);

    const habits = habitsRes.data || [];
    const logs = logsRes.data || [];
    const totalHabits = habits.length;

    const todayLogs = logs.filter(l => l.date_string === todayStr && l.completed);
    const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });

    const weeklyData = last7Days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayLogs = logs.filter(l => l.date_string === dateStr && l.completed);
      return {
        date: format(day, 'EEE'),
        completed: dayLogs.length,
        total: totalHabits,
      };
    });

    const totalPossible = totalHabits * 7;
    const totalCompleted = weeklyData.reduce((sum, d) => sum + d.completed, 0);

    setHabitAnalytics({
      totalHabits,
      completionRate: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      bestStreak: 0,
      todayCompleted: todayLogs.length,
      weeklyData,
    });
  }, [user]);

  useEffect(() => {
    loadHabitAnalytics();
  }, [loadHabitAnalytics]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full relative">
        <FloatingBackground />
        <Header />
        <main className="pt-32 sm:pt-28 pb-24 sm:pb-16 px-4 sm:px-8 min-h-screen relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="glass p-6 rounded-3xl animate-pulse">
              <div className="h-8 w-48 bg-muted rounded mb-2" />
              <div className="h-4 w-64 bg-muted rounded" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass rounded-3xl p-6 animate-pulse">
                  <div className="h-20 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen w-full relative">
        <FloatingBackground />
        <Header />
        <main className="pt-32 sm:pt-28 pb-24 sm:pb-16 px-4 sm:px-8 min-h-screen relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="glass p-12 rounded-3xl text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">No Analytics Data</h2>
              <p className="text-muted-foreground">Start creating tasks to see your productivity insights.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stats = [
    { name: "Total Tasks", value: analytics.totalTasks, subtitle: `${analytics.pendingTasks} pending`, icon: ListTodo, color: "text-primary", bgColor: "bg-primary/10" },
    { name: "Completed", value: analytics.completedTasks, subtitle: `${analytics.averageCompletionRate}% rate`, icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
    { name: "This Week", value: analytics.completedThisWeek, subtitle: `${analytics.completedToday} today`, icon: Calendar, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { name: "Streak", value: `${analytics.streak}d`, subtitle: "Keep going!", icon: Flame, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  ];

  const gtdData = [
    { name: "NOW", value: analytics.gtdDistribution.now, color: "hsl(var(--accent))" },
    { name: "NEXT", value: analytics.gtdDistribution.next, color: "hsl(var(--primary))" },
    { name: "LATER", value: analytics.gtdDistribution.later, color: "hsl(var(--muted-foreground))" },
  ];

  const priorityData = [
    { name: "High", value: analytics.priorityDistribution.high, color: "hsl(var(--destructive))" },
    { name: "Medium", value: analytics.priorityDistribution.medium, color: "hsl(var(--accent))" },
    { name: "Low", value: analytics.priorityDistribution.low, color: "hsl(var(--muted-foreground))" },
  ];

  return (
    <div className="min-h-screen w-full relative">
      <FloatingBackground />
      <Header />

      <main className="pt-32 sm:pt-28 pb-24 sm:pb-16 px-4 sm:px-8 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl"
          >
            <h1 className="text-2xl sm:text-3xl font-light mb-1">Analytics</h1>
            <p className="text-muted-foreground text-sm">Track your productivity and task insights</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-4 sm:p-5"
                >
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color} w-fit mb-3`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-light">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.name}</p>
                  <p className="text-xs text-muted-foreground/70">{stat.subtitle}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Weekly Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-0 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription className="text-xs">Tasks created vs completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-52 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.dailyStats}>
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="completed" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Completed" />
                        <Bar dataKey="created" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Created" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Habit Activity */}
            {habitAnalytics && habitAnalytics.totalHabits > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="glass border-0 rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-3 text-base">
                      <Activity className="h-5 w-5 text-accent" />
                      Habit Completion
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {habitAnalytics.completionRate}% weekly rate • {habitAnalytics.todayCompleted}/{habitAnalytics.totalHabits} today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-52 sm:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={habitAnalytics.weeklyData}>
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "12px",
                              fontSize: "12px",
                            }}
                          />
                          <Area type="monotone" dataKey="completed" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.15} name="Completed" />
                          <Area type="monotone" dataKey="total" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.05} name="Total" strokeDasharray="5 5" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* GTD Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass border-0 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <Target className="h-5 w-5 text-accent" />
                    GTD Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">NOW / NEXT / LATER</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-52 sm:h-64">
                    {analytics.pendingTasks > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={gtdData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                            {gtdData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
                          <Legend wrapperStyle={{ fontSize: "12px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No pending tasks</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Priority Breakdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card className="glass border-0 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <Zap className="h-5 w-5 text-accent" />
                    Priority Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">Pending tasks by priority</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {priorityData.map((item) => {
                    const total = analytics.pendingTasks || 1;
                    const percentage = Math.round((item.value / total) * 100);
                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: item.color }}>{item.name}</span>
                          <span className="text-muted-foreground text-xs">{item.value} ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Project Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="glass border-0 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <Folder className="h-5 w-5 text-accent" />
                    Project Progress
                  </CardTitle>
                  <CardDescription className="text-xs">Completion by project</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.projectStats.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.projectStats.slice(0, 5).map((project) => {
                        const percentage = project.total > 0 ? Math.round((project.completed / project.total) * 100) : 0;
                        return (
                          <div key={project.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="truncate max-w-[180px]">{project.name}</span>
                              <span className="text-muted-foreground text-xs">{project.completed}/{project.total}</span>
                            </div>
                            <Progress value={percentage} className="h-1.5" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-muted-foreground text-sm">No projects with tasks yet</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Completion Rate */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card className="glass border-0 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Overall Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--accent))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${analytics.averageCompletionRate * 2.51} 251`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-semibold">{analytics.averageCompletionRate}%</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium">{analytics.completedTasks} of {analytics.totalTasks} tasks</p>
                      <p className="text-xs text-muted-foreground">{analytics.completedThisMonth} this month</p>
                      {analytics.streak > 0 && (
                        <p className="text-accent flex items-center gap-1.5 text-sm">
                          <Flame className="h-3.5 w-3.5" />{analytics.streak} day streak!
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Mail, Calendar as CalendarIcon, Save, Bell, Palette, Globe, 
  Shield, LogOut, CheckCircle2, Target, Flame, Clock, TrendingUp,
  Zap, Award, ShieldCheck, ShieldOff, KeyRound, Loader2, Copy
} from "lucide-react";
import { format, subDays, startOfWeek } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface ProductivityStats {
  totalTasks: number;
  completedTasks: number;
  completedThisWeek: number;
  currentStreak: number;
  longestStreak: number;
  nowTasks: number;
  nextTasks: number;
  laterTasks: number;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<ProductivityStats>({
    totalTasks: 0, completedTasks: 0, completedThisWeek: 0,
    currentStreak: 0, longestStreak: 0, nowTasks: 0, nextTasks: 0, laterTasks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Form state
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationPush, setNotificationPush] = useState(true);
  const [theme, setTheme] = useState("system");

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 2FA / MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(true);
  const [mfaEnrolling, setMfaEnrolling] = useState(false);
  const [mfaQrCode, setMfaQrCode] = useState<string | null>(null);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaVerifyCode, setMfaVerifyCode] = useState("");
  const [mfaVerifying, setMfaVerifying] = useState(false);
  const [mfaDisabling, setMfaDisabling] = useState(false);

  // Load productivity stats
  const loadStats = useCallback(async () => {
    if (!user) return;
    setStatsLoading(true);
    try {
      const { data: allTasks } = await supabase
        .from("cards")
        .select("card_id, status, gtd_status, completed_at, created_at")
        .eq("user_id", user.id)
        .eq("type", "task")
        .neq("status", "reject");

      if (allTasks) {
        const now = new Date();
        const weekStart = startOfWeek(now);
        const completed = allTasks.filter(t => t.status === "completed");
        const completedThisWeek = completed.filter(t => t.completed_at && new Date(t.completed_at) >= weekStart);
        const active = allTasks.filter(t => t.status !== "completed");

        let currentStreak = 0;
        let checkDate = subDays(now, 1);
        for (let i = 0; i < 365; i++) {
          const dayCompleted = completed.some(t => {
            if (!t.completed_at) return false;
            const cd = new Date(t.completed_at);
            return cd.getDate() === checkDate.getDate() && cd.getMonth() === checkDate.getMonth() && cd.getFullYear() === checkDate.getFullYear();
          });
          if (dayCompleted) { currentStreak++; checkDate = subDays(checkDate, 1); } else break;
        }
        const completedToday = completed.some(t => {
          if (!t.completed_at) return false;
          const cd = new Date(t.completed_at);
          return cd.getDate() === now.getDate() && cd.getMonth() === now.getMonth() && cd.getFullYear() === now.getFullYear();
        });
        if (completedToday) currentStreak++;

        setStats({
          totalTasks: allTasks.length, completedTasks: completed.length,
          completedThisWeek: completedThisWeek.length, currentStreak, longestStreak: currentStreak,
          nowTasks: active.filter(t => t.gtd_status === "NOW").length,
          nextTasks: active.filter(t => t.gtd_status === "NEXT").length,
          laterTasks: active.filter(t => t.gtd_status === "LATER").length,
        });
      }
    } finally { setStatsLoading(false); }
  }, [user]);

  // Load MFA status
  const loadMfaStatus = useCallback(async () => {
    setMfaLoading(true);
    try {
      const { data } = await supabase.auth.mfa.listFactors();
      const verified = data?.totp?.filter(f => f.status === 'verified') || [];
      setMfaEnabled(verified.length > 0);
      if (verified.length > 0) setMfaFactorId(verified[0].id);
    } catch {
      // ignore
    } finally { setMfaLoading(false); }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadMfaStatus(); }, [loadMfaStatus]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setTimezone(profile.timezone || "UTC");
      setNotificationEmail(profile.notification_email ?? true);
      setNotificationPush(profile.notification_push ?? true);
      setTheme(profile.theme || "system");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ full_name: fullName, bio, timezone, notification_email: notificationEmail, notification_push: notificationPush, theme });
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success("Password updated!"); setNewPassword(""); setConfirmPassword(""); }
    setPasswordLoading(false);
  };

  // MFA enrollment
  const handleEnrollMfa = async () => {
    setMfaEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'SERA Authenticator' });
      if (error) { toast.error(error.message); return; }
      setMfaQrCode(data.totp.qr_code);
      setMfaSecret(data.totp.secret);
      setMfaFactorId(data.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to start 2FA enrollment');
    } finally { setMfaEnrolling(false); }
  };

  const handleVerifyMfaEnrollment = async () => {
    if (!mfaFactorId || mfaVerifyCode.length !== 6) return;
    setMfaVerifying(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
      if (challengeError) { toast.error(challengeError.message); return; }
      const { error } = await supabase.auth.mfa.verify({ factorId: mfaFactorId, challengeId: challenge.id, code: mfaVerifyCode });
      if (error) { toast.error('Invalid code. Try again.'); return; }
      toast.success('Two-factor authentication enabled! 🔒');
      setMfaEnabled(true);
      setMfaQrCode(null);
      setMfaSecret(null);
      setMfaVerifyCode("");
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally { setMfaVerifying(false); }
  };

  const handleDisableMfa = async () => {
    if (!mfaFactorId) return;
    setMfaDisabling(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: mfaFactorId });
      if (error) { toast.error(error.message); return; }
      toast.success('Two-factor authentication disabled');
      setMfaEnabled(false);
      setMfaFactorId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to disable 2FA');
    } finally { setMfaDisabling(false); }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
  ];

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  const statCards = [
    { label: "Tasks Completed", value: stats.completedTasks, icon: CheckCircle2, color: "hsl(var(--accent))", bg: "bg-accent/10" },
    { label: "Current Streak", value: `${stats.currentStreak}d`, icon: Flame, color: "hsl(0 75% 60%)", bg: "bg-destructive/10" },
    { label: "This Week", value: stats.completedThisWeek, icon: TrendingUp, color: "hsl(120 60% 45%)", bg: "bg-green-500/10" },
    { label: "Active Tasks", value: stats.nowTasks + stats.nextTasks + stats.laterTasks, icon: Target, color: "hsl(var(--primary))", bg: "bg-primary/10" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <main className="pt-24 pb-20 px-4 sm:px-8 min-h-screen">
          <div className="max-w-5xl mx-auto animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-3xl" />
            <div className="h-64 bg-muted rounded-3xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="pt-24 sm:pt-24 pb-20 px-3 sm:px-8 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-5">

          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl border-[0.75px] border-border p-1">
            <GlowingEffect spread={60} glow={true} disabled={false} proximity={80} inactiveZone={0.01} borderWidth={3} />
            <Card className="glass-strong border-0 rounded-2xl overflow-hidden">
              <div className="h-20 sm:h-24 bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20" />
              <CardContent className="relative pt-0 pb-5">
                <div className="flex flex-col sm:flex-row gap-4 -mt-10 sm:-mt-12">
                  <div className="flex-shrink-0">
                    <div className="h-18 w-18 sm:h-24 sm:w-24 rounded-2xl bg-accent/20 border-4 border-background flex items-center justify-center shadow-xl" style={{ height: '4.5rem', width: '4.5rem' }}>
                      <span className="text-2xl sm:text-4xl font-bold text-accent">{fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1 sm:pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h1 className="text-xl sm:text-3xl font-light">{fullName || "Your Profile"}</h1>
                        <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3" />{user?.email}
                        </p>
                        {user?.created_at && (
                          <p className="text-muted-foreground text-xs flex items-center gap-2 mt-0.5">
                            <CalendarIcon className="h-3 w-3" />Member since {format(new Date(user.created_at), "MMMM yyyy")}
                          </p>
                        )}
                      </div>
                      <Button onClick={handleSave} disabled={saving} size="sm" className="rounded-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 self-start">
                        <Save className="h-4 w-4 mr-1.5" />{saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 + index * 0.04 }}>
                <Card className="glass border-border rounded-xl">
                  <CardContent className="p-3 sm:p-4">
                    <div className={`p-1.5 rounded-lg ${stat.bg} w-fit mb-2`}>
                      <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold" style={{ color: stat.color }}>{statsLoading ? "-" : stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Completion Rate */}
          <Card className="glass border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Award className="h-4 w-4 text-accent" /><span className="font-medium text-sm">Completion Rate</span></div>
                <span className="text-xl font-bold text-accent">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
                <span>{stats.completedTasks} completed</span><span>{stats.totalTasks} total</span>
              </div>
            </CardContent>
          </Card>

          {/* GTD Distribution */}
          <Card className="glass border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3"><Zap className="h-4 w-4 text-accent" /><span className="font-medium text-sm">Task Distribution</span></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-accent/10"><p className="text-2xl font-bold text-accent">{stats.nowTasks}</p><p className="text-xs text-muted-foreground">NOW</p></div>
                <div className="text-center p-3 rounded-xl bg-primary/10"><p className="text-2xl font-bold text-primary">{stats.nextTasks}</p><p className="text-xs text-muted-foreground">NEXT</p></div>
                <div className="text-center p-3 rounded-xl bg-muted"><p className="text-2xl font-bold text-muted-foreground">{stats.laterTasks}</p><p className="text-xs text-muted-foreground">LATER</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Grid */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Account Details */}
            <Card className="glass border-border h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base"><User className="h-4 w-4 text-accent" />Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5"><Label htmlFor="fullName" className="text-xs">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" className="rounded-xl h-10" />
                </div>
                <div className="space-y-1.5"><Label htmlFor="bio" className="text-xs">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" className="rounded-xl resize-none" rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="glass border-border h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base"><Palette className="h-4 w-4 text-accent" />Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2 text-xs"><Globe className="h-3 w-3" />Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="rounded-xl h-10"><SelectValue placeholder="Select timezone" /></SelectTrigger>
                    <SelectContent>{timezones.map((tz) => (<SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2 text-xs"><Palette className="h-3 w-3" />Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="rounded-xl h-10"><SelectValue placeholder="Select theme" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="glass border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base"><Bell className="h-4 w-4 text-accent" />Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-background/50">
                  <div><p className="text-sm font-medium">Email Notifications</p><p className="text-xs text-muted-foreground">Task reminders via email</p></div>
                  <Switch checked={notificationEmail} onCheckedChange={setNotificationEmail} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background/50">
                  <div><p className="text-sm font-medium">Push Notifications</p><p className="text-xs text-muted-foreground">Browser notifications</p></div>
                  <Switch checked={notificationPush} onCheckedChange={setNotificationPush} />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="glass border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base"><Shield className="h-4 w-4 text-accent" />Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Password Change */}
                <div className="p-3 rounded-xl bg-background/50 space-y-2">
                  <div className="flex items-center gap-2 mb-1"><KeyRound className="h-4 w-4 text-muted-foreground" /><p className="text-sm font-medium">Change Password</p></div>
                  <Input type="password" placeholder="New password (min 8 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-xl h-9 text-sm" />
                  <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-xl h-9 text-sm" />
                  <Button size="sm" className="rounded-full" disabled={passwordLoading || !newPassword || !confirmPassword} onClick={handlePasswordChange}>
                    {passwordLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}Update Password
                  </Button>
                </div>

                {/* 2FA Section */}
                <div className="p-3 rounded-xl bg-background/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mfaEnabled ? <ShieldCheck className="h-4 w-4 text-accent" /> : <ShieldOff className="h-4 w-4 text-muted-foreground" />}
                      <div>
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">{mfaEnabled ? 'Enabled — your account is extra secure' : 'Add an extra layer of security'}</p>
                      </div>
                    </div>
                    {mfaLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : null}
                  </div>

                  {/* QR Code enrollment */}
                  {mfaQrCode && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                      <p className="text-xs text-muted-foreground">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):</p>
                      <div className="flex justify-center">
                        <img src={mfaQrCode} alt="2FA QR Code" className="w-40 h-40 rounded-xl border border-border" />
                      </div>
                      {mfaSecret && (
                        <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
                          <code className="text-xs flex-1 break-all">{mfaSecret}</code>
                          <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => { navigator.clipboard.writeText(mfaSecret); toast.success('Secret copied!'); }}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">Enter the 6-digit code from your app to verify:</p>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={mfaVerifyCode} onChange={setMfaVerifyCode}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                            <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-full flex-1" disabled={mfaVerifying || mfaVerifyCode.length !== 6} onClick={handleVerifyMfaEnrollment}>
                          {mfaVerifying ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ShieldCheck className="h-3 w-3 mr-1" />}Verify & Enable
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setMfaQrCode(null); setMfaSecret(null); setMfaVerifyCode(""); }}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Enable / Disable buttons */}
                  {!mfaQrCode && !mfaLoading && (
                    mfaEnabled ? (
                      <Button variant="outline" size="sm" className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleDisableMfa} disabled={mfaDisabling}>
                        {mfaDisabling ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ShieldOff className="h-3 w-3 mr-1" />}Disable 2FA
                      </Button>
                    ) : (
                      <Button size="sm" className="rounded-full" onClick={handleEnrollMfa} disabled={mfaEnrolling}>
                        {mfaEnrolling ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ShieldCheck className="h-3 w-3 mr-1" />}Enable 2FA
                      </Button>
                    )
                  )}
                </div>

                {/* Sign Out */}
                <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                  <p className="text-sm font-medium mb-1 text-destructive">Sign Out</p>
                  <p className="text-xs text-muted-foreground mb-2">Sign out from this device</p>
                  <Button variant="destructive" size="sm" className="rounded-full" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-1.5" />Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

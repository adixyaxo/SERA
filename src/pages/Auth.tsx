import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { lovable } from '@/integrations/lovable/index';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff, Sparkles, Phone, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
});

const phoneSchema = z.string().min(10, 'Please enter a valid phone number');

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'magic_link'>('email');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  // MFA state
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [showMfa, setShowMfa] = useState(false);

  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If the user is already signed in, get them out of /auth.
  useEffect(() => {
    if (!authLoading && user && !showMfa) {
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, user, showMfa, navigate]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/dashboard`,
      });
      if (error) {
        toast.error(error.message || 'Failed to sign in with Google');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Email OTP / Magic Link
  const handleSendMagicLink = async () => {
    const validation = z.string().email().safeParse(magicLinkEmail);
    if (!validation.success) {
      toast.error('Please enter a valid email address');
      return;
    }
    setMagicLinkLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: magicLinkEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        setMagicLinkSent(true);
        toast.success('Magic link sent! Check your email inbox.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send magic link');
    } finally {
      setMagicLinkLoading(false);
    }
  };

  // Phone OTP
  const handleSendOtp = async () => {
    const validation = phoneSchema.safeParse(phone);
    if (!validation.success) {
      toast.error('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }
    setPhoneLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) {
        toast.error(error.message);
      } else {
        setShowOtpInput(true);
        toast.success('OTP sent to your phone!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setPhoneLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Phone verified successfully!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify OTP');
    } finally {
      setPhoneLoading(false);
    }
  };

  // Check MFA after sign-in
  const checkMfa = async () => {
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalData && aalData.nextLevel === 'aal2' && aalData.currentLevel === 'aal1') {
      // User has MFA enrolled, needs to verify
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];
      if (totpFactor) {
        setMfaFactorId(totpFactor.id);
        const { data: challenge, error } = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
        if (error) {
          toast.error('MFA challenge failed');
          return false;
        }
        setMfaChallengeId(challenge.id);
        setShowMfa(true);
        return true; // needs MFA
      }
    }
    return false; // no MFA needed
  };

  const handleMfaVerify = async () => {
    if (!mfaFactorId || !mfaChallengeId || mfaCode.length !== 6) return;
    setMfaLoading(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: mfaChallengeId,
        code: mfaCode,
      });
      if (error) {
        toast.error('Invalid code. Please try again.');
      } else {
        toast.success('2FA verified! Welcome back.');
        setShowMfa(false);
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setMfaLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    // Check if MFA is required
    const needsMfa = await checkMfa();
    if (!needsMfa) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signUpSchema.safeParse({ email, password, fullName });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Check your email to confirm.');
    }
    setLoading(false);
  };

  // MFA verification screen
  if (showMfa) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="glass-strong border-border/20 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
              <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={mfaCode} onChange={setMfaCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                onClick={handleMfaVerify}
                disabled={mfaLoading || mfaCode.length !== 6}
                className="w-full rounded-full h-12 bg-gradient-to-r from-accent to-primary"
              >
                {mfaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-xs"
                onClick={() => {
                  setShowMfa(false);
                  setMfaCode('');
                }}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Social/alternative auth buttons shared component
  const AlternativeAuthButtons = ({ showMagicLink = true }: { showMagicLink?: boolean }) => (
    <div className="space-y-2.5">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full rounded-full h-11 border-border/50 hover:bg-muted/50 transition-all flex items-center gap-3 text-sm"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </>
        )}
      </Button>

      {showMagicLink && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setAuthMethod('magic_link')}
          className="w-full rounded-full h-11 border-border/50 hover:bg-muted/50 transition-all flex items-center gap-3 text-sm"
        >
          <Mail className="h-4 w-4" />
          Email Magic Link (Passwordless)
        </Button>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => setAuthMethod('phone')}
        className="w-full rounded-full h-11 border-border/50 hover:bg-muted/50 transition-all flex items-center gap-3 text-sm"
      >
        <Phone className="h-4 w-4" />
        Continue with Phone
      </Button>
    </div>
  );

  // Phone auth view
  const PhoneAuthView = () => (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!showOtpInput ? (
        <>
          <Button type="button" variant="ghost" onClick={() => { setAuthMethod('email'); }} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to email
          </Button>
          <Input
            type="tel"
            placeholder="Phone with country code (+1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-2xl h-12 bg-muted/30 border-border/50"
          />
          <Button onClick={handleSendOtp} disabled={phoneLoading || !phone} className="w-full rounded-full h-12 bg-gradient-to-r from-accent to-primary">
            {phoneLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send OTP'}
          </Button>
        </>
      ) : (
        <>
          <Button type="button" variant="ghost" onClick={() => { setShowOtpInput(false); setOtp(''); }} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Change phone number
          </Button>
          <p className="text-sm text-muted-foreground text-center mb-4">Enter the 6-digit code sent to {phone}</p>
          <div className="flex justify-center mb-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button onClick={handleVerifyOtp} disabled={phoneLoading || otp.length !== 6} className="w-full rounded-full h-12 bg-gradient-to-r from-accent to-primary">
            {phoneLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify OTP'}
          </Button>
          <Button type="button" variant="link" onClick={handleSendOtp} disabled={phoneLoading} className="w-full text-muted-foreground">Resend OTP</Button>
        </>
      )}
    </motion.div>
  );

  // Magic link view
  const MagicLinkView = () => (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button type="button" variant="ghost" onClick={() => { setAuthMethod('email'); setMagicLinkSent(false); }} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to email
      </Button>

      {!magicLinkSent ? (
        <>
          <p className="text-sm text-muted-foreground text-center mb-2">We'll send you a sign-in link. No password needed!</p>
          <Input
            type="email"
            placeholder="Your email address"
            value={magicLinkEmail}
            onChange={(e) => setMagicLinkEmail(e.target.value)}
            className="rounded-2xl h-12 bg-muted/30 border-border/50"
            autoComplete="email"
          />
          <Button onClick={handleSendMagicLink} disabled={magicLinkLoading || !magicLinkEmail} className="w-full rounded-full h-12 bg-gradient-to-r from-accent to-primary">
            {magicLinkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Magic Link'}
          </Button>
        </>
      ) : (
        <div className="text-center py-6 space-y-3">
          <div className="mx-auto h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
            <Mail className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-lg font-medium">Check your inbox</h3>
          <p className="text-sm text-muted-foreground">We sent a magic link to <strong>{magicLinkEmail}</strong>. Click the link in the email to sign in.</p>
          <Button variant="link" onClick={() => { setMagicLinkSent(false); handleSendMagicLink(); }} disabled={magicLinkLoading} className="text-xs">Resend link</Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.08), transparent 60%)", left: "-20%", top: "-30%", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06), transparent 60%)", right: "-15%", bottom: "-20%", filter: "blur(50px)" }}
          animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-strong border-border/20 shadow-2xl backdrop-blur-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, duration: 0.8 }}
              className="mx-auto mb-4 relative"
            >
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-accent via-primary to-accent/80 flex items-center justify-center shadow-lg shadow-accent/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
              </div>
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl font-light tracking-tight">Welcome to SERA</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">Your intelligent productivity assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-full p-1 bg-muted/50 h-10">
                <TabsTrigger value="signin" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm">Sign Up</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="signin" key="signin" className="mt-5">
                  {authMethod === 'email' ? (
                    <motion.form onSubmit={handleSignIn} className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-2xl h-11 bg-muted/30 border-border/50" autoComplete="email" />
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-2xl h-11 bg-muted/30 border-border/50 pr-12" autoComplete="current-password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button type="submit" className="w-full rounded-full h-11 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-accent-foreground font-medium shadow-lg shadow-accent/20" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                      </Button>

                      <div className="relative my-3">
                        <Separator className="bg-border/50" />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">or</span>
                      </div>

                      <AlternativeAuthButtons />
                    </motion.form>
                  ) : authMethod === 'phone' ? (
                    <PhoneAuthView />
                  ) : (
                    <MagicLinkView />
                  )}
                </TabsContent>

                <TabsContent value="signup" key="signup" className="mt-5">
                  <motion.form onSubmit={handleSignUp} className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="rounded-2xl h-11 bg-muted/30 border-border/50" autoComplete="name" />
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-2xl h-11 bg-muted/30 border-border/50" autoComplete="email" />
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="Password (min 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-2xl h-11 bg-muted/30 border-border/50 pr-12" autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button type="submit" className="w-full rounded-full h-11 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-accent-foreground font-medium shadow-lg shadow-accent/20" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                    </Button>

                    <div className="relative my-3">
                      <Separator className="bg-border/50" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">or</span>
                    </div>

                    <AlternativeAuthButtons showMagicLink={false} />
                  </motion.form>
                </TabsContent>
              </AnimatePresence>
            </Tabs>

            <p className="text-center text-xs text-muted-foreground mt-5">By continuing, you agree to our Terms of Service</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="fixed bottom-2 right-2 text-[0.5rem] text-muted-foreground/50 select-none z-50">made by aditya</div>
    </div>
  );
};

export default Auth;

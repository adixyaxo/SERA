import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { lovable } from '@/integrations/lovable/index';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
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

const StarMark = () => (
  <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-56 md:h-56" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
    <line x1="100" y1="10" x2="100" y2="190" />
    <line x1="10" y1="100" x2="190" y2="100" />
    <line x1="30" y1="30" x2="170" y2="170" />
    <line x1="170" y1="30" x2="30" y2="170" />
    <circle cx="100" cy="100" r="6" />
  </svg>
);

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [showMfa, setShowMfa] = useState(false);

  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && !showMfa) navigate('/dashboard', { replace: true });
  }, [authLoading, user, showMfa, navigate]);

  const checkMfa = async () => {
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalData && aalData.nextLevel === 'aal2' && aalData.currentLevel === 'aal1') {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.[0];
      if (totp) {
        setMfaFactorId(totp.id);
        const { data: challenge, error } = await supabase.auth.mfa.challenge({ factorId: totp.id });
        if (error) { toast.error('MFA challenge failed'); return false; }
        setMfaChallengeId(challenge.id);
        setShowMfa(true);
        return true;
      }
    }
    return false;
  };

  const handleMfaVerify = async () => {
    if (!mfaFactorId || !mfaChallengeId || mfaCode.length !== 6) return;
    setMfaLoading(true);
    const { error } = await supabase.auth.mfa.verify({ factorId: mfaFactorId, challengeId: mfaChallengeId, code: mfaCode });
    if (error) toast.error('Invalid code. Please try again.');
    else { toast.success('2FA verified.'); setShowMfa(false); navigate('/dashboard'); }
    setMfaLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/dashboard` });
      if (error) toast.error(error.message || 'Failed to sign in with Google');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in with Google');
    } finally { setGoogleLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      const v = signInSchema.safeParse({ email, password });
      if (!v.success) { toast.error(v.error.errors[0].message); return; }
      setLoading(true);
      const { error } = await signIn(email, password);
      if (error) { toast.error(error.message); setLoading(false); return; }
      const needsMfa = await checkMfa();
      if (!needsMfa) { toast.success('Welcome back.'); navigate('/dashboard'); }
      setLoading(false);
    } else {
      const v = signUpSchema.safeParse({ email, password, fullName });
      if (!v.success) { toast.error(v.error.errors[0].message); return; }
      setLoading(true);
      const { error } = await signUp(email, password, fullName);
      if (error) toast.error(error.message);
      else toast.success('Account created.');
      setLoading(false);
    }
  };

  if (showMfa) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <div className="mx-auto h-12 w-12 rounded-sm border border-border flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-medium tracking-tight text-foreground">Two-Factor Authentication</h1>
            <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
          </div>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={mfaCode} onChange={setMfaCode}>
              <InputOTPGroup>
                {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button onClick={handleMfaVerify} disabled={mfaLoading || mfaCode.length !== 6} className="w-full h-11 rounded-sm bg-white text-black hover:bg-white/90">
            {mfaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
          </Button>
          <button className="w-full text-xs text-muted-foreground hover:text-foreground" onClick={() => { setShowMfa(false); setMfaCode(''); }}>Cancel</button>
        </motion.div>
      </div>
    );
  }

  const inputCls = "w-full h-11 px-3 bg-[#171717] border border-[#373737] rounded-sm text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#525252] transition-colors";

  return (
    <div className="min-h-screen w-full bg-background text-foreground grid md:grid-cols-2">
      {/* Left — minimal mark */}
      <div className="hidden md:flex items-center justify-center bg-[#0A0A0A] border-r border-[#373737] relative overflow-hidden">
        <div className="text-foreground/85">
          <StarMark />
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 md:px-16 py-12 bg-background">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-1">{mode === 'signin' ? 'Login' : 'Create account'}</h1>
          <p className="text-sm text-muted-foreground mb-10">
            {mode === 'signin' ? (
              <>New here? <button onClick={() => setMode('signup')} className="text-foreground underline underline-offset-4 hover:opacity-80">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode('signin')} className="text-foreground underline underline-offset-4 hover:opacity-80">Login</button></>
            )}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} placeholder="Your name" autoComplete="name" required />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className={inputCls + ' pr-10'} placeholder="••••••••" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="h-3.5 w-3.5 rounded-sm accent-white bg-[#171717] border border-[#373737]" />
                  Remember me
                </label>
                <button type="button" className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4">Forgot?</button>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-sm bg-white text-black hover:bg-white/90 font-medium">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === 'signin' ? 'Login' : 'Create account')}
            </Button>

            <div className="relative py-1">
              <div className="h-px bg-[#373737]" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-3 text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
            </div>

            <button type="button" onClick={handleGoogle} disabled={googleLoading} className="w-full h-11 rounded-sm border border-[#373737] bg-transparent hover:bg-[#171717] transition-colors text-sm text-foreground flex items-center justify-center gap-3">
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Continue with Google
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-[11px] text-muted-foreground/70">By continuing, you agree to our Terms of Service.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

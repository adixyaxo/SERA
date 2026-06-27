import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { VoiceCommandProvider } from "@/contexts/VoiceCommandContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import RootRedirect from "./components/RootRedirect";

// Eager: small + entry critical
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy: split bundles for faster first paint
const Landing = lazy(() => import("./pages/Landing"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Demo = lazy(() => import("./pages/Demo"));
const SocialProof = lazy(() => import("./pages/SocialProof"));
const Index = lazy(() => import("./pages/Index"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Notes = lazy(() => import("./pages/Notes"));
const Automations = lazy(() => import("./pages/Automations"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Projects = lazy(() => import("./pages/Projects"));
const Profile = lazy(() => import("./pages/Profile"));
const Tags = lazy(() => import("./pages/Tags"));
const Tracker = lazy(() => import("./pages/Tracker"));
const Timetable = lazy(() => import("./pages/Timetable"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const MonkMode = lazy(() => import("./pages/MonkMode"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-[100svh] w-full bg-background flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-border border-t-accent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <VoiceCommandProvider>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/home" element={<Landing />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/social-proof" element={<SocialProof />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
                <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                <Route path="/automations" element={<ProtectedRoute><Automations /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
                <Route path="/monk" element={<ProtectedRoute><MonkMode /></ProtectedRoute>} />
                <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </VoiceCommandProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

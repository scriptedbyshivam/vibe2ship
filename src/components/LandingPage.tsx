import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Shield,
  Activity,
  MapPin,
  ChevronRight,
  ArrowRight,
  FileText,
  Camera,
  Mic,
  CheckCircle,
  RefreshCw,
  ArrowUpRight,
  Check,
  Lock,
  Settings,
  Layers,
  Cpu,
  TrendingUp,
  Map as MapIcon,
  Bell,
  Sliders,
  HelpCircle,
  Play,
  Volume2,
  Users,
  Terminal,
  Zap,
  Globe,
  Compass,
  ArrowDown,
  Info,
  Layers3,
  ExternalLink
} from "lucide-react";
import { CivicIssueReport } from "../types";

interface LandingPageProps {
  onLaunchConsole?: (role?: "citizen" | "officer") => void;
  reports?: CivicIssueReport[];
  handleAddReport?: (newReport: CivicIssueReport) => void;
}

export function LandingPage({ onLaunchConsole, reports = [], handleAddReport }: LandingPageProps) {
  const navigate = useNavigate();
  // Cinematic loading screen states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Civic Intelligence...");

  // Active Sandbox Sandbox Simulation State
  const [activeSandboxIssue, setActiveSandboxIssue] = useState<string>("pothole");
  const [isClassifying, setIsClassifying] = useState(false);
  const [sandboxConfidence, setSandboxConfidence] = useState(97);
  const [sandboxLog, setSandboxLog] = useState("System standby. Awaiting payload input...");

  // Scroll Progress calculations for parallax
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Loading Screen Counter Sequence
  useEffect(() => {
    const loadingStatements = [
      "Initializing Civic Intelligence...",
      "Analyzing Smart City Network...",
      "Syncing Geolocation GIS Spheres...",
      "Connecting Google Gemini Cognitive Gateway...",
      "Calibrating Neural Priority Vectors...",
      "Establishment Protocol Secure."
    ];

    let currentIdx = 0;
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            setIsLoading(false);
          }, 800);
          return 100;
        }

        const increment = Math.floor(Math.random() * 8) + 4;
        const nextVal = Math.min(100, prev + increment);

        // Map text changes to percentage chunks
        const step = Math.floor((nextVal / 100) * loadingStatements.length);
        if (step < loadingStatements.length && step !== currentIdx) {
          currentIdx = step;
          setLoadingText(loadingStatements[step]);
        }

        return nextVal;
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, []);

  // Sandbox automatic AI sequence trigger
  const handleTriggerSandboxAI = (type: "pothole" | "water" | "light") => {
    setIsClassifying(true);
    setSandboxConfidence(24);
    setActiveSandboxIssue(type);
    setSandboxLog("Analyzing incident structure via multi-modal sensory networks...");

    let confidenceVal = 24;
    const timer = setInterval(() => {
      confidenceVal += Math.floor(Math.random() * 15) + 8;
      if (confidenceVal >= 97) {
        setSandboxConfidence(97);
        setIsClassifying(false);
        setSandboxLog("Classification absolute. Auto-dispatching hazard payload to correct sector.");
        clearInterval(timer);
      } else {
        setSandboxConfidence(confidenceVal);
      }
    }, 180);
  };

  // Preset data details matching premium mockup
  const sandboxPresets = {
    pothole: {
      title: "Asphalt Structural Crater",
      desc: "Massive localized pothole in school safety crossing corridor.",
      tags: ["Near School", "High Traffic Zone", "Safety Risk"],
      severity: "High Critical",
      color: "from-red-500 to-amber-500",
      pinColor: "#EA4335",
      dept: "Public Works Bureau"
    },
    water: {
      title: "Subterranean Pipe Rupture",
      desc: "Freshwater line break spilling heavily onto major intersection.",
      tags: ["Asset Damaged", "Flooding Risk", "Transit Blocked"],
      severity: "Medium",
      color: "from-blue-500 to-indigo-500",
      pinColor: "#1A73E8",
      dept: "Water Utilities Department"
    },
    light: {
      title: "Municipal Grid Outage",
      desc: "Streetlight series offline. High-traffic pedestrian block completely dark.",
      tags: ["Pedestrian Safety", "Crime Deterrent", "Urgent Electric"],
      severity: "High",
      color: "from-amber-500 to-yellow-400",
      pinColor: "#FBBC05",
      dept: "Power & Grid Authority"
    }
  };

  const activePreset = sandboxPresets[activeSandboxIssue as keyof typeof sandboxPresets];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F6F8FC] text-[#0A2540] font-sans antialiased selection:bg-[#1A73E8]/20 relative overflow-x-hidden pb-32">
      
      {/* GLOWING AMBIENT BACKGROUND SYSTEM */}
      <div className="absolute top-0 left-0 w-full h-[1200px] pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[400px] left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] rounded-full border border-blue-100/30 opacity-40 animate-spin" style={{ animationDuration: "160s" }} />
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full border border-dashed border-blue-200/20 opacity-50 animate-spin" style={{ animationDuration: "110s" }} />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#1A73E8]/10 to-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[5%] w-[600px] h-[600px] bg-gradient-to-tr from-[#34A853]/5 to-[#FBBC05]/5 rounded-full blur-3xl" />
      </div>

      {/* 1. CINEMATIC FULL-SCREEN LOADING ENGINE */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="cinematic-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-radial from-[#0E2A4E] to-[#041328] text-white z-50 flex flex-col items-center justify-center p-6 select-none"
          >
            {/* Soft Ambient Laser Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute w-[600px] h-[600px] rounded-full bg-[#1A73E8]/10 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="relative flex flex-col items-center max-w-lg text-center space-y-8">
              {/* Spinning Quantum Core HUD */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="w-32 h-32 rounded-full border border-dashed border-blue-400/30 flex items-center justify-center"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-double border-emerald-400/40"
                />
                <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#1A73E8] to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>

              {/* Animated CivicMind Brand Wordmark */}
              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 1, letterSpacing: "0.05em" }}
                  transition={{ duration: 1 }}
                  className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white"
                >
                  CivicMind AI
                </motion.h1>
                <p className="text-[10px] font-mono tracking-widest uppercase text-blue-300/60">
                  District Neural Infrastructure Interface
                </p>
              </div>

              {/* Loader Slider Bar */}
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-[10px] font-mono tracking-widest text-blue-200/80">
                  <span>SYSTEM CORRELATION</span>
                  <span>{loadingProgress}%</span>
                </div>
                <div className="h-[2px] w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#1A73E8] via-emerald-400 to-[#FBBC05] rounded-full"
                    style={{ width: `${loadingProgress}%` }}
                  />
                  {/* Laser Beam Highlight effect */}
                  <div className="absolute top-0 bottom-0 w-8 bg-white/40 blur-xs animate-pulse" style={{ left: `${loadingProgress}%` }} />
                </div>
              </div>

              {/* Smooth rotating console logs */}
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-mono text-emerald-400 font-medium"
                >
                  &gt; {loadingText}
                </motion.p>
              </AnimatePresence>
            </div>

            <span className="absolute bottom-6 text-[9px] font-mono tracking-widest text-slate-500 uppercase">
              Secure SSL Government Dispatch • System 3.5 Active
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PREMIUM GLOBAL ENTERPRISE NAVBAR */}
      <header className="relative z-40 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1A73E8] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#0A2540] flex items-center gap-1.5">
              CivicMind <span className="text-xs font-bold bg-[#E5F1FF] text-[#1A73E8] px-2 py-0.5 rounded-md border border-blue-100">AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-tight uppercase">Smarter City Interface</p>
          </div>
        </div>

        {/* Navigation Anchor Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#637381]">
          <a href="#core-architect" className="hover:text-[#1A73E8] transition-colors">Neural Core</a>
          <a href="#interactive-preview" className="hover:text-[#1A73E8] transition-colors">Visual Console</a>
          <a href="#sandbox" className="hover:text-[#1A73E8] transition-colors">AI Playground</a>
          <a href="#deploy" className="hover:text-[#1A73E8] transition-colors">Live Dashboard</a>
        </div>

        {/* Dual Console launcher buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:flex px-4 py-2 sm:px-4.5 sm:py-2.5 bg-white hover:bg-slate-50 border border-[#E1E9F5] rounded-xl text-xs font-bold text-[#0A2540] transition-all cursor-pointer shadow-xs"
          >
            Log In
          </button>
          
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] hover:shadow-lg hover:shadow-blue-500/20 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">Sign Up</span>
            <span className="sm:hidden">Launch</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION (THE AUTONOMOUS DIGITAL MUNICIPAL OS) */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Headline Copywriting block */}
        <div className="lg:col-span-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 bg-[#E5F1FF] border border-blue-100 rounded-full px-4 py-1.5 text-xs font-extrabold text-[#1A73E8] uppercase tracking-wider shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#1A73E8] text-[#1A73E8] animate-bounce" /> Quantum Core V3.5 Live
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight md:leading-[1.08] text-[#0A2540]"
          >
            AI Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-indigo-600 to-[#34A853]">
              Civic Intelligence
            </span> <br />
            For Smarter Cities.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#637381] max-w-xl leading-relaxed"
          >
            Report problems in seconds. Let advanced neural intelligence analyze, prioritize, and route every issue to the absolute right municipal agency automatically.
          </motion.p>

          {/* Magnetic-styled action triggers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-4.5 bg-[#1A73E8] hover:bg-[#1557B0] hover:scale-[1.02] text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              Sign Up <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-7 py-4.5 bg-white hover:bg-slate-50 border border-[#E1E9F5] text-[#0A2540] font-bold rounded-2xl text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              Log In <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Real-time statistics counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E1E9F5]"
          >
            <div>
              <div className="text-2xl font-black text-[#1A73E8] tracking-tight">1,024+</div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-1">Telemetry Inputs</p>
            </div>
            <div>
              <div className="text-2xl font-black text-[#34A853] tracking-tight">98.4%</div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-1">Accuracy Index</p>
            </div>
            <div>
              <div className="text-2xl font-black text-[#FBBC05] tracking-tight">14.2 min</div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-1">Dispatch Lock</p>
            </div>
          </motion.div>
        </div>

        {/* Right Preview Dashboard Interactive Mockup */}
        <div id="interactive-preview" className="lg:col-span-6 relative perspective-1000 w-full max-w-full">
          
          {/* Glass Card Container floating with subtle parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotateY: 8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white/70 border border-white/80 rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(26,115,232,0.2)] backdrop-blur-3xl space-y-5 sm:space-y-7 overflow-hidden transform-gpu"
          >
            {/* Ambient Radial backdrop inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Mockup Header */}
            <div className="relative z-10 flex flex-wrap items-center justify-between pb-2 border-b border-slate-200/40 gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-2 sm:ring-4 ring-white">
                  <Activity className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                    <span className="text-[9px] sm:text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">Sys_Core</span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <span className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-none">Vision Processor</span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest mb-0.5">Status</span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-500 flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
                  </span>
                  Scanning
                </span>
              </div>
            </div>

            {/* AI Analysis Readout */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
               <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[16px] sm:rounded-[20px] p-3 sm:p-5 shadow-sm flex flex-col justify-center">
                  <span className="text-[8px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-1.5 line-clamp-1">Confidence</span>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-indigo-600 leading-none tracking-tighter">97.8<span className="text-sm sm:text-xl">%</span></span>
                    <span className="text-[9px] sm:text-[11px] font-bold text-emerald-500 mb-0 sm:mb-1 flex items-center"><ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />2.4%</span>
                  </div>
               </div>
               <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[16px] sm:rounded-[20px] p-3 sm:p-5 shadow-sm flex flex-col justify-center">
                  <span className="text-[8px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-1.5 line-clamp-1">Anomalies</span>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-1.5 sm:gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-800 leading-none tracking-tighter">03</span>
                    <span className="text-[9px] sm:text-[11px] font-bold text-red-500 mb-0 sm:mb-1 bg-red-50 px-1.5 py-0.5 rounded self-start sm:self-auto">Critical</span>
                  </div>
               </div>
            </div>

            {/* Verification Nodes */}
            <div className="space-y-2 sm:space-y-3 relative z-10">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block pl-1">Active Nodes</span>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: "Transit", desc: "Flow nominal", color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "Structure", desc: "No degrade", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Safety", desc: "Alerts clear", color: "text-blue-600", bg: "bg-blue-50" }
                ].map((tag, tIdx) => (
                  <div key={tIdx} className={`bg-white border border-slate-200/60 p-2 sm:p-4 rounded-[12px] sm:rounded-[20px] text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md cursor-default`}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1.5 sm:mb-2.5 ${tag.bg}`}>
                      <Check className={`w-3 h-3 sm:w-4 sm:h-4 ${tag.color}`} />
                    </div>
                    <h5 className="text-[9px] sm:text-xs font-black text-slate-800 tracking-tight leading-tight">{tag.label}</h5>
                    <p className="text-[8px] sm:text-[10px] text-slate-500 font-mono font-semibold tracking-tighter mt-0.5 sm:mt-1 hidden xs:block">{tag.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="relative z-10 w-full py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden group border border-slate-700"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
              Access Control Panel <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>

      </main>

      {/* 4. PREMIUM SECTOR VISION (AWWWWARDS SCROLL TRIGGER CAPABILITIES) */}
      <section id="core-architect" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-[#E1E9F5] space-y-16">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#1A73E8] uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Intelligent Pipeline
          </span>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight text-[#0A2540]">
            Autonomous Safe City Infrastructure.
          </h3>
          <p className="text-sm text-[#637381] leading-relaxed max-w-xl mx-auto">
            Re-architecting public assets with an automated system. Five advanced neural nodes synchronized to process, identify, and clear street hazards instantly.
          </p>
        </div>

        {/* Feature Bento Layout with glassmorphic depth effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Multimodal Vision */}
          <div className="bg-white border border-[#E1E9F5] rounded-3xl p-6 space-y-6 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-[#E5F1FF] text-[#1A73E8] border border-blue-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-[#0A2540]">Gemini Multi-Modal Intake</h4>
              <p className="text-xs sm:text-sm text-[#637381] leading-relaxed">
                Analyze phone images, voice transcripts, or written reports instantly. Classifies issue categories like potholes, streetlights, and leaks with over 97% confidence.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#1A73E8] group-hover:translate-x-1.5 transition-transform">
              <span>Read Model Docs</span> <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Interactive GIS Mapping */}
          <div className="bg-white border border-[#E1E9F5] rounded-3xl p-6 space-y-6 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapIcon className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-[#0A2540]">Autonomous Sector GIS</h4>
              <p className="text-xs sm:text-sm text-[#637381] leading-relaxed">
                Maps reported issues on an interactive coordinate vector grid. Pinpoints critical hot-spots, school crossing boundaries, and municipal territory lines.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1.5 transition-transform">
              <span>Inspect GIS Matrix</span> <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Dynamic Officer Dispatches */}
          <div className="bg-white border border-[#E1E9F5] rounded-3xl p-6 space-y-6 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-amber-500/5 to-transparent rounded-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-[#0A2540]">Automated Agency Routing</h4>
              <p className="text-xs sm:text-sm text-[#637381] leading-relaxed">
                Connects each categorized hazard straight to the correct department (Public Works, Power Authority, Water Utilities), bypassing traditional administrative manual delays.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-1.5 transition-transform">
              <span>View Routing Logic</span> <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </section>

      {/* 5. LIVE SANDBOX INTERACTIVE PLAYGROUND */}
      <section id="sandbox" className="relative z-10 max-w-7xl mx-auto px-6 py-20 bg-gradient-to-tr from-[#EAF2FC] via-white to-[#EAF2FC] border border-[#E1E9F5] rounded-[48px] shadow-sm space-y-12">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#1A73E8] uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Interactive AI Playground
          </span>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight text-[#0A2540]">
            Experience the Neural Classifier.
          </h3>
          <p className="text-sm text-[#637381] leading-relaxed max-w-lg mx-auto">
            Toggle our real-time hazard presets below. Observe how the CivicMind neural interpreter tags risk parameters, updates confidence levels, and maps dispatches live.
          </p>
        </div>

        {/* Playground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Preset selectors (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] text-slate-400 font-extrabold font-mono uppercase tracking-wider block">Step 1: Choose Active Hazard Preset</span>
            
            <div className="space-y-3">
              {[
                { id: "pothole", label: "Asphalt Structural Crater", desc: "Damaged road crossing in high pedestrian zone." },
                { id: "water", label: "Subterranean Pipe Rupture", desc: "Heavily leaking water line causing block flooding." },
                { id: "light", label: "Municipal Grid Outage", desc: "Streetlight series failure causing pitch black block." }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTriggerSandboxAI(item.id as "pothole" | "water" | "light")}
                  className={`w-full p-4.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    activeSandboxIssue === item.id 
                      ? "bg-[#1A73E8]/5 border-[#1A73E8] shadow-md shadow-blue-500/5" 
                      : "bg-white hover:bg-slate-50 border-[#E1E9F5]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.id === "pothole" ? "bg-red-50 text-red-500" : item.id === "water" ? "bg-blue-50 text-[#1A73E8]" : "bg-amber-50 text-amber-500"
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0A2540]">{item.label}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white border border-[#E1E9F5] p-5 rounded-2xl space-y-3.5">
              <span className="text-[10px] text-slate-400 font-extrabold font-mono uppercase tracking-wider block">Custom sandbox input</span>
              <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-blue-50">
                "{activePreset.desc}"
              </p>
              <div className="flex gap-2 text-[10px] text-slate-400">
                <Info className="w-4 h-4 text-[#1A73E8] shrink-0" />
                <span>Simulated inputs utilize actual Google Gemini-3.5 schema structures for processing.</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Display (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-800 border-2 border-slate-200 rounded-[32px] p-6.5 shadow-xl space-y-6 relative min-h-[420px] flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-600 uppercase font-bold">Autonomous Dispatch Diagnostic Console</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Secure Link</span>
              </div>

              {isClassifying ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1A73E8]/40 animate-spin" />
                    <Sparkles className="w-6 h-6 text-blue-600 absolute inset-5 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs text-blue-600 font-mono font-bold animate-pulse">MODEL STAGE: CLASSIFYING HAZARD...</p>
                    <p className="text-[10px] text-slate-500 font-mono">Tracing neural parameters with visual metadata.</p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 py-4 space-y-5 font-mono text-xs text-slate-700"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">AI CLASSIFIED CATEGORY</span>
                      <span className="text-xs font-bold text-blue-600 block uppercase">{activePreset.title}</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">NEURAL MATCH CONFIDENCE</span>
                      <span className="text-xs font-bold text-[#34A853] block">{sandboxConfidence}% Match</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold">
                      <span>GEOGRAPHIC GEOCODE LOCK</span>
                      <span className="text-blue-600 font-mono text-[9px]">LOCK SECURED</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="font-semibold">{activePreset.desc}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">DEPT DISPATCH ASSIGNED</span>
                      <span className="text-xs font-bold text-slate-700 block">{activePreset.dept}</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">MAPPED SEVERITY</span>
                      <span className="text-xs font-bold text-[#EA4335] block uppercase">{activePreset.severity}</span>
                    </div>
                  </div>

                  {/* Verification nodes */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Priority Verification Nodes</span>
                    <div className="flex gap-2 animate-pulse">
                      {activePreset.tags.map((tag, idx) => (
                        <span key={idx} className="bg-blue-50 border border-blue-200 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-bold">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Status footer */}
              <div className="text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span>LOG STATUS: {sandboxLog}</span>
                <span className="text-emerald-600 font-bold">ONLINE</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 6. SYSTEM PLATFORM DEPLOYMENT MATRIX */}
      <section id="deploy" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-[#E1E9F5] space-y-16">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#1A73E8] uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Secure Deployment
          </span>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight text-[#0A2540]">
            Deploy to District Grids.
          </h3>
          <p className="text-sm text-[#637381] leading-relaxed max-w-md mx-auto">
            Flexible interface tiers tailored for both citizens submitting in the field and staff operating municipal maintenance bureaus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Citizen Tier Card */}
          <div className="bg-white border border-[#E1E9F5] rounded-[32px] p-8 space-y-6 hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">Interface Tier 01</span>
                <h4 className="text-xl font-bold text-[#0A2540]">Citizen Intake Hub</h4>
              </div>
              <span className="bg-[#E5F1FF] text-[#1A73E8] rounded-full px-3 py-1 text-[10px] font-bold uppercase">
                Field Applet
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Equip residents with simple multimodal tools. Capture photographs, dictate details with local speech recorders, or input text. AI handles matching and coordinates automatically.
            </p>

            <ul className="space-y-2.5 pt-2 border-t border-[#F4F8FD]">
              {[
                "Capture and upload real-time images",
                "Built-in voice translation decoder",
                "Inspect local interactive sector map pins",
                "Instant, read-only status timeline notifications"
              ].map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 transition-colors"
            >
              Launch Citizen Hub <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Staff Officer Tier Card */}
          <div className="bg-white border border-[#E1E9F5] rounded-[32px] p-8 space-y-6 hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">Interface Tier 02</span>
                <h4 className="text-xl font-bold text-[#0A2540]">Staff Control Center</h4>
              </div>
              <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-[10px] font-bold uppercase border border-indigo-100">
                Command Panel
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Empower municipal operators to inspect priority incident backlogs, assign statuses, write active notations, and review automated executive summary insights.
            </p>

            <ul className="space-y-2.5 pt-2 border-t border-[#F4F8FD]">
              {[
                "Central dispatch priority queue backlog",
                "Direct incident status updates",
                "Interactive regional map pins and analytics",
                "Automated district performance briefings"
              ].map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/10 transition-colors"
            >
              Launch Officer Portal <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </section>

      {/* 7. SECURE ENTERPRISE FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 pt-12 border-t border-[#E1E9F5] text-center space-y-4">
        <p className="text-xs text-slate-400 font-semibold">
          © 2026 District Administration and Autonomous Safe City Networks. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-400 max-w-xl mx-auto leading-relaxed">
          Operational models conform fully with visual layouts described in AI Studio framework standards. All simulated parameters and geospatial dispatch records are held locally in session cache.
        </p>
      </footer>

    </div>
  );
}

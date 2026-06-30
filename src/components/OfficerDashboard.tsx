import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Users,
  Briefcase,
  Layers,
  Inbox,
  ChevronRight,
  Info,
  Globe,
  Cpu,
  TrendingUp,
  Compass,
  Map as MapIcon,
  Settings,
  Bell,
  Sun,
  Moon,
  Zap,
  Radio,
  FileText,
  AlertTriangle,
  ArrowRight,
  Terminal,
  RefreshCw,
  Plus,
  Play,
  RotateCcw,
  CloudLightning,
  Droplet,
  Flame,
  Truck,
  Eye,
  Lock,
  Workflow,
  X,
  Smartphone,
  Gauge,
  UserCheck,
  ZapOff,
  CornerDownRight,
  HelpCircle,
  Volume2,
  MapPin,
  Navigation,
  BarChart3
} from "lucide-react";
import { CivicIssueReport, CivicCategory } from "../types";

interface OfficerDashboardProps {
  key?: any;
  reports: CivicIssueReport[];
  onSelectReport: (report: CivicIssueReport) => void;
  onUpdateStatus: (id: string, status: CivicIssueReport["status"]) => void;
  onExit?: () => void;
}

// Simulated real-time telemetry events
const INITIAL_EVENTS = [
  { id: 1, time: "10:31:02 AM", text: "AI Core flagged high-risk pothole on Valencia St intersection.", category: "detection" },
  { id: 2, time: "10:28:15 AM", text: "Water utility maintenance dispatch #08 acknowledged Crescent leakage.", category: "dispatch" },
  { id: 3, time: "10:19:44 AM", text: "Citizen validated hydrant seal fix at Library Parkway.", category: "resolution" },
  { id: 4, time: "10:05:12 AM", text: "Power load balancing route initialized in Sector 9.", category: "grid" },
];

import { useAuth } from "../context/AuthContext";

export function OfficerDashboard({
  reports,
  onSelectReport,
  onUpdateStatus,
  onExit,
}: OfficerDashboardProps) {
  const { user } = useAuth();
  // Navigation tabs of the Command Center
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "map" | "queue" | "departments" | "analytics" | "assistant" | "settings">("overview");
  
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedOverlay, setSelectedOverlay] = useState<"none" | "traffic" | "flood" | "power" | "garbage" | "heatmap">("none");
  const [liveEvents, setLiveEvents] = useState(INITIAL_EVENTS);
  const [activeAlertCount, setActiveAlertCount] = useState(3);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeNodeTelemetry, setActiveNodeTelemetry] = useState<string>("Core AI");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssueReport | null>(null);
  
  // Live updating resolution clock
  const [resolutionSeconds, setResolutionSeconds] = useState(48250);
  
  // AI Optimization state
  const [optimizingLoad, setOptimizingLoad] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  
  // Notifications panel state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Time stamp state
  const [currentTime, setCurrentTime] = useState("");

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString() + " | UTC-" + (date.getTimezoneOffset()/60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulating live telemetry events ticker
  useEffect(() => {
    const eventTimer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const eventPool = [
        { text: "Automated Dispatch: Grid repair crew #4 routing to Pine St outage.", category: "dispatch" },
        { text: "Asphalt wear indexes updated for Sector 12.", category: "detection" },
        { text: "District Satisfaction Rating increased to 92.4% following rapid road fixes.", category: "resolution" },
        { text: "Telemetry link established with emergency hydrant pressure valves.", category: "grid" },
        { text: "AI classification accuracy recalculated: average 96.8% precision.", category: "detection" }
      ];
      const randomEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
      setLiveEvents(prev => [
        { id: Date.now(), time: timeStr, text: randomEvent.text, category: randomEvent.category },
        ...prev.slice(0, 7)
      ]);
      setResolutionSeconds(s => s - Math.floor(Math.random() * 5));
    }, 8000);
    return () => clearInterval(eventTimer);
  }, []);

  // Compute stats
  const totalCount = reports.length;
  const criticalCount = reports.filter(r => r.severity === "high").length;
  const resolvedCount = reports.filter(r => r.status === "resolved").length;
  const pendingCount = reports.filter(r => r.status !== "resolved").length;
  const resolutionPercentage = totalCount ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Format seconds to text
  const formatSecondsToDuration = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs}h ${mins}m ${s}s`;
  };

  // Cards Mouse 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    
    const rotateX = ((y - rect.height / 2) / rect.height) * -8; // subtle rotate
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  // AI load balancing simulation trigger
  const runLoadBalancing = () => {
    setOptimizingLoad(true);
    setOptimizationProgress(0);
    setOptimizationComplete(false);
    
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setOptimizingLoad(false);
          setOptimizationComplete(true);
          // Add a telemetry event
          setLiveEvents(evs => [
            { id: Date.now(), time: new Date().toLocaleTimeString(), text: "AI system load-balancing completed successfully. Task loads redistributed.", category: "resolution" },
            ...evs
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // AI search auto-suggestions
  const suggestions = [
    { type: "Road Section", name: "Valencia Street Crossing Corridor", match: "high road damage reported" },
    { type: "Department", name: "Department of Public Works - Asphalt Division", match: "active workload optimal" },
    { type: "Citizen", name: "Marcus Thompson (Local Sector Leader)", match: "submitted 4 validated reports" },
    { type: "Report", name: "Hydrant rupture water loss #rep-water", match: "investigating status" },
  ];

  const filteredSuggestions = searchQuery 
    ? suggestions.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.type.toLowerCase().includes(searchQuery.toLowerCase()))
    : suggestions;

  return (
    <div className="w-full text-[#0A2540] font-sans antialiased selection:bg-indigo-500/10 flex flex-col relative">
      
      {/* 1. CLEAN LIGHT GRADIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full border border-blue-100/10 opacity-30 animate-spin" style={{ animationDuration: "140s" }} />
          <div className="absolute -top-[100px] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[80px]" />
          <div className="absolute top-[300px] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[80px]" />
        </div>
      </div>

      {/* 3. CORE DISPLAY WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* LEFT COMPACT HOVER SIDEBAR */}
        <aside 
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          className="hidden md:flex flex-col h-fit max-h-[calc(100vh-140px)] sticky top-24 shrink-0 z-30 transition-all duration-300"
          style={{ width: sidebarExpanded ? "210px" : "64px" }}
        >
          <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-8 h-auto relative overflow-hidden">
            
            {/* Subtle glow border effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />

            {/* Section links scrollable wrapper */}
            <div className="shrink overflow-y-auto pr-0.5 flex flex-col gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "overview", label: "Core Overview", icon: Cpu },
                { id: "map", label: "Live Twin 3D", icon: MapIcon },
                { id: "queue", label: "Issue Queue", icon: Inbox, badge: pendingCount },
                { id: "departments", label: "Sector Units", icon: Workflow },
                { id: "analytics", label: "Telemetry Charts", icon: TrendingUp },
                { id: "assistant", label: "AI Co-pilot", icon: Compass },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveSubTab(tab.id as any);
                      setSelectedIssue(null);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-300 relative group/btn cursor-pointer shrink-0 ${
                      isActive 
                        ? "bg-indigo-50 text-indigo-600 font-extrabold border border-indigo-100/50 shadow-xs" 
                        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                    }`}
                  >
                    {/* Glowing vertical slider bar */}
                    {isActive && (
                      <span className="absolute left-1 w-1 h-5 bg-indigo-500 rounded-full" />
                    )}

                    <div className={`p-0.5 transition-all duration-300 ${isActive ? "scale-105" : "group-hover/btn:scale-110"}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    {sidebarExpanded && (
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs tracking-wide truncate font-bold text-slate-700"
                      >
                        {tab.label}
                      </motion.span>
                    )}

                    {tab.badge !== undefined && tab.badge > 0 && sidebarExpanded && (
                      <span className="ml-auto bg-indigo-600 text-[9px] font-bold text-white rounded-full px-1.5 py-0.5">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Utilities sticky block */}
            <div className="border-t border-slate-100 pt-2.5 flex flex-col gap-1 shrink-0">
              
              {/* Reset to simulated database */}
              {onExit && (
                <button 
                  onClick={onExit}
                  className="flex items-center gap-3 p-2 text-indigo-600 hover:text-indigo-800 rounded-xl text-left hover:bg-indigo-50 transition cursor-pointer group"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
                  {sidebarExpanded && <span className="text-xs font-mono ml-1">Exit Console</span>}
                </button>
              )}

              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 p-2 text-red-500 hover:text-red-700 rounded-xl text-left hover:bg-red-50 transition cursor-pointer group mt-1"
              >
                <RotateCcw className="w-4 h-4 text-red-500 group-hover:rotate-180 transition-transform duration-500" />
                {sidebarExpanded && <span className="text-xs font-mono ml-1">Reset Console</span>}
              </button>

              {/* Theme status indicator */}
              <div className="flex items-center gap-3 p-2 text-[9px] text-slate-500 font-mono">
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                {sidebarExpanded && <span className="tracking-widest">GRID SECURE</span>}
              </div>
            </div>

          </div>
        </aside>

        {/* MAIN PANEL CONTENT VIEWPORT */}
        <main className="flex-1 min-w-0 pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            
            {/* A. OVERVIEW SUB-TAB VIEW */}
            {activeSubTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                
                {/* Greeting */}
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 font-display">
                    Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{user?.fullName || "Officer"}</span>
                  </h2>
                  <p className="text-slate-500 font-medium">Command Center is active and monitoring city infrastructure.</p>
                </div>

                {/* 1. TOP PREMIUM ANALYTICS CARDS ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  
                  {/* Card 1: Total Issues */}
                  <div 
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative bg-white border-2 border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Hover reflection overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
                         style={{ background: "radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.08), transparent)" }} />
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-extrabold block">Total Ingested</span>
                        <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 flex flex-wrap sm:flex-nowrap items-baseline gap-1 sm:gap-1.5">
                          {totalCount} <span className="text-[10px] sm:text-xs text-indigo-600 font-bold font-mono">+12% Today</span>
                        </div>
                      </div>
                      <div className="p-2 sm:p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shadow-sm shrink-0">
                        <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    {/* Mini SVG Sparkline */}
                    <div className="h-12 mt-3 w-full opacity-70 group-hover:opacity-100 transition-opacity relative">
                      <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.35)" />
                            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                          </linearGradient>
                          <linearGradient id="gridLines" x1="0" x2="100%" y1="0" y2="0">
                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.1)" />
                            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.3)" />
                            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.1)" />
                          </linearGradient>
                        </defs>
                        
                        {/* Background Grid Lines */}
                        <g className="animate-[pulse_4s_ease-in-out_infinite]">
                          {[10, 30, 50, 70, 90].map((x, i) => (
                            <line key={i} x1={x} y1="0" x2={x} y2="30" stroke="url(#gridLines)" strokeWidth="0.5" strokeDasharray="1 2" />
                          ))}
                          {[10, 20].map((y, i) => (
                            <line key={`h-${i}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(99, 102, 241, 0.15)" strokeWidth="0.5" />
                          ))}
                        </g>

                        {/* Area Fill */}
                        <motion.path 
                          d="M0,25 Q15,10 30,18 T60,12 T90,22 T100,8 L100,30 L0,30 Z" 
                          fill="url(#sparkGradient)" 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                        
                        {/* Line */}
                        <motion.path 
                          d="M0,25 Q15,10 30,18 T60,12 T90,22 T100,8" 
                          fill="none" 
                          stroke="rgba(99, 102, 241, 0.9)" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        
                        {/* Data Points */}
                        <g fill="white" stroke="rgba(99, 102, 241, 1)" strokeWidth="1.5">
                          {[
                            { cx: 0, cy: 25, d: 0.2 },
                            { cx: 30, cy: 18, d: 0.6 },
                            { cx: 60, cy: 12, d: 1.0 },
                            { cx: 100, cy: 8, d: 1.4 }
                          ].map((pt, i) => (
                            <motion.circle 
                              key={`pt-${i}`}
                              cx={pt.cx} cy={pt.cy} r="2"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.5, delay: pt.d, type: "spring" }}
                              className="drop-shadow-[0_0_3px_rgba(99,102,241,0.8)]"
                            />
                          ))}
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* Card 2: Resolved today with progress ring */}
                  <div 
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative bg-white border-2 border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
                         style={{ background: "radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.08), transparent)" }} />
                    <div className="flex items-center justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest font-extrabold block">Resolved Today</span>
                        <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-600">
                          {resolvedCount}
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold font-mono">Rate: {resolutionPercentage}% Closed</p>
                      </div>
                      
                      {/* Interactive Progress Ring */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                        <svg className="absolute w-full h-full -rotate-90">
                          <defs>
                            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          <circle cx="28" cy="28" r="24" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="3" fill="none" />
                          
                          {/* Inner dashed track */}
                          <circle cx="28" cy="28" r="20" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" strokeDasharray="2 3" fill="none" className="animate-[spin_20s_linear_infinite]" />
                          
                          <motion.circle 
                            cx="28" cy="28" r="24" 
                            stroke="url(#ringGradient)" 
                            strokeWidth="4" 
                            fill="none" 
                            strokeLinecap="round" 
                            filter="url(#glow)"
                            initial={{ strokeDasharray: "150.8", strokeDashoffset: 150.8 }}
                            animate={{ strokeDashoffset: 150.8 - (150.8 * resolutionPercentage) / 100 }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[11px] font-mono font-black text-slate-800 tracking-tight">{resolutionPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Pending Issues with Breakdown */}
                  <div 
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative bg-white border-2 border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
                         style={{ background: "radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(245, 158, 11, 0.08), transparent)" }} />
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5 z-10 relative w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-amber-600 uppercase tracking-widest block font-extrabold">Active Incidents</span>
                            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-600">
                              {pendingCount}
                            </div>
                          </div>
                          <div className="p-2 sm:p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 shadow-sm shrink-0">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2 text-[8px] font-mono font-bold mt-1.5 sm:mt-2">
                          <span className="text-red-700 bg-red-50 border border-red-200 px-1 py-0.5 rounded shadow-sm">{criticalCount} CRITICAL</span>
                          <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-1 py-0.5 rounded shadow-sm">{pendingCount - criticalCount} MEDIUM</span>
                        </div>
                        
                        {/* Mini Animated Bar Chart */}
                        <div className="h-6 mt-3 w-full flex items-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity relative">
                          {[
                            { h: "40%", c: "bg-amber-300", d: 0.1 },
                            { h: "70%", c: "bg-amber-400", d: 0.2 },
                            { h: "50%", c: "bg-amber-400", d: 0.3 },
                            { h: "90%", c: "bg-amber-500", d: 0.4 },
                            { h: "65%", c: "bg-amber-500", d: 0.5 },
                            { h: "100%", c: "bg-amber-600", d: 0.6 },
                            { h: "80%", c: "bg-amber-500", d: 0.7 },
                          ].map((bar, i) => (
                            <div key={`bar-${i}`} className="flex-1 rounded-t-sm flex items-end justify-center overflow-hidden" style={{ height: '100%' }}>
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: bar.h }}
                                transition={{ duration: 0.8, delay: bar.d, type: "spring", stiffness: 100 }}
                                className={`w-full rounded-t-sm ${bar.c} shadow-[0_0_5px_rgba(245,158,11,0.3)]`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Average Resolution Time */}
                  <div 
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative bg-white border-2 border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
                         style={{ background: "radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(139, 92, 246, 0.08), transparent)" }} />
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5 z-10 relative w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-purple-600 uppercase tracking-widest block font-extrabold line-clamp-1">Average Resolution</span>
                            <div className="text-sm sm:text-base font-black font-mono tracking-tight text-indigo-600 leading-none py-1 mt-1 break-all sm:break-normal">
                              {formatSecondsToDuration(resolutionSeconds)}
                            </div>
                          </div>
                          <div className="p-2 sm:p-2.5 bg-purple-50 border border-purple-100 rounded-xl text-purple-600 shadow-sm shrink-0">
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                          </div>
                        </div>
                        <p className="text-[8px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1 font-bold mt-1">
                          <Clock className="w-3 h-3 text-emerald-600 animate-pulse" /> LIVE DECAY CLOCK ACTIVE
                        </p>
                        
                        {/* Audio/Pulse Waveform Animation */}
                        <div className="h-6 mt-3 w-full flex items-center justify-between gap-[2px] opacity-70 group-hover:opacity-100 transition-opacity">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <motion.div
                              key={`wave-${i}`}
                              animate={{ 
                                height: ["20%", "100%", "30%", "80%", "20%"]
                              }}
                              transition={{ 
                                duration: 1.5 + Math.random(), 
                                repeat: Infinity, 
                                ease: "easeInOut",
                                delay: Math.random() * 2
                              }}
                              className="flex-1 bg-purple-400 rounded-full"
                              style={{ maxHeight: '100%' }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. HERO AREA: AI CITY COMMAND PANEL & REAL-TIME EVENT STREAM */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* HERO GRAPHIC PANEL (Column 8) */}
                  <div className="lg:col-span-8 bg-white border-2 border-slate-200/80 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[440px] shadow-md">
                    
                    {/* Glowing scanning laser lines */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent animate-[bounce_6s_ease-in-out_infinite]" />
                    </div>

                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <div className="space-y-1">
                        <h4 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" /> CYBERNETIC MUNICIPAL GRID
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">Tactical neural connections across major municipal services</p>
                      </div>
                      <div className="text-right text-[10px] font-mono bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-600 font-bold">
                        Telemetry: <span className="text-indigo-600">{activeNodeTelemetry}</span>
                      </div>
                    </div>

                    {/* HOLOGRAPHIC CONNECTION NETWORK PANEL */}
                    <div className="relative flex-1 flex my-6 h-[280px] sm:h-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 shadow-inner">
                      
                      <div className={`relative flex items-center justify-center transition-all duration-500 ${selectedNodeId ? 'w-full sm:w-[calc(100%-240px)] opacity-20 sm:opacity-80 scale-75 sm:scale-90 sm:-translate-x-6' : 'w-full scale-[0.6] sm:scale-100 translate-x-0'}`}>
                        {/* Orbital Background circles */}
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                          className="absolute w-[240px] h-[240px] rounded-full border border-indigo-200/50" 
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                          className="absolute w-[170px] h-[170px] rounded-full border-2 border-indigo-300/40 border-dashed" 
                        />
                        
                        {/* Connection lines using SVGs */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none min-w-[300px]">
                          <g stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.5">
                            {[
                              { x2: "20%", y2: "20%", d: 2 },
                              { x2: "80%", y2: "20%", d: 1.5 },
                              { x2: "15%", y2: "50%", d: 3 },
                              { x2: "85%", y2: "50%", d: 2.5 },
                              { x2: "25%", y2: "80%", d: 2.2 },
                              { x2: "75%", y2: "80%", d: 1.8 },
                            ].map((line, i) => (
                              <motion.line 
                                key={`line-${i}`}
                                x1="50%" y1="50%" x2={line.x2} y2={line.y2} 
                                strokeDasharray="6 6" 
                                animate={{ strokeDashoffset: [0, -24] }} 
                                transition={{ duration: line.d, repeat: Infinity, ease: "linear" }} 
                              />
                            ))}
                          </g>
                          {/* Data packets flowing */}
                          <g fill="rgba(99, 102, 241, 0.8)">
                            {[
                              { x2: "20%", y2: "20%", delay: 0 },
                              { x2: "80%", y2: "20%", delay: 0.5 },
                              { x2: "15%", y2: "50%", delay: 1 },
                              { x2: "85%", y2: "50%", delay: 0.2 },
                              { x2: "25%", y2: "80%", delay: 1.5 },
                              { x2: "75%", y2: "80%", delay: 0.8 },
                            ].map((pkt, i) => (
                              <motion.circle 
                                key={`pkt-${i}`}
                                r="3.5"
                                animate={{ 
                                  cx: ["50%", pkt.x2, "50%"],
                                  cy: ["50%", pkt.y2, "50%"],
                                  opacity: [0, 1, 0]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: pkt.delay }}
                                className="drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]"
                              />
                            ))}
                          </g>
                        </svg>

                        {/* CENTRAL HOLOGRAPHIC AI CORE SPHERE */}
                        <div 
                          onMouseEnter={() => setActiveNodeTelemetry("AI Core Master")}
                          onClick={() => setSelectedNodeId(selectedNodeId === 'core' ? null : 'core')}
                          className={`relative w-32 h-32 rounded-full flex items-center justify-center border cursor-pointer group transition-all duration-300 ${selectedNodeId === 'core' ? 'border-indigo-400 bg-indigo-100 shadow-[0_0_50px_rgba(99,102,241,0.4)] scale-110' : 'border-indigo-200 bg-indigo-50/80 shadow-[0_0_40px_rgba(99,102,241,0.15)] hover:scale-105'}`}
                        >
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-indigo-400/30 border-dashed" />
                          <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border-2 border-indigo-500/20 border-dotted" />
                          
                          <motion.div 
                            animate={{ scale: selectedNodeId === 'core' ? [1, 1.05, 1] : [1, 1.1, 1] }} 
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className={`w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.5)]`}
                          >
                            <Cpu className="w-7 h-7 text-white drop-shadow-md" />
                            <motion.span 
                              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                              className="absolute inset-0 rounded-full border-2 border-emerald-300" 
                            />
                          </motion.div>
                        </div>

                        {/* OUTSIDE SATELLITE CITY NODES */}
                        {[
                          { id: "water", label: "Water Grid", icon: Droplet, pos: "top-[-5%] sm:top-4 left-[10%] sm:left-[15%]", color: "text-blue-600", border: "border-blue-300", bg: "bg-blue-50/90", float: 0 },
                          { id: "power", label: "Electricity", icon: Zap, pos: "top-[-5%] sm:top-4 right-[10%] sm:right-[15%]", color: "text-yellow-600", border: "border-yellow-300", bg: "bg-yellow-50/90", float: 1 },
                          { id: "roads", label: "Roadways", icon: MapPin, pos: "top-1/2 -translate-y-1/2 left-[-10%] sm:left-4", color: "text-indigo-600", border: "border-indigo-300", bg: "bg-indigo-50/90", float: 2 },
                          { id: "sanitation", label: "Sanitation", icon: Truck, pos: "top-1/2 -translate-y-1/2 right-[-10%] sm:right-4", color: "text-emerald-600", border: "border-emerald-300", bg: "bg-emerald-50/90", float: 1.5 },
                          { id: "safety", label: "Safety / Police", icon: Shield, pos: "bottom-[-5%] sm:bottom-4 left-[15%] sm:left-[18%]", color: "text-red-600", border: "border-red-300", bg: "bg-red-50/90", float: 0.5 },
                          { id: "health", label: "Hospitals", icon: Activity, pos: "bottom-[-5%] sm:bottom-4 right-[15%] sm:right-[18%]", color: "text-purple-600", border: "border-purple-300", bg: "bg-purple-50/90", float: 2.5 },
                        ].map((node) => {
                          const Icon = node.icon;
                          const isSelected = selectedNodeId === node.id;
                          return (
                             <motion.div 
                               key={node.id}
                               animate={{ y: isSelected ? 0 : [0, -6, 0] }}
                               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: node.float }}
                               onMouseEnter={() => setActiveNodeTelemetry(node.label)}
                               onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                               className={`absolute ${node.pos} flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125 z-10' : 'hover:scale-110 opacity-90'}`}
                             >
                               <div className={`p-3 bg-white/95 backdrop-blur-sm border-2 rounded-2xl shadow-lg transition-all duration-300 ${isSelected ? `${node.bg} ${node.border} ring-4 ring-indigo-500/20 shadow-indigo-500/30` : `${node.color} ${node.border} hover:border-indigo-400 hover:shadow-indigo-500/20`}`}>
                                 <Icon className={`w-5 h-5 ${node.color} ${isSelected ? 'animate-bounce' : ''}`} />
                               </div>
                               <span className={`text-[9.5px] font-mono tracking-widest uppercase transition-colors bg-white/90 px-2 py-0.5 rounded shadow-sm backdrop-blur-sm border ${isSelected ? 'font-black text-indigo-700 border-indigo-300' : 'font-bold text-slate-600 border-slate-200'}`}>{node.label}</span>
                             </motion.div>
                          );
                        })}
                      </div>
                      
                      {/* SIDE SLIDE-OUT PANEL FOR SELECTED NODE */}
                      <AnimatePresence>
                        {selectedNodeId && (
                          <motion.div 
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="h-full w-full sm:w-[240px] border-l border-indigo-200/60 bg-white/95 backdrop-blur-xl shadow-[-15px_0_30px_-5px_rgba(0,0,0,0.1)] flex flex-col absolute right-0 top-0 bottom-0 z-20"
                          >
                            <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                               <div className="flex items-center justify-between">
                                 <h5 className="font-mono font-black text-indigo-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                   <BarChart3 className="w-4 h-4" /> Node Telemetry
                                 </h5>
                                 <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-slate-700 p-1 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200">
                                   <X className="w-4 h-4" />
                                 </button>
                               </div>
                               
                               <div className="space-y-3">
                                 <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 p-3.5 rounded-xl border border-indigo-100 relative overflow-hidden shadow-sm">
                                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-[shimmer_2s_infinite]" />
                                   <span className="block text-[9px] text-indigo-600 font-mono font-bold uppercase mb-0.5 relative z-10">Network Load</span>
                                   <div className="flex items-end gap-1.5 relative z-10">
                                     <span className="text-3xl font-black font-display tracking-tight text-slate-800">{Math.floor(Math.random() * 30 + 65)}%</span>
                                     <span className="text-[9px] font-bold text-emerald-600 mb-1.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse drop-shadow-[0_0_2px_rgba(16,185,129,0.8)]" /> OPTIMAL</span>
                                   </div>
                                 </div>
                                 
                                 <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                   <span className="block text-[9px] text-slate-500 font-mono font-bold uppercase mb-0.5">Active Incidents</span>
                                   <div className="flex items-end gap-1.5">
                                     <span className="text-2xl font-black font-display tracking-tight text-amber-600">{Math.floor(Math.random() * 12 + 1)}</span>
                                     <span className="text-[9px] font-bold text-slate-500 mb-1 font-mono tracking-widest">PENDING</span>
                                   </div>
                                 </div>
                                 
                                 <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                   <span className="block text-[9px] text-slate-500 font-mono font-bold uppercase mb-2">Latency Routing</span>
                                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                     <motion.div 
                                       animate={{ width: ["40%", "85%", "45%"] }}
                                       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                       className="h-full bg-indigo-500 rounded-full"
                                     />
                                   </div>
                                 </div>
                               </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] font-mono text-slate-500 font-semibold">
                      <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5 text-indigo-500" /> Auto-tuning neural routing lines active.</span>
                      <span className="text-emerald-600 tracking-wider animate-pulse font-bold">Monitoring Entire City</span>
                    </div>

                  </div>

                  {/* REAL-TIME EVENT TELEMETRY STREAM (Column 4) */}
                  <div className="lg:col-span-4 bg-white border-2 border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between max-h-[440px] shadow-md">
                    <div className="space-y-1 mb-3">
                      <h4 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-indigo-600" /> OPERATIONAL AUDIT FEED
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold">Live transaction ledger & AI tracking stream</p>
                    </div>

                    {/* Events list container */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar my-2">
                      <AnimatePresence initial={false}>
                        {liveEvents.map((evt) => (
                          <motion.div
                            key={evt.id}
                            initial={{ opacity: 0, x: -10, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: "auto" }}
                            exit={{ opacity: 0, x: 10, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-3 bg-slate-50/85 border border-slate-200/60 rounded-xl space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[8.5px] font-mono text-indigo-600 font-bold">{evt.time}</span>
                              <span className={`text-[7.5px] font-mono px-1 rounded uppercase tracking-widest font-black ${
                                evt.category === "detection" ? "bg-red-50 text-red-600 border border-red-100" :
                                evt.category === "dispatch" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                evt.category === "resolution" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                              }`}>
                                {evt.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-700 leading-normal font-semibold">{evt.text}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <button 
                        onClick={() => setLiveEvents(INITIAL_EVENTS)}
                        className="w-full text-center py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[9px] font-mono font-extrabold rounded-lg text-indigo-600 hover:text-indigo-800 transition cursor-pointer uppercase tracking-widest"
                      >
                        Flush Buffer
                      </button>
                    </div>
                  </div>

                </div>

                {/* 3. AI EXECUTIVE BRIEFING PANEL (Tactical intelligence card) */}
                <div className="bg-white border-2 border-slate-200/80 p-6 rounded-3xl relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                    <Sparkles className="w-32 h-32 text-indigo-600" />
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
                          Tactical Intelligence Briefing
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">Synthesized diagnostic executive analysis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-semibold">
                        Confidence Score: <span className="text-emerald-600 font-bold">98%</span>
                      </div>
                      <div className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-pulse font-bold">
                        Priority Threat Index: <span className="font-extrabold uppercase">High</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                      <span className="text-[8.5px] font-mono font-bold text-red-600 uppercase tracking-widest">Trend Anomalies</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        A clustering sequence has identified unusual asphalt weathering thresholds around school districts, demanding localized Public Works routing optimizations.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                      <span className="text-[8.5px] font-mono font-bold text-indigo-600 uppercase tracking-widest">Environmental Status</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        A water pipeline risk vector detected at Crescent Boulevard near Library park has triggered automated routing guidelines, raising localized hydrological capacity lists.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                      <span className="text-[8.5px] font-mono font-bold text-emerald-600 uppercase tracking-widest">AI Recommendations</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        Dispatch Eco-Disposal teams directly to clear construction scrap on Golden Gate Parkway walkway to clear pathway safety vectors. Use active grid routing models.
                      </p>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

            {/* B. MAP DIREC-TWIN SUB-TAB VIEW */}
            {activeSubTab === "map" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                
                {/* Header info */}
                <div className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1">
                    <h3 className="text-sm font-mono font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600 animate-pulse" /> Metro Sector 7 Digital Twin
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">Dynamic 3D vector-grid telemetry and overlay visualizations</p>
                  </div>
                  
                  {/* Select overlays panel */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "none", label: "Base Schematic", color: "bg-slate-100 text-slate-700 border-slate-200" },
                      { id: "traffic", label: "Traffic Density", color: "bg-red-50 text-red-600 border-red-200" },
                      { id: "flood", label: "Hydrant Flood Risk", color: "bg-blue-50 text-blue-600 border-blue-200" },
                      { id: "power", label: "Power Grid Outage", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
                      { id: "garbage", label: "Sanitation Routes", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                      { id: "heatmap", label: "Risk Hotspots", color: "bg-purple-50 text-purple-600 border-purple-200" },
                    ].map((overlay) => (
                      <button
                        key={overlay.id}
                        onClick={() => setSelectedOverlay(overlay.id as any)}
                        className={`px-3 py-1.5 text-[9.5px] font-mono font-extrabold uppercase rounded-lg border transition-all cursor-pointer ${
                          selectedOverlay === overlay.id 
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-sm" 
                            : "bg-white text-slate-600 border-slate-200 hover:text-indigo-600 hover:bg-slate-50"
                        }`}
                      >
                        {overlay.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* MAP FRAME (Column 8) */}
                  <div className="lg:col-span-8 bg-white border-2 border-slate-200/80 rounded-3xl p-5 relative overflow-hidden h-[440px] flex items-center justify-center shadow-md">
                    
                    {/* Isometric Map Visualization Canvas using SVG */}
                    <div className="w-full h-full relative flex items-center justify-center">
                      
                      {/* Grid Background */}
                      <svg className="w-full h-full absolute inset-0 text-slate-300/35" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="grid-map" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                            <rect width="40" height="40" fill="none" />
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                          </pattern>
                          <radialGradient id="hotspot-grad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                          </radialGradient>
                          <linearGradient id="powerline-grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#ca8a04" />
                          </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-map)" />
                        
                        {/* 3D Wireframe buildings representation */}
                        <g stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1.5" fill="rgba(99, 102, 241, 0.04)">
                          {/* Civic Hall */}
                          <polygon points="120,80 180,60 220,100 160,120" />
                          <polygon points="120,80 160,120 160,180 120,140" />
                          <polygon points="180,60 220,100 220,160 180,120" />
                          <polygon points="160,120 220,100 220,160 160,180" />
                          {/* Library tower */}
                          <polygon points="450,150 490,130 520,160 480,180" />
                          <polygon points="450,150 480,180 480,260 450,230" />
                          {/* Mission Block */}
                          <polygon points="280,280 340,260 380,300 320,320" />
                          <polygon points="280,280 320,320 320,380 280,340" />
                        </g>

                        {/* Intersecting glowing road networks */}
                        <g stroke="rgba(59, 130, 246, 0.2)" strokeWidth="4" fill="none">
                          <path d="M50,220 L650,220" />
                          <path d="M250,50 L250,380" />
                          <path d="M480,50 L480,380" />
                        </g>

                        {/* OVERLAYS CONDITIONS */}
                        
                        {/* 1. Traffic Overlay */}
                        {selectedOverlay === "traffic" && (
                          <g strokeWidth="5" fill="none" className="animate-pulse">
                            {/* Congested parts */}
                            <path d="M50,220 L250,220" stroke="#ef4444" />
                            <path d="M250,220 L480,220" stroke="#f59e0b" />
                            <path d="M480,220 L650,220" stroke="#10b981" />
                            <path d="M250,50 L250,180" stroke="#ef4444" />
                            <path d="M250,180 L250,380" stroke="#10b981" />
                          </g>
                        )}

                        {/* 2. Hydrant Flood Risk Overlay */}
                        {selectedOverlay === "flood" && (
                          <g fill="rgba(59, 130, 246, 0.1)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5">
                            <circle cx="480" cy="180" r="70" />
                            <circle cx="280" cy="300" r="50" />
                            {/* Blue wave lines */}
                            <path d="M460,170 Q480,160 500,170 T540,170" fill="none" stroke="#3b82f6" strokeWidth="1" />
                            <path d="M450,180 Q480,170 510,180 T530,180" fill="none" stroke="#3b82f6" strokeWidth="1" />
                          </g>
                        )}

                        {/* 3. Power Grid Outage */}
                        {selectedOverlay === "power" && (
                          <g stroke="url(#powerline-grad)" strokeWidth="2.5" fill="none">
                            {/* Power Lines networks */}
                            <path d="M50,120 L650,120" strokeDasharray="5 5" className="animate-[dash_10s_linear_infinite]" />
                            <path d="M350,50 L350,380" strokeDasharray="5 5" className="animate-[dash_10s_linear_infinite]" />
                            {/* Flashing power node warning */}
                            <circle cx="350" cy="120" r="10" fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" className="animate-ping" />
                            <circle cx="350" cy="120" r="5" fill="#eab308" />
                          </g>
                        )}

                        {/* 4. Sanitation Route overlay */}
                        {selectedOverlay === "garbage" && (
                          <g stroke="#10b981" strokeWidth="3" fill="none" strokeDasharray="8 4" className="animate-[dash_20s_linear_infinite]">
                            <path d="M50,220 L250,220 L250,350 L480,350 L480,220 M480,100 L650,100" />
                          </g>
                        )}

                        {/* 5. Heat Map overlay */}
                        {selectedOverlay === "heatmap" && (
                          <g>
                            <circle cx="220" cy="160" r="120" fill="url(#hotspot-grad)" />
                            <circle cx="450" cy="240" r="90" fill="url(#hotspot-grad)" />
                            <circle cx="150" cy="310" r="80" fill="url(#hotspot-grad)" />
                          </g>
                        )}

                      </svg>

                      {/* PULSING ACTIVE ISSUES MARKERS */}
                      {reports.map((report) => {
                        // Project lat-lng to schematic 2D positions for rich visuals
                        const isHigh = report.severity === "high";
                        const isResolved = report.status === "resolved";
                        
                        // Determing localized mapping coordinates
                        let x = 250;
                        let y = 220;
                        if (report.id === "rep-pothole") { x = 250; y = 220; }
                        else if (report.id === "rep-water") { x = 480; y = 180; }
                        else if (report.id === "rep-light") { x = 480; y = 300; }
                        else if (report.id === "rep-dump") { x = 120; y = 140; }
                        else {
                          // seed-based positioning
                          x = 100 + (parseInt(report.id.replace(/\D/g, "") || "4") % 5) * 110;
                          y = 80 + (parseInt(report.id.replace(/\D/g, "") || "7") % 4) * 80;
                        }

                        return (
                          <div 
                            key={report.id}
                            style={{ left: `${x}px`, top: `${y}px` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/marker cursor-pointer"
                            onClick={() => setSelectedIssue(report)}
                          >
                            <span className={`absolute inset-[-8px] rounded-full animate-ping pointer-events-none ${
                              isResolved ? "bg-emerald-500/20" : isHigh ? "bg-red-500/20" : "bg-amber-500/20"
                            }`} />
                            <div className={`w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/marker:scale-125 ${
                              isResolved ? "bg-emerald-500" : isHigh ? "bg-red-500" : "bg-amber-500"
                            }`}>
                              {isHigh ? <AlertTriangle className="w-2.5 h-2.5 text-white" /> : <Info className="w-2.5 h-2.5 text-white" />}
                            </div>

                            {/* In-map mini label tooltip */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 opacity-0 group-hover/marker:opacity-100 bg-slate-900 border border-slate-800 text-[9px] font-mono text-white px-2 py-1 rounded shadow-xl whitespace-nowrap transition-opacity pointer-events-none">
                              <span className="font-bold">{report.title}</span> ({report.severity})
                            </div>
                          </div>
                        );
                      })}

                    </div>

                    {/* Legends overlay */}
                    <div className="absolute bottom-4 left-4 bg-white/95 border-2 border-slate-200/80 p-3 rounded-xl backdrop-blur-md space-y-1.5 text-[9px] font-mono shadow-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                        <span className="text-slate-600 font-bold">High Threat Hazard</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                        <span className="text-slate-600 font-bold">Medium Warning</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                        <span className="text-slate-600 font-bold">Resolved Index</span>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/95 border-2 border-slate-200/80 px-3 py-1.5 rounded-xl backdrop-blur-md text-[9px] font-mono text-slate-500 shadow-md font-bold">
                      Sensor stream: <span className="text-emerald-600 font-black animate-pulse">STABLE</span>
                    </div>

                  </div>

                  {/* DIGITAL TWIN ACTIVE INSPECTION PANEL (Column 4) */}
                  <div className="lg:col-span-4 bg-white border-2 border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between h-[440px] shadow-md">
                    
                    <div className="space-y-4 flex-1">
                      <div className="space-y-1 border-b border-slate-100 pb-3">
                        <h4 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-indigo-600" /> Sensor Inspection
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">Active telemetry on focused GPS sector</p>
                      </div>

                      {selectedIssue ? (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-extrabold text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                              {selectedIssue.id}
                            </span>
                            <h5 className="text-xs font-black text-slate-900">{selectedIssue.title}</h5>
                            <p className="text-[10.5px] text-slate-600 leading-normal font-medium">{selectedIssue.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                              <span className="text-slate-500 block text-[8px] uppercase font-bold">Confidence</span>
                              <span className="text-indigo-600 font-extrabold">{(selectedIssue.confidence * 100).toFixed(0)}% Match</span>
                            </div>
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                              <span className="text-slate-500 block text-[8px] uppercase font-bold">Severity</span>
                              <span className={`font-extrabold uppercase ${
                                selectedIssue.severity === "high" ? "text-red-600" :
                                selectedIssue.severity === "medium" ? "text-amber-600" : "text-emerald-600"
                              }`}>{selectedIssue.severity}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-[10.5px]">
                            <span className="text-slate-500 font-mono text-[9px] uppercase block font-bold">Assigned Unit</span>
                            <p className="font-extrabold text-slate-700 flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> {selectedIssue.assigned_department}
                            </p>
                          </div>

                          {selectedIssue.user_image && (
                            <div className="h-28 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                              <img src={selectedIssue.user_image} className="w-full h-full object-cover brightness-95 hover:brightness-100 transition" />
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button 
                              onClick={() => onSelectReport(selectedIssue)}
                              className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/20 text-[10.5px] font-bold text-white rounded-xl transition cursor-pointer text-center"
                            >
                              Launch Operator File
                            </button>
                            <button 
                              onClick={() => setSelectedIssue(null)}
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10.5px] rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer font-bold"
                            >
                              Dismiss
                            </button>
                          </div>

                        </div>
                      ) : (
                        <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-8">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 animate-pulse">
                            <Compass className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-800">No Vector Inspected</h5>
                            <p className="text-[10px] text-slate-500 font-semibold mt-1 max-w-[180px] mx-auto">
                              Hover or select any active coordinate marker on the 3D twin grid.
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <div className="text-[8.5px] font-mono text-slate-500 text-center leading-normal font-bold">
                        GIS GPS Feed: 37.7712° N, 122.4111° W. Sector 7 telemetry online.
                      </div>
                    </div>

                  </div>

                </div>

              </motion.div>
            )}

            {/* C. ISSUE QUEUE SUB-TAB VIEW */}
            {activeSubTab === "queue" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                
                {/* Search & Filter Header block */}
                <div className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1">
                    <h3 className="text-sm font-mono font-bold text-indigo-600 uppercase tracking-widest">
                      AI Priority Dispatch Queue
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">Validated reports prioritized by severity & neural confidence metrics</p>
                  </div>
                  
                  {/* Select status filter */}
                  <div className="flex gap-2">
                    <select 
                      className="bg-white border-2 border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-hidden"
                      defaultValue="all"
                    >
                      <option value="all">All Status Modes</option>
                      <option value="open">Open Verification</option>
                      <option value="investigating">Operational Review</option>
                      <option value="assigned">Dispatched Crew</option>
                      <option value="resolved">Resolved / Archive</option>
                    </select>
                  </div>
                </div>

                {/* Grid of smart cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.map((report) => {
                    const isHigh = report.severity === "high";
                    const isResolved = report.status === "resolved";
                    
                    return (
                      <div 
                        key={report.id}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="relative bg-white border-2 border-slate-200/80 p-5 rounded-2xl shadow-md transition-all duration-200 overflow-hidden group flex flex-col justify-between gap-4"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
                             style={{ background: "radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.08), transparent)" }} />
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[8.5px] font-mono font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                              {report.id}
                            </span>
                            <div className="flex gap-1.5 text-[8.5px] font-mono font-bold">
                              <span className={`px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                                isResolved ? "bg-emerald-50 text-emerald-600 border-emerald-200 font-extrabold" :
                                report.status === "assigned" ? "bg-blue-50 text-blue-600 border-blue-200 font-extrabold" :
                                "bg-amber-50 text-amber-600 border-amber-200 font-extrabold"
                              }`}>
                                {report.status}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                                isHigh ? "bg-red-50 text-red-600 border-red-200 font-extrabold" : "bg-slate-50 text-slate-500 border-slate-200 font-extrabold"
                              }`}>
                                {report.severity}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-900 line-clamp-1">{report.title}</h4>
                            <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">{report.description}</p>
                          </div>

                          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-[10px] font-mono">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-bold">Location:</span>
                              <span className="text-slate-700 font-extrabold truncate max-w-[150px]">{report.location_hint}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-bold">AI Confidence:</span>
                              <span className="text-emerald-600 font-extrabold">{(report.confidence * 100).toFixed(0)}% Match</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => onSelectReport(report)}
                            className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10.5px] rounded-xl text-slate-600 hover:text-slate-800 transition cursor-pointer text-center font-extrabold"
                          >
                            Investigate
                          </button>
                          
                          {!isResolved ? (
                            <button 
                              onClick={() => onUpdateStatus(report.id, "resolved")}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-800 rounded-xl text-[10.5px] font-extrabold transition cursor-pointer"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-[10.5px] font-extrabold flex items-center justify-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Closed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            )}

            {/* D. SECTOR UNITS SUB-TAB VIEW */}
            {activeSubTab === "departments" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Intro banner */}
                <div className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl space-y-1 shadow-md">
                  <h3 className="text-sm font-mono font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-indigo-600" /> Sector Allocation & Department Performance
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">Automated workload balancing vectors and department execution capacities</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "Public Works - Roads Division", score: 94, tasks: 4, limit: 12, rec: "Maintain priority routing flow along Valencia St corridor.", color: "text-blue-600 border-blue-200" },
                    { name: "Water & Environmental Bureau", score: 88, tasks: 2, limit: 10, rec: "Evaluate water valve telemetry in Crescent parkway sector.", color: "text-indigo-600 border-indigo-200" },
                    { name: "Grid & Street Light Authority", score: 91, tasks: 3, limit: 8, rec: "Deploy grid repair teams to Pine St lighting array outage.", color: "text-purple-600 border-purple-200" },
                    { name: "Sanitation & Ecological Waste", score: 97, tasks: 1, limit: 15, rec: "All construction dumps on Golden Gate cleared.", color: "text-emerald-600 border-emerald-200" },
                    { name: "Traffic & Transit Operations", score: 84, tasks: 5, limit: 10, rec: "Redirect speed thresholds following Mission pothole hazards.", color: "text-amber-600 border-amber-200" },
                    { name: "Public Safety Division", score: 95, tasks: 2, limit: 8, rec: "Coordinate detour schedules near asphalt repairs.", color: "text-red-600 border-red-200" },
                  ].map((dept, idx) => (
                    <div 
                      key={idx}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className="relative bg-white border-2 border-slate-200/80 p-5 rounded-2xl shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between gap-4"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
                           style={{ background: "radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.08), transparent)" }} />
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900">{dept.name}</h4>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">Score: <span className="text-emerald-600 font-extrabold">{dept.score}%</span></span>
                        </div>

                        {/* Efficiency Ring and task load */}
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <svg className="absolute w-full h-full -rotate-90">
                              <circle cx="24" cy="24" r="18" stroke="rgba(0,0,0,0.05)" strokeWidth="3" fill="none" />
                              <circle cx="24" cy="24" r="18" stroke="#6366f1" strokeWidth="3.5" fill="none" 
                                      strokeDasharray="113" strokeDashoffset={113 - (113 * dept.score) / 100} 
                                      strokeLinecap="round" />
                            </svg>
                            <span className="text-[9px] font-mono font-extrabold text-indigo-600">{dept.score}%</span>
                          </div>
                          
                          <div className="space-y-1 text-[11px] font-mono">
                            <div className="text-slate-600 font-bold">Workload load: <span className="font-extrabold text-indigo-600">{dept.tasks} / {dept.limit}</span></div>
                            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(dept.tasks / dept.limit) * 100}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <span className="text-[8px] font-mono font-extrabold text-indigo-600 uppercase tracking-widest block">AI Recommendation</span>
                          <p className="text-[10px] text-slate-700 leading-normal font-bold italic">"{dept.rec}"</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] font-mono text-slate-500 font-bold">
                        <span>Dispatch capacity status</span>
                        <span className="text-emerald-600 font-extrabold">OPTIMAL</span>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* E. TELEMETRY CHARTS SUB-TAB VIEW */}
            {activeSubTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Intro */}
                <div className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl space-y-1 shadow-md">
                  <h3 className="text-sm font-mono font-bold text-indigo-600 uppercase tracking-widest">
                    Holographic Diagnostics & Telemetry
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">Statistical evaluations of public safety trends and municipal operations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Daily Ingestion Area Chart */}
                  <div className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl space-y-4 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-950">Daily Telemetry Ingestion</span>
                      <span className="text-[9px] font-mono text-indigo-600 uppercase tracking-wider font-extrabold">Weekly trend</span>
                    </div>
                    {/* SVG Chart */}
                    <div className="h-56 w-full flex items-end relative pb-6 pt-2">
                      <svg className="w-full h-full" viewBox="0 0 300 100">
                        <defs>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                        <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                        
                        {/* Filled Area */}
                        <path d="M0,80 Q40,50 80,70 T160,30 T240,60 T300,40 L300,100 L0,100 Z" fill="url(#chart-grad)" />
                        
                        {/* Glowing stroke line */}
                        <path d="M0,80 Q40,50 80,70 T160,30 T240,60 T300,40" fill="none" stroke="#6366f1" strokeWidth="2.5" />
                        
                        {/* Interactive dots */}
                        <circle cx="80" cy="70" r="4" fill="#6366f1" stroke="#fff" strokeWidth="1" />
                        <circle cx="160" cy="30" r="4" fill="#6366f1" stroke="#fff" strokeWidth="1" />
                        <circle cx="240" cy="60" r="4" fill="#6366f1" stroke="#fff" strokeWidth="1" />
                      </svg>
                      
                      {/* X labels */}
                      <div className="absolute bottom-0 inset-x-0 flex justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest px-2 font-bold">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>

                  {/* Citizen Satisfaction Donut */}
                  <div className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl space-y-4 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-950">Citizen Satisfaction Indices</span>
                      <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider font-extrabold">Historical high</span>
                    </div>
                    
                    <div className="h-56 w-full flex items-center justify-center gap-8">
                      {/* Donut graphic */}
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="absolute w-full h-full -rotate-90">
                          <circle cx="72" cy="72" r="54" stroke="rgba(0,0,0,0.03)" strokeWidth="8" fill="none" />
                          <circle cx="72" cy="72" r="54" stroke="#10b981" strokeWidth="8" fill="none" 
                                  strokeDasharray="339.12" strokeDashoffset={339.12 - (339.12 * 92.4) / 100} 
                                  strokeLinecap="round" />
                          <circle cx="72" cy="72" r="42" stroke="rgba(0,0,0,0.03)" strokeWidth="6" fill="none" />
                          <circle cx="72" cy="72" r="42" stroke="#6366f1" strokeWidth="6" fill="none" 
                                  strokeDasharray="263.76" strokeDashoffset={263.76 - (263.76 * 85.1) / 100} 
                                  strokeLinecap="round" />
                        </svg>
                        
                        <div className="text-center font-mono">
                          <span className="text-2xl font-black text-slate-900">92.4%</span>
                          <span className="text-[8px] text-slate-600 block uppercase font-extrabold">Overall index</span>
                        </div>
                      </div>

                      {/* Info items */}
                      <div className="space-y-3 font-mono text-[10.5px]">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                            Active Satisfaction (92.4%)
                          </span>
                          <p className="text-[9px] text-slate-500 leading-none font-bold">Measured following issue closure</p>
                        </div>
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700">
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                            Dispatch Accuracy (85.1%)
                          </span>
                          <p className="text-[9px] text-slate-500 leading-none font-bold">Automatic categorization velocity</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* F. AI ASSISTANT / COPILOT SUB-TAB VIEW */}
            {activeSubTab === "assistant" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                
                {/* Intro card */}
                <div className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl space-y-1 shadow-md">
                  <h3 className="text-sm font-mono font-bold text-indigo-600 uppercase tracking-widest">
                    Tactical Operations Co-pilot
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">Dynamic system optimization recommendations and resource balancing dashboards</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Optimizer actions panel (Column 8) */}
                  <div className="lg:col-span-8 bg-white border-2 border-slate-200/80 p-6 rounded-3xl space-y-6 shadow-md">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                        Neural Routing Optimization Engine
                      </span>
                      <h4 className="text-base font-black text-slate-900">Dynamic Task Load Redistribution</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Assess resource allocation matrices across Public Works, Water Utilities, and Municipal Grid crews. Tapping optimization balance routine reallocates personnel queues dynamically.
                      </p>
                    </div>

                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-700 font-bold">System Re-Routing Progress</span>
                        <span className="text-indigo-600 font-black">{optimizationProgress}%</span>
                      </div>
                      
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-100" style={{ width: `${optimizationProgress}%` }} />
                      </div>

                      {optimizationComplete && (
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Routing vector balance complete. Peak workloads successfully minimized by 18.4%.</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button 
                          onClick={runLoadBalancing}
                          disabled={optimizingLoad}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 font-bold shadow-xs"
                        >
                          <Cpu className="w-4 h-4" /> {optimizingLoad ? "Calculating Vectors..." : "Activate Load Balancing"}
                        </button>
                        
                        <button 
                          onClick={() => {
                            setOptimizationProgress(0);
                            setOptimizationComplete(false);
                          }}
                          className="px-3 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          Revert Routine
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <span className="text-[8.5px] font-mono font-black text-amber-700 uppercase tracking-widest">Expected Delays Forecast</span>
                        <p className="text-xs text-slate-700 leading-normal font-bold">
                          Expected travel delays of up to 12 minutes around 8th Ave during the upcoming Asphalt maintenance paving corridor.
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <span className="text-[8.5px] font-mono font-black text-blue-700 uppercase tracking-widest">Hydrological Pressure Drop</span>
                        <p className="text-xs text-slate-700 leading-normal font-bold">
                          Main water valve pressures stabilized following Crescent Blvd hydrant valve seals repair operations, reducing drainage risks.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* CO-PILOT ASSISTANT SIDE PANELS (Column 4) */}
                  <div className="lg:col-span-4 bg-white border-2 border-slate-200/80 p-5 rounded-3xl flex flex-col justify-between max-h-[440px] shadow-md">
                    <div className="space-y-4">
                      <div className="space-y-1 border-b border-slate-100 pb-3">
                        <h4 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-indigo-600 animate-pulse" /> Diagnostic Copilot
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">Localized hazard risk and environmental forecasts</p>
                      </div>

                      <div className="space-y-3">
                        
                        {[
                          { title: "Power Outage Risk Index", val: "Minimal (4%)", status: "STABLE", icon: Zap, color: "text-emerald-600" },
                          { title: "Rain Prediction Forecast", val: "Clear Skies (0%)", status: "NOMINAL", icon: CloudLightning, color: "text-emerald-600" },
                          { title: "Hydrological Flood Risk", val: "Low Sector 7 (12%)", status: "REVIEWING", icon: Droplet, color: "text-indigo-600" },
                          { title: "Road Blockage Density", val: "Critical (Mission corridor)", status: "WARNING", icon: AlertTriangle, color: "text-red-600" },
                        ].map((item, index) => {
                          const Icon = item.icon || Zap;
                          return (
                            <div key={index} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-indigo-600" />
                                <div className="text-left leading-tight">
                                  <span className="text-[10px] font-black text-slate-800 block">{item.title}</span>
                                  <span className="text-[8px] text-slate-500 font-mono font-bold">{item.val}</span>
                                </div>
                              </div>
                              <span className={`text-[8px] font-mono font-black border rounded px-1.5 py-0.5 tracking-wider ${
                                item.status === "STABLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                item.status === "WARNING" ? "bg-red-50 text-red-600 border-red-200" : "bg-indigo-50 text-indigo-600 border-indigo-200"
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          );
                        })}

                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <div className="text-[8px] font-mono text-slate-500 font-bold text-center leading-normal">
                        Neural Core Copilot v2.4. Adaptive GIS modeling active.
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE FLOATING ACTION NAV BAR (Like Apple UI Dock) */}
      <div className="md:hidden fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 border border-slate-200/50 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] px-4 sm:px-5 py-2 sm:py-2.5 backdrop-blur-xl flex items-center gap-4 sm:gap-6 pointer-events-auto w-[90%] max-w-[340px] justify-between transition-all">
        {[
          { id: "overview", label: "Core", icon: Cpu },
          { id: "map", label: "Twin 3D", icon: MapIcon },
          { id: "queue", label: "Queue", icon: Inbox, badge: pendingCount },
          { id: "assistant", label: "AI Co-pilot", icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setSelectedIssue(null);
              }}
              className="flex flex-col items-center justify-center text-center gap-1 group relative cursor-pointer flex-1"
            >
              <div className={`p-1.5 rounded-2xl transition-all duration-300 relative flex items-center justify-center ${
                isActive 
                  ? "text-indigo-600 bg-indigo-50/80 scale-110 shadow-sm" 
                  : "text-slate-400 hover:text-slate-700"
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[8.5px] font-bold tracking-wide transition-colors ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. NOTIFICATIONS SLIDEOUT TERMINAL PANEL */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
              onClick={() => setIsNotificationsOpen(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 sm:w-96 bg-white border-l border-slate-200 z-50 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-6 flex-1 flex flex-col min-h-0">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-indigo-600" /> Notifications Feed
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold">Validated operational hazard telemetry</p>
                  </div>
                  <button 
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Notifications items queue */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {[
                    { title: "🧠 Pothole Cluster flag", text: "AI Core flagged high wear asphalt anomalies around Valencia St sector.", time: "4m ago", type: "system" },
                    { title: "🚨 Pipeline Water Leakage danger", text: "A continuous hydrological pressure anomaly identified near Crescent Boulevard.", time: "18m ago", type: "emergency" },
                    { title: "👷 Crew Allocation verified", text: "Road Maintenance Team #4 dispatched successfully to Valencia St coordinates.", time: "40m ago", type: "team" },
                    { title: "🎉 Issue Closed successfully", text: "Sanitation cleared Golden Gate Parkway walkway. Resolution index 97.4%.", time: "2h ago", type: "resolution" },
                  ].map((notif, index) => (
                    <div key={index} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-black text-slate-800">{notif.title}</span>
                        <span className="text-[8px] font-mono text-slate-500 font-bold">{notif.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{notif.text}</p>
                    </div>
                  ))}
                </div>

              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close Notification Console
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. FOOTER LOGO & SYSTEM PARAMETERS */}
      <footer className="bg-slate-50 text-slate-500 border-t border-slate-200 py-6 text-center text-[10px] px-6 mt-12 relative z-10 font-mono">
        <div className="max-w-7xl mx-auto space-y-1.5">
          <p className="font-bold">© 2026 DISTRICT ADMINISTRATION SYSTEM & NEURAL GIS. COMMAND CLASSIFIED ACCREDITED USE.</p>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed uppercase font-semibold">
            Telemetry pipelines linked to regional Public Works, Water utilities and Transit operations networks.
          </p>
        </div>
      </footer>

    </div>
  );
}

// Internal Navigation item icon helper component so we don't have undeclared elements
function NavigationItemIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

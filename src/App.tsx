import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Shield,
  Activity,
  MapPin,
  Bell,
  Home,
  PlusCircle,
  Map as MapIcon,
  RefreshCw,
  Sliders,
  CheckCircle,
  HelpCircle,
  User,
  ShieldAlert,
  ArrowRight,
  Search,
  Settings,
  Cpu,
  Layers,
  Users,
  Terminal,
  Volume2,
  Trash2,
  Info,
  Calendar,
  Compass,
  ArrowUpRight,
  Heart,
  Globe,
  X
} from "lucide-react";

import { CivicCategory, CivicIssueReport } from "./types";
import { CitizenHome } from "./components/CitizenHome";
import { ReportIssue } from "./components/ReportIssue";
import { IssueDetailsScreen } from "./components/IssueDetailsScreen";
import { MapScreen } from "./components/MapScreen";
import { NotificationsScreen, CivicNotification } from "./components/NotificationsScreen";
import { OfficerDashboard } from "./components/OfficerDashboard";
import { LandingPage } from "./components/LandingPage";
import { CustomCursor } from "./components/CustomCursor";

// ==========================================
// 1. ROBUST SECTOR SAMPLE RECORDS
// ==========================================
const MOCK_HISTORIC_REPORTS: CivicIssueReport[] = [
  {
    id: "rep-pothole",
    timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    issue_type: "pothole",
    title: "Extreme asphalt crater blocking lane",
    description: "An incredibly deep pothole has opened up in the middle lane of 100 Feet Road. Multiple vehicles swerving dangerously into oncoming traffic to avoid hitting it.",
    location_hint: "100 Feet Road, Indiranagar, Bengaluru, India",
    severity: "high",
    confidence: 0.97,
    tags: ["asphalt-crater", "vehicle-hazard", "bengaluru-sector"],
    status: "assigned",
    assigned_department: "Bruhat Bengaluru Mahanagara Palike (BBMP) - Road Works Division",
    coordinates: { lat: 12.9716, lng: 77.6412 },
    user_image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80",
    admin_notes: "BBMP road maintenance crew scheduled to excavate and fill the pothole early Monday morning."
  },
  {
    id: "rep-water",
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    issue_type: "water_leak",
    title: "Broken municipal hydrant rupture",
    description: "Water is actively gushing onto the sidewalk from a subterranean valve malfunction, causing major pooling and pedestrian walkway blockages near the Inner Circle.",
    location_hint: "E-Block, Connaught Place, New Delhi, India",
    severity: "high",
    confidence: 0.94,
    tags: ["hydrant-leak", "sidewalk-pool", "delhi-water-loss"],
    status: "investigating",
    assigned_department: "Delhi Jal Board (DJB) - Emergency Response",
    coordinates: { lat: 28.6304, lng: 77.2177 },
    user_image: "https://images.unsplash.com/photo-1542013936693-8848e574047e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rep-light",
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    issue_type: "street_light_failure",
    title: "Dark promenade light grid outage",
    description: "A series of consecutive streetlights are completely out on the seaside promenade, rendering the pedestrian crossing almost invisible at night.",
    location_hint: "Marine Drive Promenade near Pillar 112, Mumbai, India",
    severity: "medium",
    confidence: 0.91,
    tags: ["zero-luminosity", "promenade-threat", "mumbai-grid"],
    status: "open",
    assigned_department: "Brihanmumbai Municipal Corporation (BMC) - Lighting Division",
    coordinates: { lat: 18.9430, lng: 72.8230 },
    user_image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rep-dump",
    timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    issue_type: "garbage_dump",
    title: "Illegal construction rubbish dumping",
    description: "Numerous sacks of concrete rubble, plaster sheets, and rusty iron rods have been dumped in the back alley, obstructing local pathways.",
    location_hint: "Anna Nagar Tower Park Outer Alley, Chennai, India",
    severity: "medium",
    confidence: 0.88,
    tags: ["rubbish-dump", "walkway-block", "chennai-ecology-risk"],
    status: "resolved",
    assigned_department: "Greater Chennai Corporation (GCC) - Solid Waste Management",
    coordinates: { lat: 13.0850, lng: 80.2101 },
    user_image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=400&q=80",
    admin_notes: "GCC sanitation crew dispatched and cleared the site. Checking CCTVs for truck tags."
  }
];

const INITIAL_NOTIFICATIONS: CivicNotification[] = [
  {
    id: "notif-1",
    reportId: "rep-pothole",
    title: "🧠 AI Autonomous Report Created",
    message: "Report classified as Pothole on 8th Ave with 97% accuracy. Routed to Roads Division.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: "ai",
    isRead: false,
  },
  {
    id: "notif-2",
    reportId: "rep-water",
    title: "🚨 Dispatch Crew En Route",
    message: "Water & Utilities division crew dispatched to Crescent Boulevard leak coordinates.",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    type: "status",
    isRead: false,
  },
  {
    id: "notif-3",
    reportId: "rep-dump",
    title: "🎉 Incident Resolved & Closed",
    message: "The construction dumping on Golden Gate Parkway has been successfully cleared and closed.",
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    type: "resolution",
    isRead: true,
  },
];

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { ForgotPassword } from "./pages/ForgotPassword";
import { useAuth } from "./context/AuthContext";

export function Dashboard() {
  const { user, logout } = useAuth();
  const role = user?.role || "citizen";
  const navigate = useNavigate();
  const [reports, setReports] = useState<CivicIssueReport[]>([]);
  const [notifications, setNotifications] = useState<CivicNotification[]>([]);
  
  // Navigation tabs: 'home' | 'report' | 'map' | 'insights' | 'my-reports' | 'community' | 'notifications' | 'settings' | 'officer'
  const [activeTab, setActiveTab] = useState<string>(role === "officer" ? "officer" : "home");
  const [focusedReport, setFocusedReport] = useState<CivicIssueReport | null>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Settings Configuration states
  const [selectedAIModel, setSelectedAIModel] = useState("gemini-1.5-flash");
  const [autoDispatchActive, setAutoDispatchActive] = useState(true);
  const [audioFeedbackOn, setAudioFeedbackOn] = useState(true);

  // Load and cache state
  useEffect(() => {
    const cachedReports = localStorage.getItem("civicmind_reports");
    const cachedNotifs = localStorage.getItem("civicmind_notifs");
    
    if (cachedReports) {
      try {
        setReports(JSON.parse(cachedReports));
      } catch {
        setReports(MOCK_HISTORIC_REPORTS);
      }
    } else {
      setReports(MOCK_HISTORIC_REPORTS);
      localStorage.setItem("civicmind_reports", JSON.stringify(MOCK_HISTORIC_REPORTS));
    }

    if (cachedNotifs) {
      try {
        setNotifications(JSON.parse(cachedNotifs));
      } catch {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
      localStorage.setItem("civicmind_notifs", JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }, []);

  const saveReports = (newReports: CivicIssueReport[]) => {
    setReports(newReports);
    localStorage.setItem("civicmind_reports", JSON.stringify(newReports));
  };

  const saveNotifications = (newNotifs: CivicNotification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem("civicmind_notifs", JSON.stringify(newNotifs));
  };

  // Add a new report from Intake Screen
  const handleAddReport = (newReport: CivicIssueReport) => {
    const updated = [newReport, ...reports];
    saveReports(updated);

    // Create a notification for it
    const newNotif: CivicNotification = {
      id: `notif-${Date.now()}`,
      reportId: newReport.id,
      title: "🧠 AI Multimodal Analysis Complete",
      message: `Issue "${newReport.title}" auto-classified as ${newReport.issue_type.replace("_", " ")} (${Math.round(newReport.confidence * 100)}% accuracy). Routed to department.`,
      timestamp: new Date().toISOString(),
      type: "ai",
      isRead: false,
    };

    saveNotifications([newNotif, ...notifications]);
  };

  // Update status from Officer/Staff Details
  const handleUpdateStatus = (id: string, newStatus: CivicIssueReport["status"]) => {
    const updated = reports.map((r) => {
      if (r.id === id) {
        const notif: CivicNotification = {
          id: `notif-${Date.now()}`,
          reportId: r.id,
          title: newStatus === "resolved" ? "🎉 Incident Resolved & Closed" : "🚨 Operational Update",
          message: `Incident status updated to [${newStatus.toUpperCase()}] for "${r.title}".`,
          timestamp: new Date().toISOString(),
          type: newStatus === "resolved" ? "resolution" : "status",
          isRead: false,
        };
        saveNotifications([notif, ...notifications]);

        return { ...r, status: newStatus };
      }
      return r;
    });

    saveReports(updated);
    
    if (focusedReport?.id === id) {
      setFocusedReport(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Save admin notes
  const handleSaveAdminNotes = (id: string, notes: string) => {
    const updated = reports.map((r) => {
      if (r.id === id) {
        return { ...r, admin_notes: notes };
      }
      return r;
    });
    saveReports(updated);

    if (focusedReport?.id === id) {
      setFocusedReport(prev => prev ? { ...prev, admin_notes: notes } : null);
    }
  };

  // Notifications handlers
  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    saveNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotifications(updated);
  };

  // Reset database helper
  const handleResetState = () => {
    saveReports(MOCK_HISTORIC_REPORTS);
    saveNotifications(INITIAL_NOTIFICATIONS);
    setFocusedReport(null);
    setActiveTab("home");
  };

  // Toggle navigation tab
  const handleNavigate = (tab: string) => {
    setFocusedReport(null);
    setActiveTab(tab);
  };

  // Drilldown selection
  const handleSelectReport = (report: CivicIssueReport) => {
    setFocusedReport(report);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#0A2540] font-sans antialiased selection:bg-[#1A73E8]/20 flex flex-col relative overflow-x-hidden">
      
      {/* GLOBAL CUSTOM CURSOR */}
      <CustomCursor />

      {/* TOP HEADER / NAVIGATION BAR (Clean, high-contrast, professional, minimalist) */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo element (Left) */}
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm font-bold transition-transform group-hover:scale-102">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900">
                  CivicMind
                </span>
                <span className="px-1.5 py-0.5 text-[8px] font-mono font-extrabold tracking-wider bg-indigo-50 border border-indigo-100 text-indigo-600 rounded">
                  OS ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search & Filter bar (Center) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl max-w-md w-full transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-500">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, municipal sectors..."
              className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden py-0.5"
            />
            {searchQuery && (
              <X 
                className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" 
                onClick={() => setSearchQuery("")} 
              />
            )}
          </div>

          {/* Navigation Controls (Right) */}
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{user?.fullName}</div>
                <div className="text-[10px] text-slate-500 capitalize">{role}</div>
              </div>
              {user?.avatar && (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                  <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover bg-indigo-50" />
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="h-8 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer flex items-center justify-center shadow-sm"
            >
              Log out
            </button>

          </div>
        </div>
      </header>
      
      {/* GLOWING AMBIENT BACKGROUND SYSTEM */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full border border-blue-100/20 opacity-30 animate-spin" style={{ animationDuration: "140s" }} />
        <div className="absolute -top-[100px] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[80px]" />
        <div className="absolute top-[300px] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[80px]" />
      </div>

      {/* 2. SYSTEM WORKSPACE CONTAINER WITH LEFT SIDEBAR NAVIGATION */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 relative flex gap-6 z-10">
        
        {/* LEFT FLOATING SIDEBAR (Desktop layout) */}
        {role === "citizen" && !focusedReport && (
          <aside 
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
            className="hidden md:flex flex-col justify-between h-[calc(100vh-140px)] sticky top-24 shrink-0 z-30 transition-all duration-300"
            style={{ width: sidebarExpanded ? "240px" : "80px" }}
          >
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-2 h-full relative overflow-y-auto no-scrollbar group/sidebar">
              
              {/* Subtle back glowing outline */}
              <div className="absolute inset-0 bg-radial-gradient from-blue-50/10 to-transparent pointer-events-none" />

              {/* Sidebar Menu Items */}
              {[
                { id: "home", label: "Dashboard", icon: Home },
                { id: "report", label: "Report Issue", icon: PlusCircle },
                { id: "map", label: "Nearby Issues", icon: MapIcon },
                { id: "insights", label: "AI Insights", icon: Cpu },
                { id: "my-reports", label: "My Reports", icon: Shield },
                { id: "community", label: "Community", icon: Users },
                { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all duration-300 relative group/btn cursor-pointer ${
                      isActive 
                        ? "bg-[#1A73E8]/10 text-[#1A73E8] font-bold shadow-xs border border-blue-100/30" 
                        : "text-slate-500 hover:text-[#1A73E8] hover:bg-slate-50"
                    }`}
                  >
                    {/* Glowing highlight point on active */}
                    {isActive && (
                      <span className="absolute left-1 w-1.5 h-6 bg-[#1A73E8] rounded-full" />
                    )}

                    <div className={`p-0.5 rounded-xl transition-all duration-300 relative ${
                      isActive ? "scale-105" : "group-hover/btn:scale-110 group-hover/btn:rotate-6"
                    }`}>
                      <Icon className="w-5 h-5 shrink-0" />
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white" />
                      )}
                    </div>

                    {/* Expandable Label */}
                    {sidebarExpanded && (
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs tracking-wide truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}

                    {/* Mini floating popover count indicator */}
                    {item.badge !== undefined && item.badge > 0 && sidebarExpanded && (
                      <span className="ml-auto bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[8.5px] font-bold">
                        {item.badge}
                      </span>
                    )}

                  </button>
                );
              })}

              <div className="border-t border-slate-100 pt-3 mt-auto">
                <div className="flex items-center gap-3 p-2.5 text-[10px] text-slate-400 font-mono">
                  <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                  {sidebarExpanded && <span>OS: SECURE_LIVE</span>}
                </div>
              </div>

            </div>
          </aside>
        )}

        {/* MAIN DISPLAY VIEWPORT PANEL */}
        <main className="flex-1 min-w-0 pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            
            {/* DRILLDOWN LEVEL 1 SHEET: Interactive Report Details Sheet */}
            {focusedReport ? (
              <IssueDetailsScreen
                key="details-screen"
                report={focusedReport}
                onBack={() => setFocusedReport(null)}
                onUpdateStatus={handleUpdateStatus}
                onSaveAdminNotes={handleSaveAdminNotes}
                isStaff={role === "officer"}
              />
            ) : (
              
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1 }}
                className="w-full"
              >
                
                {activeTab === "home" && (
                  <CitizenHome
                    key="home-tab"
                    reports={reports}
                    onQuickAction={(action) => handleNavigate("report")}
                    onSelectReport={handleSelectReport}
                    onNavigateToTab={handleNavigate}
                    unreadCount={unreadCount}
                    handleAddReport={handleAddReport}
                  />
                )}

                {activeTab === "report" && (
                  <ReportIssue
                    key="report-tab"
                    onAddReport={handleAddReport}
                    onNavigateToTab={handleNavigate}
                  />
                )}

                {activeTab === "map" && (
                  <MapScreen
                    key="map-tab"
                    reports={reports}
                    onSelectReport={handleSelectReport}
                    activeReport={focusedReport}
                    setActiveReport={setFocusedReport}
                  />
                )}

                {activeTab === "notifications" && (
                  <NotificationsScreen
                    key="notifications-tab"
                    notifications={notifications}
                    reports={reports}
                    onSelectReport={handleSelectReport}
                    onMarkAllRead={handleMarkAllRead}
                    onClearAll={handleClearAll}
                    onToggleRead={handleToggleRead}
                  />
                )}

                {activeTab === "officer" && (
                  <OfficerDashboard
                    key="officer-tab"
                    reports={reports}
                    onSelectReport={handleSelectReport}
                    onUpdateStatus={handleUpdateStatus}
                    onExit={() => {
                      setActiveTab("home");
                    }}
                  />
                )}

                {/* FUTURISTIC SPECIAL EXTRA SUB-VIEWS IN THE AI OS */}
                
                {/* A. AI INSIGHTS VIEW */}
                {activeTab === "insights" && (
                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-xl text-[#1A73E8]">
                          <Cpu className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-display text-[#0A2540]">Neural Insights & Diagnostics</h3>
                          <p className="text-xs text-slate-400">Automated wear indexing and regional public safety diagnostics</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Diagnostic summary */}
                      <div className="md:col-span-8 bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
                        <h4 className="text-sm font-bold text-slate-700">Predictive District Telemetry Stream</h4>
                        <div className="space-y-4">
                          {[
                            { title: "Mission Sector Asphalt Aging Curve", rate: "84% wear threshold", severity: "High risk predicted in 18 days", color: "bg-red-500" },
                            { title: "Crescent Boulevard Drainage Velocity", rate: "Optimal flow volume", severity: "Hydrant closure successful", color: "bg-emerald-500" },
                            { title: "Flicker Rate Analysis (Pine St)", rate: "0.14Hz grid oscillation", severity: "Grid outage suspected, crew dispatch assigned", color: "bg-amber-500" }
                          ].map((ins, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-[#0A2540]">{ins.title}</h5>
                                <p className="text-[10px] font-semibold text-slate-400">{ins.severity}</p>
                              </div>
                              <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${ins.color}`} />
                                {ins.rate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Diagnostic parameters */}
                      <div className="md:col-span-4 bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
                        <h4 className="text-sm font-bold text-[#0A2540]">Cognitive Parameters</h4>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between items-center text-slate-500">
                            <span>NLP parser threshold:</span>
                            <span className="font-mono text-[#1A73E8] font-bold">0.92</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: "92%" }} />
                          </div>
                          
                          <div className="flex justify-between items-center text-slate-500 pt-2">
                            <span>Image pixel confidence:</span>
                            <span className="font-mono text-[#1A73E8] font-bold">0.97</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#1a73e8] rounded-full" style={{ width: "97%" }} />
                          </div>

                          <div className="bg-[#F4F8FD] border border-blue-100 rounded-2xl p-4.5 mt-4 space-y-2">
                            <span className="text-[9px] font-mono font-bold text-[#1A73E8] uppercase tracking-wide">Cognitive Core</span>
                            <p className="text-[10.5px] text-slate-600 leading-relaxed">
                              CityOS uses multimodal transformer networks to parse speech transcripts, classify optical camera feeds, and dynamically route task payloads.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* B. MY REPORTS VIEW */}
                {activeTab === "my-reports" && (
                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-xl text-[#1A73E8]">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-display text-[#0A2540]">My Civic Action Dispatch Feed</h3>
                          <p className="text-xs text-slate-400">Track structural issues uploaded under your active citizen session</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-xs min-h-[300px] flex flex-col justify-center items-center text-center space-y-4">
                      {reports.filter(r => r.tags.includes("citizen-report") || r.id.startsWith("rep-")).length > 0 ? (
                        <div className="w-full text-left space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pl-1">Ingested Items</h4>
                          <div className="grid grid-cols-1 gap-4">
                            {reports.map((r, rIdx) => (
                              <div key={rIdx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-200/50 shadow-inner">
                                    <img src={r.user_image || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=100&q=80"} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <h5 className="text-sm font-bold text-[#0A2540]">{r.title}</h5>
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-red-500" /> {r.location_hint}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className={`px-2 py-1 rounded-md text-[9px] font-bold font-mono tracking-wider uppercase bg-blue-100 text-[#1A73E8]`}>
                                    {r.status}
                                  </span>
                                  <button 
                                    onClick={() => handleSelectReport(r)}
                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#1A73E8]"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1A73E8]">
                            <PlusCircle className="w-6 h-6 animate-pulse" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#0A2540]">Zero Ingested Reports Active</h4>
                            <p className="text-xs text-slate-400 mt-1">Submit your camera, voice, or text payload on the dashboard menu.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* C. COMMUNITY BOARD VIEW */}
                {activeTab === "community" && (
                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-xl text-[#1A73E8]">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-display text-[#0A2540]">District Community Operations</h3>
                          <p className="text-xs text-slate-400">Collaboration goals, upvoted hazard resolutions, and safety indices</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Community achievements */}
                      <div className="md:col-span-8 bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
                        <h4 className="text-sm font-bold text-slate-700">Joint Citizen Achievements</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { title: "Valencia Street Light Restructure", desc: "Goal met to secure nighttime crossing luminosity index.", progress: "100%", comp: "Fully Completed", color: "text-emerald-500" },
                            { title: "District Pothole Cleaning Challenge", desc: "Citizen-driven flagging mapping 124 patches in 14 days.", progress: "94%", comp: "94% target reached", color: "text-[#1A73E8]" },
                          ].map((ach, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                              <h5 className="text-xs font-bold text-[#0A2540]">{ach.title}</h5>
                              <p className="text-[10px] text-slate-400 leading-normal">{ach.desc}</p>
                              
                              <div className="space-y-1 pt-1">
                                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                  <span>District Goal Target</span>
                                  <span className={ach.color}>{ach.progress}</span>
                                </div>
                                <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#1A73E8] rounded-full" style={{ width: ach.progress }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Local city news bulletin */}
                      <div className="md:col-span-4 bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4">
                        <h4 className="text-sm font-bold text-[#0A2540]">Announcements</h4>
                        <div className="space-y-3 text-xs">
                          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/50 text-[11px] leading-relaxed">
                            <span className="font-mono text-[#1A73E8] font-bold uppercase tracking-wider text-[9px] block">Notice #434</span>
                            Road paving crew #12 starting cold-asphalt operations along 8th Avenue crossing corridor next Tuesday. Speed reductions active.
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* D. SETTINGS PANEL */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-xl text-[#1A73E8]">
                          <Settings className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-display text-[#0A2540]">CityOS Settings Configuration</h3>
                          <p className="text-xs text-slate-400">Fine-tune automated modeling dispatch rates and localized GIS thresholds</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-xs max-w-xl space-y-6">
                      
                      {/* Toggle AI weight options */}
                      <div className="space-y-4 text-xs">
                        <h4 className="text-sm font-bold text-slate-700">Model Specifications</h4>
                        <div className="space-y-3">
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">
                              Active Cognitive Engine
                            </label>
                            <select 
                              value={selectedAIModel} 
                              onChange={(e) => setSelectedAIModel(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-600 focus:outline-hidden"
                            >
                              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default optimized speed)</option>
                              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep diagnostic reasoning)</option>
                              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Advanced video multi-modal)</option>
                            </select>
                          </div>

                          {/* Toggle switches */}
                          <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                            <div>
                              <span className="font-bold text-slate-600 block">Automated Dispatch Tunneling</span>
                              <p className="text-[10px] text-slate-400">Directly route high-confidence dispatches to regional crew bosses</p>
                            </div>
                            <button 
                              onClick={() => setAutoDispatchActive(!autoDispatchActive)}
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                autoDispatchActive ? "bg-[#1A73E8]" : "bg-slate-200"
                              }`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                autoDispatchActive ? "right-1" : "left-1"
                              }`} />
                            </button>
                          </div>

                          <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                            <div>
                              <span className="font-bold text-slate-600 block">System Audio Feedback NLP</span>
                              <p className="text-[10px] text-slate-400">Generate voice transcripts directly inside browser telemetry containers</p>
                            </div>
                            <button 
                              onClick={() => setAudioFeedbackOn(!audioFeedbackOn)}
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                audioFeedbackOn ? "bg-[#1A73E8]" : "bg-slate-200"
                              }`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                audioFeedbackOn ? "right-1" : "left-1"
                              }`} />
                            </button>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </main>

      </div>

      {/* 3. MOBILE FLOATING ACTION NAV BAR (Fallback on smaller viewports) */}
      {role === "citizen" && !focusedReport && (
        <div className="md:hidden fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 border border-slate-200/50 rounded-3xl shadow-lg px-4 sm:px-5 py-2 sm:py-2.5 backdrop-blur-md flex items-center gap-4 sm:gap-6 pointer-events-auto w-[90%] max-w-[320px] justify-between">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "report", label: "Report", icon: PlusCircle },
            { id: "map", label: "Explore Map", icon: MapIcon },
            { id: "notifications", label: "Inbox", icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                className="flex flex-col items-center justify-center text-center gap-1 group relative cursor-pointer"
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 relative ${
                  isActive 
                    ? "text-[#1A73E8] bg-blue-50/70 scale-105" 
                    : "text-slate-400 hover:text-slate-700"
                }`}>
                  <Icon className="w-5 h-5" />
                  {tab.id === "notifications" && unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-ping" />
                  )}
                </div>
                <span className={`text-[9px] font-bold tracking-wide ${isActive ? "text-[#1A73E8]" : "text-slate-400"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      )}



    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route
        path="/citizen/dashboard/*"
        element={
          <ProtectedRoute allowedRole="citizen">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/dashboard/*"
        element={
          <ProtectedRoute allowedRole="officer">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute allowedRole="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

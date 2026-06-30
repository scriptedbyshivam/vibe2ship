import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle,
  MapPin,
  ChevronRight,
  TrendingUp,
  Activity,
  User,
  ExternalLink,
  ChevronDown,
  Info
} from "lucide-react";
import { CivicCategory, CivicIssueReport } from "../types";

// ==========================================
// 1. PRIORITY BADGE
// ==========================================
interface PriorityBadgeProps {
  severity: "low" | "medium" | "high";
}

export function PriorityBadge({ severity }: PriorityBadgeProps) {
  const styles = {
    high: "bg-rose-50/80 text-rose-700 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
    medium: "bg-amber-50/80 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    low: "bg-emerald-50/80 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  };

  const labels = {
    high: "CRITICAL PRIORITY",
    medium: "MODERATE PRIORITY",
    low: "ROUTINE",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border uppercase ${styles[severity]}`}
    >
      <span className={`w-1.5 height-1.5 rounded-full animate-pulse ${
        severity === "high" ? "bg-rose-500" : severity === "medium" ? "bg-amber-500" : "bg-emerald-500"
      }`} style={{ width: "6px", height: "6px" }} />
      {labels[severity]}
    </span>
  );
}

// ==========================================
// 2. STATUS CHIP
// ==========================================
interface StatusChipProps {
  status: "open" | "investigating" | "assigned" | "resolved";
}

export function StatusChip({ status }: StatusChipProps) {
  const styles = {
    open: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50",
    investigating: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50",
    assigned: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50",
    resolved: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/50",
  };

  const labels = {
    open: "Unassigned",
    investigating: "Under Review",
    assigned: "Dispatched",
    resolved: "Resolved",
  };

  const icons = {
    open: Clock,
    investigating: Activity,
    assigned: User,
    resolved: CheckCircle,
  };

  const IconComponent = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      {labels[status]}
    </span>
  );
}

// ==========================================
// 3. AI INSIGHT CARD
// ==========================================
interface AIInsightCardProps {
  report: Partial<CivicIssueReport>;
  expandedByDefault?: boolean;
}

export function AIInsightCard({ report, expandedByDefault = true }: AIInsightCardProps) {
  const [isOpen, setIsOpen] = React.useState(expandedByDefault);
  const confidencePercent = Math.round((report.confidence || 0.9) * 100);

  const getReasoning = (type: CivicCategory | undefined, severity: string | undefined) => {
    switch (type) {
      case "pothole":
      case "road_damage":
        return [
          "Vehicle safety hazard: Potential tire blows or sudden lane swerves.",
          severity === "high" 
            ? "Located on an active municipal commuter route with high-speed traffic."
            : "Surface degradation matches typical road fatigue patterns.",
          "Sub-base integrity compromised: Water pooling observed near the impact point."
        ];
      case "water_leak":
      case "drainage_issue":
        return [
          "Erosion risk: Sub-surface soil washout and pavement cracking detected.",
          "High flow rate: Rate of discharge presents a public safety slip hazard.",
          "Infrastructure drain on city resources with active resource loss."
        ];
      case "street_light_failure":
        return [
          "Zero luminosity: Safety threat for pedestrians after twilight.",
          "Strategic intersection context with elevated pedestrian crossings nearby.",
          "Grid report indicates potential power relay or ballast circuit failure."
        ];
      case "garbage_dump":
        return [
          "Ecological hazard: Public walkway blockages and sanitary concerns.",
          "Risk of local wildlife vectors or runoffs into local sewer grid.",
          "Requires immediate waste containment and code enforcement dispatch."
        ];
      default:
        return [
          "Identified via multi-modal descriptor mapping.",
          "Confidence rating calculated against local municipal data dictionaries.",
          "Priority dispatch suggested to the closest regional supervisor."
        ];
    }
  };

  const reasons = getReasoning(report.issue_type, report.severity);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-5 shadow-sm">
      {/* Accent sparkles background */}
      <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 pointer-events-none">
        <Sparkles className="w-24 h-24 text-indigo-500 animate-pulse" />
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              CivicMind AI Analysis Complete
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Autonomous Multimodal Telemetry Report
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4"
        >
          {/* Key metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 block">Report Classification</span>
              <span className="text-sm font-semibold capitalize text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {(report.issue_type || "other").replace("_", " ")}
              </span>
            </div>
            
            <div className="bg-white/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 block">AI Confidence Score</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{confidencePercent}%</span>
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 block">Suggested Priority</span>
              <div className="mt-1">
                <PriorityBadge severity={report.severity || "medium"} />
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              Decision Reasoning (Why this rating?):
            </h5>
            <ul className="space-y-1.5">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <span className="text-indigo-500 font-bold mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          {report.tags && report.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {report.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] font-medium border border-blue-100/50 dark:border-blue-900/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// 4. ISSUE CARD
// ==========================================
interface IssueCardProps {
  key?: any;
  report: CivicIssueReport;
  onClick?: () => void;
  isActive?: boolean;
}

export function IssueCard({ report, onClick, isActive = false }: IssueCardProps) {
  const dateFormatted = new Date(report.timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative ${
        isActive
          ? "border-blue-500 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-950/20 shadow-sm"
          : "border-slate-100 bg-white hover:border-slate-200 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge severity={report.severity} />
            <StatusChip status={report.status} />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pt-1">
            {report.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {report.description}
          </p>
        </div>
        
        {report.user_image && (
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-inner">
            <img 
              src={report.user_image} 
              alt="Report thumbnail" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100/80 dark:border-slate-800/60 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[150px] sm:max-w-[200px]">
            {report.location_hint || "No Location Listed"}
          </span>
        </div>
        <span>{dateFormatted}</span>
      </div>
    </motion.div>
  );
}

// ==========================================
// 5. TIMELINE VIEW
// ==========================================
interface TimelineViewProps {
  status: "open" | "investigating" | "assigned" | "resolved";
  department: string;
  adminNotes?: string;
  timestamp: string;
}

export function TimelineView({ status, department, adminNotes, timestamp }: TimelineViewProps) {
  const steps = [
    {
      key: "open",
      title: "Citizen Intake & AI Telemetry Received",
      desc: "多源多模态 CivicMind 边缘感知网关入库归档",
      date: new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      completed: true,
    },
    {
      key: "investigating",
      title: "AI Analysis & Dispatch Processing",
      desc: "Emergency safety ranking assessed. Categorized and verified.",
      date: status !== "open" ? "System Core" : "Pending",
      completed: status !== "open",
    },
    {
      key: "assigned",
      title: "Assigned to Local Department",
      desc: department || "Matching dispatch units...",
      date: (status === "assigned" || status === "resolved") ? "Dispatched" : "In Queue",
      completed: status === "assigned" || status === "resolved",
    },
    {
      key: "resolved",
      title: "Resolved & Citizen Informed",
      desc: adminNotes || "Resolving pending inspection...",
      date: status === "resolved" ? "Archived" : "Awaiting Actions",
      completed: status === "resolved",
    },
  ];

  return (
    <div className="space-y-5">
      <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
        Resolution Dispatch Timeline
      </h4>
      <div className="relative pl-6 border-l border-slate-100 dark:border-slate-800 space-y-6">
        {steps.map((step, idx) => {
          const isActive = step.completed;
          return (
            <div key={idx} className="relative">
              {/* Dot indicator */}
              <div
                className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </div>

              {/* Step info */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-4">
                  <h5 className={`text-xs font-semibold ${isActive ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"}`}>
                    {step.title}
                  </h5>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600">{step.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-500 max-w-md">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 6. MAP PIN CARD (POPUP DIALOG OVERLAY)
// ==========================================
interface MapPinCardProps {
  report: CivicIssueReport;
  onClose?: () => void;
  onViewDetails?: () => void;
}

export function MapPinCard({ report, onClose, onViewDetails }: MapPinCardProps) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-80 max-w-[calc(100vw-32px)] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xl p-4 z-50 pointer-events-auto">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PriorityBadge severity={report.severity} />
            <StatusChip status={report.status} />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 mt-1">
            {report.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {report.description}
          </p>
        </div>
        
        {report.user_image && (
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border shrink-0">
            <img src={report.user_image} alt="Issue preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/60">
        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate max-w-[120px]">{report.location_hint || "Unmapped Location"}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Dismiss
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1 transition-all"
            >
              Verify <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. LOADING SKELETON
// ==========================================
export function LoadingSkeleton() {
  return (
    <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-20 h-5 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="w-20 h-5 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
        <div className="w-12 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="w-5/6 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
        <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  );
}

// ==========================================
// 8. DASHBOARD STATS CARD
// ==========================================
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ElementType;
  color?: string;
}

export function DashboardStatsCard({
  title,
  value,
  subtitle,
  trend,
  trendUp = true,
  icon: Icon,
  color = "blue",
}: StatsCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="p-5 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-start justify-between gap-4"
    >
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block">
          {title}
        </span>
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {value}
        </span>
        <div className="flex items-center gap-1.5 pt-1">
          {trend && (
            <span className={`inline-flex items-center text-[11px] font-bold ${trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}`}>
              <TrendingUp className={`w-3 h-3 ${trendUp ? "" : "rotate-90"}`} />
              {trend}
            </span>
          )}
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</span>
        </div>
      </div>
      
      <div className={`p-3 rounded-2xl ${colorStyles[color as keyof typeof colorStyles]} shadow-xs`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </motion.div>
  );
}

// ==========================================
// 9. AI PROCESSING LOADER (SHIMMER THINKING ANIMATION)
// ==========================================
interface AIProcessingLoaderProps {
  currentStage: string;
}

export function AIProcessingLoader({ currentStage }: AIProcessingLoaderProps) {
  const steps = [
    "Denoising intake telemetry files...",
    "Decoding acoustic and visual embeddings...",
    "Querying regional GIS hazard database...",
    "Mapping confidence levels against City guidelines...",
    "Applying safety ranking weights...",
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-lg text-center max-w-md mx-auto space-y-6">
      {/* Outer Gemini Sparkle Animation */}
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-400/15 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-500 blur-md opacity-30 animate-pulse" />
        
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Sparkles className="w-8 h-8 text-white animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
          CivicMind Autonomous Intake Dispatcher
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
          Multimodal neural analysis actively classifying and assessing hazard scores.
        </p>
      </div>

      {/* Shimmer state text */}
      <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl p-3 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-mono font-medium text-slate-600 dark:text-blue-300">
          {currentStage}
        </span>
      </div>

      {/* Simulating active ticker steps */}
      <div className="w-full space-y-2 text-left pt-2">
        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block">
          Current Processing Nodes:
        </span>
        <div className="space-y-1.5">
          {steps.map((step, idx) => {
            const isDone = steps.indexOf(currentStage) > idx || currentStage === "Finalizing report...";
            const isCurrent = currentStage === step;
            return (
              <div key={idx} className="flex items-center gap-2.5 text-[11px] font-medium">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                  isDone 
                    ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50" 
                    : isCurrent 
                      ? "border-blue-500 text-blue-500" 
                      : "border-slate-150 text-slate-300 dark:border-slate-800"
                }`}>
                  {isDone ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <span className="text-[9px] font-mono">{idx + 1}</span>
                  )}
                </div>
                <span className={`${
                  isDone 
                    ? "text-slate-500 line-through decoration-slate-300 dark:decoration-slate-800" 
                    : isCurrent 
                      ? "text-slate-800 dark:text-slate-100 font-semibold" 
                      : "text-slate-400 dark:text-slate-600"
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

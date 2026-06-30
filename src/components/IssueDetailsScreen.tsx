import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  ThumbsUp,
  Share2,
  BellRing,
  Award,
  AlertCircle,
  Activity,
  CheckCircle,
  FileCode,
  Shield,
  Download,
  Send
} from "lucide-react";
import { CivicIssueReport } from "../types";
import { PriorityBadge, StatusChip, TimelineView, AIInsightCard } from "./CivicComponents";

interface IssueDetailsProps {
  key?: any;
  report: CivicIssueReport;
  onBack: () => void;
  onUpdateStatus?: (id: string, newStatus: CivicIssueReport["status"]) => void;
  onSaveAdminNotes?: (id: string, notes: string) => void;
  isStaff?: boolean;
}

export function IssueDetailsScreen({
  report,
  onBack,
  onUpdateStatus,
  onSaveAdminNotes,
  isStaff = false,
}: IssueDetailsProps) {
  const [upvotes, setUpvotes] = useState(Math.floor(Math.random() * 28) + 3);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const [adminNotesText, setAdminNotesText] = useState(report.admin_notes || "");

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(upvotes - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
    }
  };

  const handleSaveNotes = () => {
    if (onSaveAdminNotes) {
      onSaveAdminNotes(report.id, adminNotesText);
    }
  };

  const formattedDate = new Date(report.timestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 pb-24"
    >
      {/* Back navigation & Quick Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 text-slate-700 transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#1A73E8]" /> Return to List
        </button>
        
        <div className="flex items-center gap-2">
          {/* Subscriber CTA */}
          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`px-3.5 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSubscribed
                ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs"
            }`}
          >
            <BellRing className={`w-3.5 h-3.5 ${isSubscribed ? "animate-bounce" : ""}`} />
            {isSubscribed ? "Alerts Enabled" : "Subscribe to Updates"}
          </button>
        </div>
      </div>

      {/* Main Core Layout Grid (Split screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PRIMARY HAZARD INFORMATION & AI SUMMARY */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border-2 border-slate-200/80 rounded-[32px] p-6 space-y-4 shadow-sm">
            
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge severity={report.severity} />
              <StatusChip status={report.status} />
              <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 ml-auto">
                ID: {report.id}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display">
                {report.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {report.location_hint || "Sector coordinates lock"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-4 text-sm text-slate-700 font-semibold leading-relaxed">
              {report.description}
            </div>

            {report.user_image && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video max-h-80 shadow-inner">
                <img src={report.user_image} alt="Report attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            {/* Interactions Bar */}
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 mt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpvote}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    hasUpvoted
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{upvotes} Upvotes</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-500 font-bold">
                GIS CONFIDENCE: {(report.confidence * 100).toFixed(0)}% AI ACCURACY
              </div>
            </div>

          </div>

          {/* AI Autonomous Diagnostics Insight */}
          <AIInsightCard report={report} />
        </div>

        {/* RIGHT COLUMN: DISPATCH STATUS & ACTION DIRECTIVES */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Static Map plotting indicator */}
          <div className="bg-white border-2 border-slate-200/80 rounded-[32px] p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-black font-mono tracking-widest text-slate-600 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500 animate-bounce" /> Geographic Lock
            </h3>

            {/* Visual SVG Map snippet centered on coordinates */}
            <div className="relative aspect-video rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 200 120" className="w-full h-full opacity-80">
                <defs>
                  <pattern id="detail-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#f8fafc" />
                    <path d="M 20 0 L 0 0 0 20" stroke="#e2e8f0" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#detail-grid)" />
                <path d="M 10 60 L 190 60 M 100 10 L 100 110" stroke="#cbd5e1" strokeWidth="3" />
                <circle cx="100" cy="60" r="16" fill="#1e1e24" opacity="0.05" />
                
                {/* Red radar ripple */}
                <circle cx="100" cy="60" r="10" fill="#f43f5e" opacity="0.2" className="animate-ping" />
                <circle cx="100" cy="60" r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 border border-slate-200 rounded-xl p-2 text-[10px] font-mono text-center flex justify-between shadow-xs">
                <span className="text-slate-500 font-bold">LAT: {report.coordinates?.lat.toFixed(5)}</span>
                <span className="text-slate-500 font-bold">LNG: {report.coordinates?.lng.toFixed(5)}</span>
              </div>
            </div>
          </div>

          {/* Department Dispatch and Admin Directive Notes (If Staff/Officer or detailed citizen mode) */}
          <div className="bg-white border-2 border-slate-200/80 rounded-[32px] p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-black font-mono tracking-widest text-slate-600 uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Operational Directives
            </h3>

            <div className="space-y-3.5">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-xs">
                <span className="font-mono text-[10px] text-slate-500 uppercase block font-black">Assigned Dispatch Department:</span>
                <span className="font-bold text-slate-800 block mt-0.5">{report.assigned_department}</span>
              </div>

              {/* Citizen/Officer Status update control */}
              {isStaff && onUpdateStatus && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-black uppercase tracking-wide text-slate-500">
                    Operational Dispatch Status Override
                  </label>
                  <select
                    value={report.status}
                    onChange={(e) => onUpdateStatus(report.id, e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="open">Open / Unassigned</option>
                    <option value="investigating">Under Administrative Review</option>
                    <option value="assigned">Dispatched / En Route</option>
                    <option value="resolved">Resolved / Closed</option>
                  </select>
                </div>
              )}

              {/* Administrative Notes display or editor */}
              {isStaff && onSaveAdminNotes ? (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-black uppercase tracking-wide text-slate-500">
                    Add Team Log or Dispatch Directives
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={adminNotesText}
                      onChange={(e) => setAdminNotesText(e.target.value)}
                      placeholder="Type response logs, crew scheduling..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-[#1A73E8]"
                    />
                    <button
                      onClick={handleSaveNotes}
                      className="px-3.5 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                report.admin_notes && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl space-y-1 text-xs">
                    <span className="font-mono text-[10px] font-black text-emerald-700 uppercase">Latest Officer Log:</span>
                    <p className="font-bold leading-relaxed">{report.admin_notes}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Resolution Dispatch Timeline */}
          <div className="bg-white border-2 border-slate-200/80 rounded-[32px] p-5 shadow-sm">
            <TimelineView
              status={report.status}
              department={report.assigned_department}
              adminNotes={report.admin_notes}
              timestamp={report.timestamp}
            />
          </div>

        </div>

      </div>
    </motion.div>
  );
}

import React from "react";
import { motion } from "motion/react";
import {
  Bell,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight,
  Settings,
  Mail,
  Activity,
  User,
  ShieldAlert,
  Trash2,
  Check
} from "lucide-react";
import { CivicIssueReport } from "../types";

export interface CivicNotification {
  id: string;
  reportId?: string;
  title: string;
  message: string;
  timestamp: string;
  type: "status" | "ai" | "resolution" | "alert";
  isRead: boolean;
}

interface NotificationsScreenProps {
  key?: any;
  notifications: CivicNotification[];
  reports: CivicIssueReport[];
  onSelectReport: (report: CivicIssueReport) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onToggleRead: (id: string) => void;
}

export function NotificationsScreen({
  notifications,
  reports,
  onSelectReport,
  onMarkAllRead,
  onClearAll,
  onToggleRead,
}: NotificationsScreenProps) {

  const handleNotificationClick = (notif: CivicNotification) => {
    // Mark as read
    onToggleRead(notif.id);

    // If matches a report, open details
    if (notif.reportId) {
      const match = reports.find((r) => r.id === notif.reportId);
      if (match) {
        onSelectReport(match);
      }
    }
  };

  const getNotificationIcon = (type: CivicNotification["type"]) => {
    switch (type) {
      case "ai":
        return {
          icon: Sparkles,
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        };
      case "resolution":
        return {
          icon: CheckCircle,
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "status":
        return {
          icon: Activity,
          bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        };
      case "alert":
        return {
          icon: ShieldAlert,
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      default:
        return {
          icon: Bell,
          bg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-2xl mx-auto space-y-6 pb-24"
    >
      {/* Title Header bar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 font-display flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" /> Notifications Feed
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            Stay updated with your reports and local municipal resolutions.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={onMarkAllRead}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Mark All Read
              </button>
              <button
                onClick={onClearAll}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-rose-200 transition-colors cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notifications list */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const theme = getNotificationIcon(notif.type);
            const Icon = theme.icon;
            const timeStr = new Date(notif.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <motion.div
                key={notif.id}
                whileHover={{ scale: 1.005 }}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-4 items-start ${
                  notif.isRead
                    ? "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                    : "bg-white border-slate-200/85 text-slate-800 hover:border-blue-500/30 shadow-xs hover:shadow-md hover:shadow-blue-500/5"
                }`}
              >
                {/* Visual Status icon */}
                <div className={`p-2.5 rounded-xl border shrink-0 ${theme.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Info */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className={`text-sm font-bold leading-none ${notif.isRead ? "text-slate-500 font-semibold" : "text-slate-850 font-extrabold"}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{timeStr}</span>
                  </div>
                  
                  <p className={`text-xs leading-relaxed ${notif.isRead ? "text-slate-400 font-medium" : "text-slate-600 font-bold"}`}>
                    {notif.message}
                  </p>

                  {notif.reportId && (
                    <span className="text-[10px] font-black text-blue-600 hover:text-blue-500 flex items-center gap-0.5 pt-1.5">
                      Inspect Incident Details <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Read indicator dot */}
                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-[32px] space-y-3 py-20 bg-white shadow-xs">
          <div className="p-3 bg-blue-50 rounded-full inline-flex text-blue-500">
            <Mail className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest font-mono">Mailbox empty</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-medium">
              Any alerts regarding incident telemetry or administrative updates will register in this operational queue.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

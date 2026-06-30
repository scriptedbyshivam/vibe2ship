import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  Sliders,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { CivicIssueReport, CivicCategory } from "../types";
import { PriorityBadge, StatusChip, MapPinCard } from "./CivicComponents";

interface MapScreenProps {
  key?: any;
  reports: CivicIssueReport[];
  onSelectReport: (report: CivicIssueReport) => void;
  activeReport: CivicIssueReport | null;
  setActiveReport: (report: CivicIssueReport | null) => void;
}

export function MapScreen({
  reports,
  onSelectReport,
  activeReport,
  setActiveReport,
}: MapScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const getCategoryTheme = (cat: CivicCategory) => {
    switch (cat) {
      case "pothole":
      case "road_damage":
        return { color: "#FBBC05", label: "Roadways" };
      case "water_leak":
      case "drainage_issue":
        return { color: "#1A73E8", label: "Water Grid" };
      case "street_light_failure":
        return { color: "#94a3b8", label: "Electric Out" };
      case "garbage_dump":
        return { color: "#34A853", label: "Ecological" };
      default:
        return { color: "#6366f1", label: "Other Hazard" };
    }
  };

  // Filter reports
  const filteredReports = reports.filter((rep) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "roads" && (rep.issue_type === "pothole" || rep.issue_type === "road_damage")) ||
      (selectedFilter === "water" && (rep.issue_type === "water_leak" || rep.issue_type === "drainage_issue")) ||
      (selectedFilter === "power" && rep.issue_type === "street_light_failure") ||
      (selectedFilter === "ecology" && rep.issue_type === "garbage_dump");

    const matchesSeverity = selectedSeverity === "all" || rep.severity === selectedSeverity;
    
    const matchesSearch =
      !searchQuery ||
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.location_hint && rep.location_hint.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSeverity && matchesSearch;
  });

  // 1. Dynamic script and stylesheet loader for Leaflet
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const linkId = "leaflet-css";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const scriptId = "leaflet-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const handleScriptLoad = () => {
      setLeafletLoaded(true);
    };

    script.addEventListener("load", handleScriptLoad);

    return () => {
      script.removeEventListener("load", handleScriptLoad);
    };
  }, []);

  // 2. Initialize Leaflet map centered on India
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      // Center of India: Lat 20.5937, Lng 78.9629. Zoom 5 shows the entire nation nicely
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([20.5937, 78.9629], 5);

      // CartoDB Voyager tile layer for a beautiful, highly visual light-themed map style
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Keep persistent across tab clicks for smooth memory caching
    };
  }, [leafletLoaded]);

  // 3. Populate and update markers whenever reports or filter values change
  useEffect(() => {
    const L = (window as any).L;
    if (!leafletLoaded || !mapInstanceRef.current || !markersGroupRef.current || !L) return;

    // Clear existing markers
    markersGroupRef.current.clearLayers();

    // Add markers for filtered reports
    filteredReports.forEach((rep) => {
      const isSelected = activeReport?.id === rep.id;
      const theme = getCategoryTheme(rep.issue_type);

      // Dynamic custom marker icon with active glowing radar sonar pulses for high-severity issues
      const customIcon = L.divIcon({
        className: 'custom-map-pin-icon-container',
        html: `
          <div class="relative flex items-center justify-center">
            ${rep.severity === "high" && rep.status !== "resolved" ? `
              <div class="absolute w-8 h-8 rounded-full bg-red-500 opacity-25 animate-ping" style="margin-top: -14px;"></div>
            ` : ''}
            <div class="relative transition-all duration-300 transform ${isSelected ? '-translate-y-2 scale-125' : 'hover:-translate-y-1 hover:scale-110'}" style="margin-top: -16px;">
              <svg width="${isSelected ? '28' : '22'}" height="${isSelected ? '36' : '28'}" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${theme.color}" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
              </svg>
            </div>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 36],
      });

      const marker = L.marker([rep.coordinates.lat, rep.coordinates.lng], { icon: customIcon });

      marker.on('click', () => {
        setActiveReport(rep);
        mapInstanceRef.current.flyTo([rep.coordinates.lat, rep.coordinates.lng], 12, {
          animate: true,
          duration: 1.5
        });
      });

      marker.bindTooltip(`
        <div class="custom-leaflet-tooltip-inner" style="background-color: #0f172a; color: #f8fafc; border: 1px solid #1e293b; padding: 6px 10px; border-radius: 8px; font-family: monospace; font-size: 11px; font-weight: bold; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <div>${rep.title.slice(0, 30)}</div>
          <div style="color: #a5b4fc; font-size: 9px; margin-top: 2px;">Confidence: ${Math.round(rep.confidence * 100)}%</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -28],
        className: 'custom-leaflet-tooltip',
        opacity: 0.95
      });

      markersGroupRef.current.addLayer(marker);
    });

    // If there's an active report, ensure map flies to it
    if (activeReport) {
      const hasActiveInFilter = filteredReports.some(r => r.id === activeReport.id);
      if (hasActiveInFilter) {
        mapInstanceRef.current.setView([activeReport.coordinates.lat, activeReport.coordinates.lng], 10, { animate: true });
      }
    } else if (filteredReports.length > 0) {
      // Fit bounds to show all filtered items nicely
      const group = L.featureGroup(filteredReports.map(r => L.marker([r.coordinates.lat, r.coordinates.lng])));
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
    }
  }, [filteredReports, leafletLoaded]);

  // Handle outside activation changes smoothly
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !activeReport) return;
    mapInstanceRef.current.flyTo([activeReport.coordinates.lat, activeReport.coordinates.lng], 12, {
      animate: true,
      duration: 1.2
    });
  }, [activeReport, leafletLoaded]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-[calc(100vh-140px)] min-h-[500px] border border-slate-250 rounded-3xl overflow-hidden bg-[#f4f6f8] shadow-xl flex flex-col"
    >
      {/* 1. TOP FLOATING SEARCH & FILTERS CONTROLS */}
      <div className="absolute top-4 left-4 right-4 z-40 space-y-2 pointer-events-none">
        
        {/* Search Bar overlay */}
        <div className="flex items-center gap-2 bg-white/95 border border-slate-200 p-2 rounded-2xl shadow-lg backdrop-blur-md max-w-md pointer-events-auto">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search active pins or sectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden py-1 px-1.5 font-bold"
          />
          <Compass className="w-4 h-4 text-slate-500 mr-2 shrink-0 animate-spin" style={{ animationDuration: "12s" }} />
        </div>
 
         {/* Filter Quick Chips */}
        <div className="flex flex-wrap gap-1.5 pointer-events-auto">
          {[
            { id: "all", label: "All Incidents" },
            { id: "roads", label: "Roadways" },
            { id: "water", label: "Water Grid" },
            { id: "power", label: "Power Outages" },
            { id: "ecology", label: "Ecology / Sanitation" },
          ].map((chip) => {
            const isActive = selectedFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedFilter(chip.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "bg-white/90 hover:bg-slate-50 border-slate-200 text-slate-700 backdrop-blur-xs shadow-sm font-black"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
 
      {/* 2. THE REAL-TIME LEAFLET MAP CONTAINER STAGE */}
      <div className="flex-1 w-full h-full relative z-10">
        <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
 
        {/* Zoom Controls bottom right overlay */}
        <div className="absolute bottom-4 right-4 z-40 bg-white/95 border border-slate-200 rounded-xl p-1 shadow-lg flex flex-col gap-1 backdrop-blur-xs">
          <button 
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4.5 h-4.5" />
          </button>
          <div className="h-px bg-slate-200 mx-1.5" />
          <button 
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4.5 h-4.5" />
          </button>
        </div>
 
        {/* Map Legend (Bottom left overlay) */}
        <div className="absolute bottom-4 left-4 z-40 bg-white/95 border border-slate-200 rounded-xl p-2.5 px-3.5 shadow-lg backdrop-blur-md text-[10px] font-mono space-y-1.5 hidden sm:block max-w-[200px]">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-150 pb-1">Legend Index</span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600 font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05] shadow-xs" /> Roadways
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8] shadow-xs" /> Water Grid
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] shadow-xs" /> Power Grid
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] shadow-xs" /> Ecology
            </div>
          </div>
        </div>

        {/* 3. SLIDE UP BOTTOM SHEET DETAILS OVERLAY (Framer Motion) */}
        <AnimatePresence>
          {activeReport && (
            <motion.div
              initial={{ opacity: 0, y: 100, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 100, x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50 pointer-events-none"
            >
              <MapPinCard
                report={activeReport}
                onClose={() => setActiveReport(null)}
                onViewDetails={() => onSelectReport(activeReport)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

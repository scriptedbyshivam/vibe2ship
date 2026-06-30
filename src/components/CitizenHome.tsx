import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Camera,
  Mic,
  FileText,
  MapPin,
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  Search,
  Bell,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Settings,
  Shield,
  Activity,
  Info,
  AlertTriangle,
  Upload,
  X,
  MicOff,
  CloudSun,
  Wind,
  Navigation,
  Heart,
  Layers,
  Eye,
  Send,
  Cpu,
  RefreshCw,
  Award
} from "lucide-react";
import { CivicCategory, CivicIssueReport } from "../types";

interface CitizenHomeProps {
  key?: string;
  reports: CivicIssueReport[];
  onQuickAction: (action: "camera" | "voice" | "text") => void;
  onSelectReport: (report: CivicIssueReport) => void;
  onNavigateToTab: (tab: string) => void;
  unreadCount: number;
  handleAddReport?: (newReport: CivicIssueReport) => void;
}

import { useAuth } from "../context/AuthContext";

// Custom Counter component for counts upward animation
function CountUp({ end, duration = 1.5, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export function CitizenHome({
  reports: propReports,
  onQuickAction,
  onSelectReport,
  onNavigateToTab,
  unreadCount,
  handleAddReport
}: CitizenHomeProps) {
  const { user } = useAuth();
  // Navigation & Workspace internal states
  const [activeReport, setActiveReport] = useState<CivicIssueReport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Map Overlays
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showClusters, setShowClusters] = useState(true);
  const [showPredictionZones, setShowPredictionZones] = useState(false);

  // Intake / Submission State
  const [showIntakeModal, setShowIntakeModal] = useState<"none" | "camera" | "voice" | "text">("none");
  const [inputText, setInputText] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageFileName, setImageFileName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [detectedLocation, setDetectedLocation] = useState("Geary Blvd & Fillmore St, San Francisco");
  
  // AI Processing Sequencer
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(15);
  const [revealedReasons, setRevealedReasons] = useState<number[]>([]);

  // Sound/Vibration effect indicator
  const [showRippleEffect, setShowRippleEffect] = useState<{ x: number; y: number } | null>(null);

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Real world Map (Leaflet) references and state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const overlaysGroupRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);



  const aiSteps = [
    { label: "Understanding payload...", desc: "Decrypting sensory input and image metadata" },
    { label: "Verifying incident state...", desc: "Performing computer vision structural scan" },
    { label: "Checking Similar Reports...", desc: "De-duplicating against active district reports" },
    { label: "Estimating Severity index...", desc: "Calculating pedestrian hazard and velocity impact" },
    { label: "Finding Nearby Facilities...", desc: "Identifying active municipal maintenance hubs" },
    { label: "Assigning dispatch priority...", desc: "Generating priority vector with high critical weight" },
    { label: "Routing to correct Department...", desc: "Establishing tunnel to Public Works Bureau" },
    { label: "Generating AI Summary...", desc: "Structuring full briefing block for city officials" }
  ];

  const reasonCards = [
    { title: "Near School Crossing", desc: "Located within 150m of Roosevelt Elementary safety buffer zone.", severity: "Critical weight" },
    { title: "Heavy Commute Corridor", desc: "Affects active transit routes with >4,000 hourly vehicle passages.", bg: "bg-amber-500/10" },
    { title: "Pedestrian Collision Risk", desc: "Zero nighttime visibility creates severe hazard for crosswalk pedestrians.", bg: "bg-red-500/10" },
    { title: "Grid Blockage Impending", desc: "Malfunction threatens major arterial intersection drainage blockage.", bg: "bg-blue-500/10" }
  ];

  // Set default active report if none is selected
  useEffect(() => {
    if (propReports.length > 0 && !activeReport) {
      setActiveReport(propReports[0]);
    }
  }, [propReports, activeReport]);

  const handleOpenIntake = (type: "camera" | "voice" | "text", e?: React.MouseEvent) => {
    // Spark local ripple effect
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setShowRippleEffect({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setTimeout(() => setShowRippleEffect(null), 800);
    }
    
    setShowIntakeModal(type);
    setInputText("");
    setVoiceTranscript("");
    setSelectedImage("");
    setImageFileName("");
    
    const locations = [
      "Geary Blvd & Fillmore St, San Francisco",
      "Valencia St & 18th St, San Francisco",
      "Lombard St & Hyde St, San Francisco",
      "Market St & Powell St, San Francisco",
      "Jefferson St & Taylor St, San Francisco"
    ];
    setDetectedLocation(locations[Math.floor(Math.random() * locations.length)]);
  };

  const handleApplyPreset = (issueType: "pothole" | "light" | "garbage" | "water") => {
    if (issueType === "pothole") {
      setInputText("Dangerous asphalt crater opening up right at the pedestrian school crossing. Vehicles are swerving sharply to avoid it.");
      setSelectedImage("https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80");
      setImageFileName("asphalt_crater.jpg");
    } else if (issueType === "light") {
      setInputText("Entire sequence of streetlights dark on Pine St. Major crossing is completely pitch black. High pedestrian risk.");
      setSelectedImage("https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=400&q=80");
      setImageFileName("streetlight_grid_out.jpg");
    } else if (issueType === "garbage") {
      setInputText("Massive illegal dumping of industrial rubble and plastic containers blocking the cycle lane near the city park.");
      setSelectedImage("https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=400&q=80");
      setImageFileName("illegal_debris.jpg");
    } else if (issueType === "water") {
      setInputText("Water main broken and shooting up from pavement. Flooding the crosswalk and eroding the asphalt path.");
      setSelectedImage("https://images.unsplash.com/photo-1542013936693-8848e574047e?auto=format&fit=crop&w=400&q=80");
      setImageFileName("water_rupture.jpg");
    }
  };

  const startVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      setVoiceTimer(0);
      setVoiceTranscript("Report of street light grid outage at the corner of Fillmore and Geary. Commuters are experiencing extremely low visibility at the crossing.");
    } else {
      setIsRecording(true);
      setVoiceTimer(0);
      recordingIntervalRef.current = setInterval(() => {
        setVoiceTimer(prev => prev + 1);
      }, 1000);
    }
  };

  // Triggers the futuristic full-screen processing experience
  const handleTriggerAISubmit = () => {
    setShowIntakeModal("none");
    setIsProcessingAI(true);
    setCurrentStepIdx(0);
    setProcessingProgress(0);
    setAiConfidence(15);
    setRevealedReasons([]);

    // Sequential simulation of futuristic processing
    const stepInterval = 600; // milliseconds per AI step
    
    const interval = setInterval(() => {
      setCurrentStepIdx(prevStep => {
        const nextStep = prevStep + 1;
        setProcessingProgress((nextStep / aiSteps.length) * 100);
        
        // Increase confidence gradually to 97%
        setAiConfidence(prevConf => {
          if (nextStep === aiSteps.length) return 97;
          return Math.min(92, prevConf + Math.floor(Math.random() * 12) + 8);
        });

        // Gradually reveal reason cards during steps 3 to 6
        if (nextStep >= 3 && nextStep <= 6) {
          setRevealedReasons(prev => [...prev, nextStep - 3]);
        }

        if (nextStep >= aiSteps.length) {
          clearInterval(interval);
          
          // Complete and add the report after a brief victory pause
          setTimeout(() => {
            const isLight = inputText.toLowerCase().includes("light") || voiceTranscript.toLowerCase().includes("light");
            const isWater = inputText.toLowerCase().includes("water") || voiceTranscript.toLowerCase().includes("water");
            const isGarbage = inputText.toLowerCase().includes("garbage") || voiceTranscript.toLowerCase().includes("garbage");
            const type = isLight ? "street_light_failure" : isWater ? "water_leak" : isGarbage ? "garbage_dump" : "pothole";

            const generatedIssue: CivicIssueReport = {
              id: `rep-${Date.now()}`,
              timestamp: new Date().toISOString(),
              title: inputText.slice(0, 36) || voiceTranscript.slice(0, 36) || "Infrastructure Hazard Flagged",
              description: inputText || voiceTranscript || "Automated AI-ingested multimodal public safety flag.",
              issue_type: type as any,
              severity: inputText.toLowerCase().includes("danger") || inputText.toLowerCase().includes("crash") || inputText.toLowerCase().includes("dark") ? "high" : "medium",
              confidence: 0.97,
              location_hint: detectedLocation,
              status: "open",
              tags: ["AI-Assigned", "Multimodal-Payload", "Live-Telemetry"],
              user_image: selectedImage || undefined,
              user_text: inputText || undefined,
              user_voice: voiceTranscript || undefined,
              assigned_department: isLight ? "Municipal Grid & Street Lighting Authority" :
                                   isWater ? "Water and Environmental Utilities Bureau" :
                                   isGarbage ? "Sanitation & Ecological Waste Management" :
                                   "Department of Public Works - Asphalt Maintenance Division",
              coordinates: {
                lat: 37.77 + (Math.random() - 0.5) * 0.02,
                lng: -122.43 + (Math.random() - 0.5) * 0.02
              }
            };

            if (handleAddReport) {
              handleAddReport(generatedIssue);
            }
            setActiveReport(generatedIssue);
            setIsProcessingAI(false);
          }, 800);
        }

        return nextStep;
      });
    }, stepInterval);
  };

  const getCategoryColor = (type: CivicCategory) => {
    switch (type) {
      case "pothole":
      case "road_damage":
        return { pin: "#EA4335", glow: "rgba(234,67,53,0.15)", text: "text-red-500", border: "border-red-500/20", bg: "bg-red-500/5" };
      case "street_light_failure":
        return { pin: "#FBBC05", glow: "rgba(251,188,5,0.15)", text: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/5" };
      case "garbage_dump":
        return { pin: "#34A853", glow: "rgba(52,168,83,0.15)", text: "text-emerald-500", border: "border-emerald-500/20", bg: "bg-emerald-500/5" };
      case "water_leak":
      case "drainage_issue":
        return { pin: "#1A73E8", glow: "rgba(26,115,232,0.15)", text: "text-blue-500", border: "border-blue-500/20", bg: "bg-blue-500/5" };
      default:
        return { pin: "#8B5CF6", glow: "rgba(139,92,246,0.15)", text: "text-purple-500", border: "border-purple-500/20", bg: "bg-purple-500/5" };
    }
  };

  // Filter reports
  const filteredReports = propReports.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.location_hint && r.location_hint.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const reportToShow = activeReport || propReports[0] || null;

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
      script.onload = () => setLeafletLoaded(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setLeafletLoaded(true));
    }
  }, []);

  // 2. Initialize Leaflet map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = propReports.length > 0 
        ? [propReports[0].coordinates.lat, propReports[0].coordinates.lng] 
        : [37.7749, -122.4194];

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView(defaultCenter, 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
      overlaysGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
        overlaysGroupRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // 3. Populate and update map markers, heatmaps, traffic, and predictions
  useEffect(() => {
    const L = (window as any).L;
    if (!leafletLoaded || !mapInstanceRef.current || !markersGroupRef.current || !overlaysGroupRef.current || !L) return;

    markersGroupRef.current.clearLayers();
    overlaysGroupRef.current.clearLayers();

    filteredReports.forEach((rep) => {
      const isSelected = reportToShow?.id === rep.id;
      
      let markerColor = "#1A73E8"; 
      if (rep.issue_type === "pothole" || rep.issue_type === "road_damage") {
        markerColor = "#EA4335"; 
      } else if (rep.issue_type === "street_light_failure") {
        markerColor = "#FBBC05"; 
      } else if (rep.issue_type === "garbage_dump") {
        markerColor = "#34A853"; 
      }

      const customIcon = L.divIcon({
        className: 'custom-map-pin-icon-container',
        html: `
          <div class="relative flex items-center justify-center">
            ${rep.severity === "high" && rep.status !== "resolved" ? `
              <div class="absolute w-8 h-8 rounded-full bg-red-500 opacity-25 animate-ping" style="margin-top: -14px;"></div>
            ` : ''}
            <div class="relative transition-all duration-300 transform ${isSelected ? '-translate-y-2 scale-125' : 'hover:-translate-y-1 hover:scale-110'}" style="margin-top: -16px;">
              <svg width="${isSelected ? '28' : '22'}" height="${isSelected ? '36' : '28'}" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${markerColor}" stroke="#ffffff" stroke-width="1.5" />
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
        mapInstanceRef.current.flyTo([rep.coordinates.lat, rep.coordinates.lng], 14, {
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

    if (showHeatmap && filteredReports.length > 0) {
      filteredReports.forEach((rep) => {
        const radius = rep.severity === "high" ? 400 : 250;
        const color = rep.severity === "high" ? "#EA4335" : "#FBBC05";
        L.circle([rep.coordinates.lat, rep.coordinates.lng], {
          radius: radius,
          fillColor: color,
          fillOpacity: 0.25,
          stroke: false
        }).addTo(overlaysGroupRef.current);
      });
    }

    if (showTraffic && filteredReports.length > 1) {
      for (let i = 0; i < filteredReports.length - 1; i++) {
        const pt1 = filteredReports[i].coordinates;
        const pt2 = filteredReports[i + 1].coordinates;
        const color = i % 3 === 0 ? "#EA4335" : i % 3 === 1 ? "#FBBC05" : "#34A853";
        L.polyline([[pt1.lat, pt1.lng], [pt2.lat, pt2.lng]], {
          color: color,
          weight: 5,
          opacity: 0.7,
          dashArray: "10, 10"
        }).addTo(overlaysGroupRef.current);
      }
    }

    if (showClusters && filteredReports.length > 0) {
      const centerLat = filteredReports.reduce((acc, curr) => acc + curr.coordinates.lat, 0) / filteredReports.length;
      const centerLng = filteredReports.reduce((acc, curr) => acc + curr.coordinates.lng, 0) / filteredReports.length;
      const clusterIcon = L.divIcon({
        className: 'custom-cluster-icon-container',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
            <div class="w-8 h-8 rounded-full bg-[#1A73E8] border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-lg">
              ${filteredReports.length}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      L.marker([centerLat + 0.005, centerLng - 0.005], { icon: clusterIcon }).addTo(overlaysGroupRef.current);
    }

    if (showPredictionZones && filteredReports.length > 0) {
      const coords = filteredReports.map(r => [r.coordinates.lat, r.coordinates.lng]);
      if (coords.length >= 3) {
        L.polygon(coords, {
          color: "#8B5CF6",
          weight: 2,
          fillColor: "#8B5CF6",
          fillOpacity: 0.1,
          dashArray: "5, 5"
        }).bindTooltip("<span class='font-bold text-indigo-700 font-mono'>AI High Wear Zone (89%)</span>", { permanent: true, direction: "center" })
          .addTo(overlaysGroupRef.current);
      } else {
        filteredReports.forEach((rep) => {
          L.circle([rep.coordinates.lat + 0.003, rep.coordinates.lng + 0.003], {
            radius: 350,
            color: "#8B5CF6",
            weight: 2,
            fillColor: "#8B5CF6",
            fillOpacity: 0.05,
            dashArray: "4, 4"
          }).bindTooltip("<span class='font-mono font-bold text-indigo-700 text-[10px]'>Wear Vector 89%</span>", { direction: "top" })
            .addTo(overlaysGroupRef.current);
        });
      }
    }

    if (reportToShow) {
      const isVisible = filteredReports.some(r => r.id === reportToShow.id);
      if (isVisible) {
        mapInstanceRef.current.setView([reportToShow.coordinates.lat, reportToShow.coordinates.lng], 13);
      }
    } else {
      const group = L.featureGroup(filteredReports.map(r => L.marker([r.coordinates.lat, r.coordinates.lng])));
      if (filteredReports.length > 0) {
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
      }
    }
  }, [filteredReports, leafletLoaded, showHeatmap, showTraffic, showClusters, showPredictionZones, reportToShow]);

  return (
    <div className="space-y-8 pb-32 font-sans antialiased text-[#0A2540]">
      
      {/* 1. TOP WELCOME SECTION WITH SYSTEM METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white p-6 rounded-[32px] border-2 border-slate-200/80 shadow-md">
        {/* Welcome greeting */}
        <div className="lg:col-span-5 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <span className="p-2 bg-[#1A73E8] rounded-xl text-white text-xs font-black tracking-wider uppercase font-mono shadow-sm">
              District Console
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-bold font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Real-time monitoring active
            </div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tight text-black font-display leading-tight"
          >
            Good Morning, <span className="bg-gradient-to-r from-[#1A73E8] to-[#4F46E5] bg-clip-text text-transparent underline decoration-[#1A73E8]/40 decoration-wavy font-extrabold">{user?.fullName || "Citizen"}</span>
          </motion.h2>
          <p className="text-black font-extrabold text-lg leading-relaxed mt-2 bg-blue-100/40 p-4 rounded-2xl border-2 border-blue-200">
            AI is mapping and securing your city infrastructure in real time.
          </p>
        </div>

        {/* Mini Smart Weather, AQI, Traffic, Health widgets */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Weather Card */}
          <button className="text-left w-full bg-[#FFFBF0] border-2 border-[#F1C40F]/50 p-4.5 rounded-2xl shadow-sm hover:shadow-md hover:border-[#F1C40F] focus:border-[#F1C40F] focus:outline-none transition-all group hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black font-mono tracking-wide text-amber-800 uppercase">Weather</span>
              <CloudSun className="w-5 h-5 text-amber-600 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black font-display text-slate-900">72°F</div>
              <p className="text-[10px] font-extrabold text-amber-900">Clear • San Francisco</p>
            </div>
          </button>

          {/* AQI Card */}
          <button className="text-left w-full bg-[#F0FDF4] border-2 border-emerald-300 p-4.5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500 focus:border-emerald-500 focus:outline-none transition-all group hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black font-mono tracking-wide text-emerald-800 uppercase">AQI</span>
              <Wind className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black font-display text-emerald-800">34</div>
              <p className="text-[10px] font-extrabold text-emerald-950 flex items-center gap-1.5">
                Excellent <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              </p>
            </div>
          </button>

          {/* Traffic Card */}
          <button className="text-left w-full bg-[#EFF6FF] border-2 border-blue-300 p-4.5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-all group hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black font-mono tracking-wide text-blue-800 uppercase">Traffic</span>
              <Navigation className="w-5 h-5 text-blue-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black font-display text-blue-900">Optimal</div>
              <p className="text-[10px] font-extrabold text-blue-950">Normal flows</p>
            </div>
          </button>

          {/* Health Score Card */}
          <button className="text-left w-full bg-[#FFF5F5] border-2 border-red-200 p-4.5 rounded-2xl shadow-sm hover:shadow-md hover:border-red-500 focus:border-red-500 focus:outline-none transition-all group hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black font-mono tracking-wide text-red-800 uppercase">City Health</span>
              <Heart className="w-5 h-5 text-red-500 fill-red-500/20 animate-pulse" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-black font-display text-red-700">
                <CountUp end={94} suffix="%" />
              </div>
              <p className="text-[10px] font-extrabold text-red-950">Peak operations</p>
            </div>
          </button>

        </div>
      </div>

      {/* 2. THE CHASSIS GRID: Assistant Card & Report Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Your Civic AI Assistant Card (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <div className="h-full bg-gradient-to-tr from-[#F0F4FC] to-white text-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-md border-2 border-[#1A73E8]/30 flex flex-col justify-between group">
            
            {/* Glowing light sphere backdrops */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-100/30 to-indigo-50/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            <div className="absolute -bottom-12 -left-12 w-[200px] h-[200px] bg-blue-100/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Animated Laser Grid Line system across the card */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
            
            {/* Pulsing light sweep line */}
            <motion.div 
              animate={{ y: ["0%", "400%", "0%"] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#1A73E8]/20 to-transparent pointer-events-none"
            />

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#1A73E8] rounded-lg flex items-center justify-center shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                    </div>
                    <span className="text-[11px] font-black font-mono tracking-widest text-[#1A73E8] uppercase">Core Intelligent Intelligence</span>
                  </div>
                  <h3 className="text-2xl font-black font-display tracking-tight text-slate-900 mt-1">Your Civic AI Assistant</h3>
                  <p className="text-xs text-slate-700 font-bold">
                    Sensing, prioritizing, and auto-dispatching infrastructure hazards dynamically.
                  </p>
                </div>
                
                {/* Floating Scanning Particle icon */}
                <div className="relative w-12 h-12 flex items-center justify-center border-2 border-blue-200 bg-blue-50/80 rounded-2xl shadow-sm">
                  <span className="absolute inset-0 w-full h-full rounded-2xl border-2 border-blue-400/30 scale-105 opacity-30 animate-ping" />
                  <Cpu className="w-5 h-5 text-[#1A73E8] animate-pulse" />
                </div>
              </div>

              {/* Stat box grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                <div className="bg-slate-50/80 border-2 border-slate-300 rounded-2xl p-3 flex flex-col justify-between hover:bg-slate-100 transition-colors shadow-xs">
                  <span className="text-[10px] font-mono font-black text-slate-700 uppercase">Scanned</span>
                  <div className="text-xl font-black mt-1 font-display text-slate-900">
                    <CountUp end={128} suffix="+" />
                  </div>
                  <span className="text-[9px] text-slate-600 font-extrabold mt-0.5">District feeds</span>
                </div>

                <div className="bg-blue-50/50 border-2 border-blue-300 rounded-2xl p-3 flex flex-col justify-between hover:bg-blue-50 transition-colors shadow-xs">
                  <span className="text-[10px] font-mono font-black text-blue-800 uppercase">Precision</span>
                  <div className="text-xl font-black mt-1 font-display text-[#1A73E8]">
                    <CountUp end={97} suffix="%" />
                  </div>
                  <span className="text-[9px] text-blue-800 font-extrabold mt-0.5">Model confidence</span>
                </div>

                <div className="bg-amber-50/50 border-2 border-amber-300 rounded-2xl p-3 flex flex-col justify-between hover:bg-amber-50 transition-colors shadow-xs">
                  <span className="text-[10px] font-mono font-black text-amber-800 uppercase">Critical Flag</span>
                  <div className="text-xl font-black mt-1 font-display text-amber-700">
                    <CountUp end={23} />
                  </div>
                  <span className="text-[9px] text-amber-800 font-extrabold mt-0.5">Active priority</span>
                </div>

                <div className="bg-emerald-50/50 border-2 border-emerald-300 rounded-2xl p-3 flex flex-col justify-between hover:bg-emerald-50 transition-colors shadow-xs">
                  <span className="text-[10px] font-mono font-black text-emerald-800 uppercase">Latency</span>
                  <div className="text-xl font-black mt-1 font-display text-emerald-700">2.1 h</div>
                  <span className="text-[9px] text-emerald-800 font-extrabold mt-0.5">Avg response</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-slate-200/80 pt-4 mt-4 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Autonomous Dispatch Link: Connected & Operational
              </span>
              <button 
                onClick={() => onNavigateToTab("map")}
                className="text-[#1A73E8] hover:text-blue-800 font-black flex items-center gap-1 transition group"
              >
                Inspect predict vectors 
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Action button card options (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* CAMERA Action Card */}
          <button
            onClick={(e) => handleOpenIntake("camera", e)}
            className="flex-1 text-left bg-[#EBF3FE] border-2 border-[#1A73E8] text-[#1A73E8] p-5 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex items-center justify-between cursor-pointer"
          >
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A73E8]/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] bg-blue-100 border border-blue-300 rounded-md font-mono font-black uppercase tracking-wider text-blue-700">AI Ready</span>
                <span className="text-[10px] text-blue-700 font-black font-mono uppercase">Multi-modal</span>
              </div>
              <h4 className="text-xl font-black font-display text-black">Upload Civic Photo</h4>
              <p className="text-xs text-slate-800 font-bold">Submit image for neural computer-vision classification.</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#1A73E8] flex items-center justify-center text-[#1A73E8] relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
              <Camera className="w-6 h-6" />
            </div>
          </button>

          {/* VOICE Action Card */}
          <button
            onClick={(e) => handleOpenIntake("voice", e)}
            className="flex-1 text-left bg-[#EEF2FF] border-2 border-[#4F46E5] text-indigo-700 p-5 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex items-center justify-between cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] bg-indigo-100 border border-indigo-300 rounded-md font-mono font-black uppercase tracking-wider text-indigo-700">AI Ready</span>
                <span className="text-[10px] text-indigo-700 font-black font-mono uppercase">Speech NLP</span>
              </div>
              <h4 className="text-xl font-black font-display text-slate-900">Record Audio Telemetry</h4>
              <p className="text-xs text-slate-800 font-bold">AI decodes voice coordinates and issue descriptions.</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-indigo-500 flex items-center justify-center text-indigo-600 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
              <Mic className="w-6 h-6" />
            </div>
          </button>

          {/* TEXT Action Card */}
          <button
            onClick={(e) => handleOpenIntake("text", e)}
            className="flex-1 text-left bg-[#F8FAFC] border-2 border-slate-700 text-slate-700 p-5 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex items-center justify-between cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] bg-slate-200 border border-slate-300 rounded-md font-mono font-black uppercase tracking-wider text-slate-700">AI Ready</span>
                <span className="text-[10px] text-slate-700 font-black font-mono uppercase">Context Parser</span>
              </div>
              <h4 className="text-xl font-black font-display text-slate-900">Write Structured Report</h4>
              <p className="text-xs text-slate-800 font-bold">AI summarizes and dispatches text-based entries.</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-700 flex items-center justify-center text-slate-700 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
              <FileText className="w-6 h-6 text-slate-700" />
            </div>
          </button>

        </div>
      </div>

      {/* 3. INTERACTIVE MAP SECTION */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#0A2540] flex items-center gap-2 font-display">
              <MapIcon className="w-5 h-5 text-[#1A73E8]" /> 
              Smart City GIS Map Overlay
            </h3>
            <p className="text-xs text-slate-500">
              Double-click coordinates or select a marker pin to view automated municipal dispatches
            </p>
          </div>

          {/* Map Layer Option Selectors */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                showHeatmap 
                  ? "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/30 shadow-xs" 
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
              }`}
            >
              Heatmap Overlay
            </button>
            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                showTraffic 
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/30 shadow-xs" 
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
              }`}
            >
              Traffic Outage Flow
            </button>
            <button
              onClick={() => setShowClusters(!showClusters)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                showClusters 
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 shadow-xs" 
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
              }`}
            >
              Issue Clusters
            </button>
            <button
              onClick={() => setShowPredictionZones(!showPredictionZones)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                showPredictionZones 
                  ? "bg-purple-500/10 text-purple-600 border-purple-500/30 shadow-xs" 
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
              }`}
            >
              AI Prediction Zones
            </button>
          </div>
        </div>

        {/* Real-World Leaflet Map */}
        <div className="h-[440px] w-full rounded-2xl relative overflow-hidden border border-slate-100 shadow-inner">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full z-10" 
          />

          {/* Overlay elements with high z-index to float over the map */}
          {/* Interactive Marker Preview Glass Card on Map (Bottom center right) */}
          {reportToShow && (
            <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-xl max-w-sm w-80 animate-slide-up text-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-ping" />
                    <span className="text-[10px] font-bold font-mono tracking-wider text-[#1A73E8] uppercase">
                      Active Telemetry Point
                    </span>
                  </div>
                  <h4 className="font-bold text-[#0A2540] mt-0.5 line-clamp-1">{reportToShow.title}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                  reportToShow.severity === "high" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-[#1A73E8] border border-blue-100"
                }`}>
                  {reportToShow.severity} Severity
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-slate-600 font-semibold truncate">{reportToShow.location_hint}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500">Status: <strong className="text-slate-700 capitalize">{reportToShow.status}</strong></span>
                <span className="text-[#1A73E8] font-bold">Confidence: {Math.round(reportToShow.confidence * 100)}%</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectReport(reportToShow)}
                  className="flex-1 py-1.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-[10px] font-bold rounded-lg text-center transition cursor-pointer"
                >
                  Drilldown Details
                </button>
                <button
                  onClick={() => setActiveReport(null)}
                  className="px-2.5 py-1.5 border border-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Map Legend (Bottom left) */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 border border-slate-200/50 rounded-2xl p-3.5 shadow-md text-[10px] space-y-2 max-w-[150px]">
            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[9px]">Legend</span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(234,67,53,0.5)]" />
                <span className="font-bold text-slate-600">Critical (Red)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(251,188,5,0.5)]" />
                <span className="font-bold text-slate-600">Pending (Yellow)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(52,168,83,0.5)]" />
                <span className="font-bold text-slate-600">Resolved (Green)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_4px_rgba(26,115,232,0.5)]" />
                <span className="font-bold text-slate-600">AI Suggested (Blue)</span>
              </div>
            </div>
          </div>

          {/* Loading Skeleton Placeholder when Leaflet is loading */}
          {!leafletLoaded && (
            <div className="absolute inset-0 z-[2000] bg-slate-100 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#1A73E8] animate-spin" />
              <span className="text-xs font-semibold text-slate-500 font-mono">Loading Real World Map...</span>
            </div>
          )}
        </div>

      </div>

      {/* 4. RECENT REPORTS TIMELINE & LIVE ANALYTICS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RECENT REPORTS TIMELINE (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#0A2540] font-display">Recent Dispatch Timeline</h3>
              <p className="text-xs text-slate-500">Real-time public hazard telemetry queue</p>
            </div>
            
            {/* Inline search bar */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter dispatch queue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 pl-9 pr-4 py-1.5 rounded-xl text-xs text-slate-600 placeholder-slate-400 focus:outline-hidden focus:border-[#1A73E8]"
              />
            </div>
          </div>

          <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
            {filteredReports.map((rep) => {
              const theme = getCategoryColor(rep.issue_type);
              
              return (
                <div key={rep.id} className="relative group/timeline hover:translate-x-1 transition-transform duration-300">
                  
                  {/* Pulsing Left Circle Anchor */}
                  <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-white shadow-xs group-hover/timeline:scale-110 transition-transform ${
                    rep.status === "resolved" ? "bg-emerald-500 ring-4 ring-emerald-500/10" :
                    rep.status === "assigned" ? "bg-blue-500 ring-4 ring-blue-500/10" : "bg-amber-500 ring-4 ring-amber-500/10"
                  }`} />

                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs group-hover/timeline:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-start sm:items-center">
                      
                      {/* Image Preview with overlay badge */}
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200/50 shadow-inner">
                        <img 
                          src={rep.user_image || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=150&q=80"} 
                          alt="Incident thumbnail" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-1 left-1 bg-black/60 text-white rounded px-1 py-0.5 text-[8px] font-mono">
                          {Math.round(rep.confidence * 100)}%
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider uppercase border ${theme.border} ${theme.bg} ${theme.text}`}>
                            {rep.issue_type.replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0A2540] group-hover/timeline:text-[#1A73E8] transition-colors">{rep.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{rep.description}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <MapPin className="w-3 h-3 text-red-500" />
                          <span className="font-semibold text-slate-500">{rep.location_hint}</span>
                        </div>
                      </div>

                    </div>

                    {/* Operational Details Status Badge */}
                    <div className="flex sm:flex-col gap-2 justify-between items-end w-full sm:w-auto border-t sm:border-0 border-slate-50 pt-3 sm:pt-0">
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          rep.status === "resolved" ? "bg-emerald-500" :
                          rep.status === "assigned" ? "bg-blue-500" : "bg-amber-500"
                        }`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          rep.status === "resolved" ? "text-emerald-600" :
                          rep.status === "assigned" ? "text-blue-600" : "text-amber-600"
                        }`}>
                          {rep.status === "open" ? "Verified" : rep.status}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block font-mono">Estimated dispatch</span>
                        <span className="text-[11px] font-bold text-slate-600">Within 1.5 hrs</span>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* METRICS & COUNTERS GRID PANEL (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Today's Stats Analytics */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2 font-display">
              <Activity className="w-4.5 h-4.5 text-[#1A73E8]" />
              Live Operations Index
            </h3>

            <div className="space-y-4">
              
              {/* Today's Reports Metric */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Today's Reports</span>
                  <div className="text-2xl font-extrabold text-[#0a2540] font-display mt-0.5">
                    <CountUp end={propReports.length + 24} />
                  </div>
                </div>
                <div className="p-2 bg-blue-500/10 text-[#1A73E8] rounded-xl">
                  <TrendingUp className="w-5 h-5 animate-bounce" />
                </div>
              </div>

              {/* Pending Queue Metric */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Pending Queue</span>
                  <div className="text-2xl font-extrabold text-amber-500 font-display mt-0.5">
                    <CountUp end={propReports.filter(r => r.status !== "resolved").length} />
                  </div>
                </div>
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              {/* Resolved Today */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Resolved Today</span>
                  <div className="text-2xl font-extrabold text-emerald-600 font-display mt-0.5">
                    <CountUp end={propReports.filter(r => r.status === "resolved").length + 18} />
                  </div>
                </div>
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>

              {/* Model Confidence Metric */}
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Model Accuracy</span>
                  <div className="text-2xl font-extrabold text-[#1A73E8] font-display mt-0.5">
                    <CountUp end={97} suffix="%" />
                  </div>
                </div>
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

            </div>
          </div>

          {/* Citizen Satisfaction Index */}
          <div className="bg-gradient-to-br from-[#1A73E8] to-[#6366f1] text-white rounded-3xl p-6 relative overflow-hidden shadow-lg border border-blue-900/15">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-wider text-blue-200 uppercase">Civic Mindset</span>
                  <h4 className="text-lg font-bold font-display mt-1">Citizen Satisfaction Index</h4>
                </div>
                <Award className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>

              <div className="text-4xl font-extrabold font-display">98.4%</div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-blue-100">
                  <span>Target compliance</span>
                  <span>95% minimum</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: "98.4%" }} />
                </div>
              </div>

              <p className="text-[11px] text-blue-100/80 leading-relaxed">
                Our district autonomous routing averages <strong className="text-white">98% customer score</strong> in dispatch feedback audits.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 5. INTAKE DIALOG MODAL (OVERLAYS TO MANAGE MULTIMODAL INTAKE) */}
      <AnimatePresence>
        {showIntakeModal !== "none" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark blur backing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIntakeModal("none")}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="relative bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl max-w-lg w-full z-10 space-y-5 overflow-hidden"
            >
              {/* Shimmer background overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A73E8]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#1A73E8]/10 rounded-xl text-[#1A73E8]">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0A2540] font-display">
                      {showIntakeModal === "camera" ? "Intake via Photo / Camera" :
                       showIntakeModal === "voice" ? "Intake via Voice Transcript" : "Intake via Written Text"}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400">Classifying via Gemini Cognitive Gateway</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIntakeModal("none")}
                  className="p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QUICK FILL PRESSETS */}
              <div className="space-y-1.5 relative z-10 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide block">
                  Quick AI Demo Preset Fillers
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <button
                    onClick={() => handleApplyPreset("pothole")}
                    className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-200 transition-colors cursor-pointer"
                  >
                    Asphalt Pothole
                  </button>
                  <button
                    onClick={() => handleApplyPreset("light")}
                    className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-200 transition-colors cursor-pointer"
                  >
                    Streetlight Out
                  </button>
                  <button
                    onClick={() => handleApplyPreset("garbage")}
                    className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-200 transition-colors cursor-pointer"
                  >
                    Illegal Trash Dumping
                  </button>
                  <button
                    onClick={() => handleApplyPreset("water")}
                    className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-200 transition-colors cursor-pointer"
                  >
                    Water Line Break
                  </button>
                </div>
              </div>

              {/* CAMERA INTERACTIVE PORT */}
              {showIntakeModal === "camera" && (
                <div className="space-y-3 relative z-10">
                  {selectedImage ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-50">
                      <img src={selectedImage} alt="Attachment" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setSelectedImage("")}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 flex flex-col items-center justify-center group/uploader hover:border-[#1A73E8] transition-colors">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1A73E8] mb-2 group-hover/uploader:scale-105 transition-transform duration-300">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#0A2540]">Simulated Camera Capture</span>
                      <p className="text-[10px] text-slate-400 mt-1">Select a quick filler preset above to load mock image assets</p>
                    </div>
                  )}
                </div>
              )}

              {/* VOICE INTERACTIVE WAVE NLP */}
              {showIntakeModal === "voice" && (
                <div className="space-y-4 text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 relative z-10 flex flex-col items-center">
                  {isRecording ? (
                    <div className="space-y-3">
                      {/* Animated Sound Waveforms */}
                      <div className="flex gap-1 justify-center items-center h-8">
                        {[...Array(8)].map((_, i) => (
                          <motion.span 
                            key={i} 
                            animate={{ height: [8, 28, 8] }}
                            transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1), ease: "easeInOut" }}
                            className="w-1 bg-red-500 rounded-full" 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-red-500 animate-pulse block font-mono">
                        Active NLP Deciphering... {voiceTimer}s
                      </span>
                      <button
                        onClick={startVoiceRecording}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full cursor-pointer transition shadow-md shadow-red-500/10 flex items-center gap-1"
                      >
                        <MicOff className="w-3.5 h-3.5" /> Stop Capture
                      </button>
                    </div>
                  ) : voiceTranscript ? (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-100">
                        "{voiceTranscript}"
                      </p>
                      <button
                        onClick={() => setVoiceTranscript("")}
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        Reset capture feed
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1A73E8]">
                        <Mic className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0A2540]">AI Voice Recording</span>
                        <p className="text-[10px] text-slate-400 mt-1">Transcribe voice into localized GPS coordinates</p>
                      </div>
                      <button
                        onClick={startVoiceRecording}
                        className="px-5 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold rounded-full cursor-pointer transition shadow-md shadow-blue-500/15"
                      >
                        Start Voice Recorder
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* INPUT DETAIL TEXTBOX */}
              <div className="space-y-1.5 relative z-10">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">
                  Description Details
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Tell our AI Assistant about the pothole, leak, or street lighting outages..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 text-xs text-[#0A2540] placeholder-slate-400 focus:outline-hidden focus:border-[#1A73E8]"
                />
              </div>

              {/* LOCKED GPS TELEMETRY */}
              <div className="flex items-center gap-2 bg-[#F4F8FD] border border-[#1A73E8]/10 p-3.5 rounded-2xl text-[11px] relative z-10">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-bold text-[#0A2540]">GPS lock:</span>
                <span className="text-slate-600 font-semibold truncate">{detectedLocation}</span>
              </div>

              {/* CTA Action Bar */}
              <div className="flex gap-3 pt-2 relative z-10">
                <button
                  onClick={() => setShowIntakeModal("none")}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTriggerAISubmit}
                  className="flex-1.5 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" /> Classify & Dispatch
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. FULLSCREEN AI COGNITIVE PROCESSING OVERLAY (NOT CHATBOT, PURE HOLOGRAM ENGINE) */}
      <AnimatePresence>
        {isProcessingAI && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-white/95 backdrop-blur-md overflow-y-auto">
            
            {/* Soft Glowing Blue Atmospheric background blobs */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Tech Matrix dust grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60 pointer-events-none" />

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 py-8">
              
              {/* LEFT SIDE: Rotating Holographic Sphere Core & Confidence Meter (md:col-span-6) */}
              <div className="md:col-span-6 flex flex-col items-center justify-center text-center space-y-8">
                
                {/* Holographic Spinning Sphere Core */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                  
                  {/* Glowing core atmosphere */}
                  <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 blur-2xl opacity-10 animate-pulse" />
                  
                  {/* Concentric rotating orbital ring 1 */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute w-64 h-64 rounded-full border border-dashed border-blue-500/30"
                  />

                  {/* Concentric rotating orbital ring 2 */}
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                    className="absolute w-52 h-52 rounded-full border border-blue-500/20"
                  />

                  {/* Concentric rotating orbital ring 3 */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="absolute w-40 h-40 rounded-full border-2 border-dashed border-indigo-500/20"
                  />

                  {/* Concentric rotating orbital ring 4 */}
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute w-28 h-28 rounded-full border border-blue-400/40"
                  />

                  {/* Circular Confidence Meter Gauge inside the sphere */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                    <span className="text-[10px] font-mono tracking-widest text-blue-600 uppercase font-black">Confidence</span>
                    <div className="text-5xl font-black font-display text-slate-900 mt-1 relative flex items-center">
                      {aiConfidence}%
                      <Sparkles className="w-4 h-4 text-blue-500 absolute -top-2 -right-4 animate-bounce" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5 uppercase tracking-wider font-bold">Classification Level</span>
                  </div>

                  {/* Scanning Horizontal sweep lasers */}
                  <motion.div 
                    animate={{ y: ["-100%", "100%", "-100%"] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent pointer-events-none z-10"
                  />

                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 font-display">Autonomous Cognet Classifier</h3>
                  <p className="text-xs text-slate-500 font-bold max-w-sm">
                    Processing multi-modal payloads using regional infrastructure models in the cloud context.
                  </p>
                </div>

              </div>

              {/* RIGHT SIDE: Real-time processing list & Reason Cards (md:col-span-6) */}
              <div className="md:col-span-6 space-y-6">
                
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono font-black text-blue-600 uppercase tracking-widest">
                    Cognitive Sequence Queue
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4.5 space-y-3 shadow-inner">
                    {aiSteps.map((step, idx) => {
                      const isActive = idx === currentStepIdx;
                      const isCompleted = idx < currentStepIdx;
                      
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-3 text-xs transition-opacity duration-300 ${
                            isActive ? "opacity-100" : isCompleted ? "opacity-60" : "opacity-20"
                          }`}
                        >
                          {/* Circular Status Icon */}
                          <div className="mt-0.5 shrink-0">
                            {isCompleted ? (
                              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            ) : isActive ? (
                              <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center relative">
                                <span className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300" />
                            )}
                          </div>

                          <div className="space-y-0.5 flex-1">
                            <div className="flex justify-between font-bold text-slate-800">
                              <span className={isActive ? "text-slate-950 font-black" : "text-slate-600"}>{step.label}</span>
                              {isActive && <span className="text-blue-600 text-[10px] font-mono animate-pulse">Running...</span>}
                              {isCompleted && <span className="text-emerald-600 text-[10px] font-mono">100%</span>}
                            </div>
                            {isActive && <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* REASON CARDS ANIMATING INTO VIEW */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider block">
                    Telemetry Dispatch Weights
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {reasonCards.map((card, rIdx) => {
                      const isRevealed = revealedReasons.includes(rIdx);
                      
                      return (
                        <AnimatePresence key={rIdx}>
                          {isRevealed && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col justify-between space-y-1 hover:border-blue-500/30 transition-colors shadow-xs"
                            >
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="font-extrabold text-slate-800 font-display line-clamp-1">{card.title}</span>
                              </div>
                              <p className="text-[9px] text-slate-500 font-bold leading-normal line-clamp-2">{card.desc}</p>
                              <span className="text-[8px] font-mono text-blue-500 font-bold uppercase mt-1">Weight assigned</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Mic,
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  MapPin,
  ChevronRight,
  RefreshCw,
  Sliders,
  ShieldCheck,
  MapIcon,
  MicOff
} from "lucide-react";
import { CivicCategory, CivicIssueReport } from "../types";
import { AIProcessingLoader, AIInsightCard, PriorityBadge } from "./CivicComponents";

interface ReportIssueProps {
  key?: any;
  onAddReport: (newReport: CivicIssueReport) => void;
  onNavigateToTab: (tab: string) => void;
}

type Step = "intake" | "processing" | "review";

export function ReportIssue({ onAddReport, onNavigateToTab }: ReportIssueProps) {
  const [step, setStep] = useState<Step>("intake");
  
  // Intake State
  const [inputText, setInputText] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageFileName, setImageFileName] = useState("");
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-location simulated state
  const [detectedLocation, setDetectedLocation] = useState("San Francisco, CA");
  const [detectedCoords, setDetectedCoords] = useState({ lat: 37.7749, lng: -122.4194 });

  // Processing Animation state
  const [processingStage, setProcessingStage] = useState("Denoising intake telemetry files...");
  
  // AI Output results state (AI Review Screen)
  const [aiReport, setAiReport] = useState<Partial<CivicIssueReport>>({});
  const [editableTitle, setEditableTitle] = useState("");
  const [editableDesc, setEditableDesc] = useState("");
  const [editableLocation, setEditableLocation] = useState("");
  const [editableSeverity, setEditableSeverity] = useState<"low" | "medium" | "high">("medium");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger simulated geolocation tracking on mount
  useEffect(() => {
    const indianCities = [
      { name: "Bengaluru, Karnataka, India", lat: 12.9716, lng: 77.5946 },
      { name: "New Delhi, India", lat: 28.6139, lng: 77.2090 },
      { name: "Mumbai, Maharashtra, India", lat: 19.0760, lng: 72.8777 },
      { name: "Chennai, Tamil Nadu, India", lat: 13.0827, lng: 80.2707 },
      { name: "Hyderabad, Telangana, India", lat: 17.3850, lng: 78.4867 },
    ];

    const getRandomIndianCity = () => {
      const city = indianCities[Math.floor(Math.random() * indianCities.length)];
      // Add slight offset so markers aren't exactly on top of each other
      const offsetLat = (Math.random() - 0.5) * 0.05;
      const offsetLng = (Math.random() - 0.5) * 0.05;
      return {
        name: city.name,
        lat: city.lat + offsetLat,
        lng: city.lng + offsetLng
      };
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          // Check if coordinates are within India bounding box
          if (lat >= 8.0 && lat <= 37.0 && lng >= 68.0 && lng <= 97.0) {
            setDetectedCoords({ lat, lng });
            setDetectedLocation(`Plotted Coordinate: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
          } else {
            // Outside India, use a random Indian city coordinate
            const city = getRandomIndianCity();
            setDetectedCoords({ lat: city.lat, lng: city.lng });
            setDetectedLocation(`Regional Hub: ${city.name}`);
          }
        },
        () => {
          // Geolocation failed, use random Indian city coordinate
          const city = getRandomIndianCity();
          setDetectedCoords({ lat: city.lat, lng: city.lng });
          setDetectedLocation(`Regional Hub: ${city.name}`);
        }
      );
    } else {
      const city = getRandomIndianCity();
      setDetectedCoords({ lat: city.lat, lng: city.lng });
      setDetectedLocation(`Regional Hub: ${city.name}`);
    }
  }, []);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice Recording Simulator
  const startRecording = () => {
    if (isRecording) {
      // Stop
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      setVoiceTimer(0);
      
      // Load preset transcript
      if (!voiceTranscript) {
        setVoiceTranscript(
          "I am standing right next to the city park entrance. There is an enormous pothole that is actively filling with rain water and causing cars to swerve out of their lane. It is very dangerous."
        );
      }
    } else {
      // Start
      setIsRecording(true);
      recordingIntervalRef.current = setInterval(() => {
        setVoiceTimer((prev) => prev + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  // Submit flow - AI Processing Screen
  const handleTriggerAnalysis = async () => {
    if (!inputText && !voiceTranscript && !selectedImage) {
      setErrorMessage("Please supply at least one visual or descriptive element (Image, Voice, or Text).");
      return;
    }

    setStep("processing");
    setErrorMessage(null);

    // Staggered stages for AI Processing Loader
    const stages = [
      { text: "Denoising intake telemetry files...", delay: 0 },
      { text: "Decoding acoustic and visual embeddings...", delay: 1000 },
      { text: "Querying regional GIS hazard database...", delay: 2000 },
      { text: "Mapping confidence levels against City guidelines...", delay: 3000 },
      { text: "Applying safety ranking weights...", delay: 4000 },
      { text: "Finalizing report...", delay: 5000 },
    ];

    stages.forEach((stage) => {
      setTimeout(() => {
        setProcessingStage(stage.text);
      }, stage.delay);
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText || undefined,
          voiceTranscript: voiceTranscript || undefined,
          image: selectedImage || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Analysis response failed.");
      }

      // After 5.2 seconds, transition to review screen with results
      setTimeout(() => {
        const report = data.report;
        setAiReport(report);
        setEditableTitle(report.title);
        setEditableDesc(report.description);
        setEditableLocation(report.location_hint || detectedLocation);
        setEditableSeverity(report.severity || "medium");
        setStep("review");
      }, 5500);

    } catch (err: any) {
      console.error(err);
      setTimeout(() => {
        setErrorMessage(err.message || "Autonomous telemetry failure. Ensure server is online.");
        setStep("intake");
      }, 2000);
    }
  };

  // Preset quick picks
  const applyPreset = (type: string) => {
    if (type === "pothole") {
      setInputText("Enormous pothole near 8th Avenue and Mission St. It's about 6 inches deep and causing traffic to halt.");
      setImageFileName("pothole_intake.png");
      setSelectedImage("https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80");
    } else if (type === "water") {
      setVoiceTranscript("Water valve hydrant is broken and shooting water all over the sidewalk near standard intersection.");
      setImageFileName("water_valve_rupture.png");
      setSelectedImage("https://images.unsplash.com/photo-1542013936693-8848e574047e?auto=format&fit=crop&w=400&q=80");
    }
  };

  // Confirm/Submit review results
  const handleConfirmReport = () => {
    const finalReport: CivicIssueReport = {
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: editableTitle,
      description: editableDesc,
      issue_type: aiReport.issue_type || "other",
      severity: editableSeverity,
      confidence: aiReport.confidence || 0.94,
      location_hint: editableLocation,
      status: "open",
      tags: aiReport.tags || ["hazard"],
      user_text: inputText || undefined,
      user_voice: voiceTranscript || undefined,
      user_image: selectedImage || undefined,
      assigned_department: getDepartmentForCategory(aiReport.issue_type || "other"),
      coordinates: detectedCoords,
    };

    onAddReport(finalReport);
    onNavigateToTab("home");
  };

  const getDepartmentForCategory = (cat: CivicCategory | string): string => {
    switch (cat) {
      case "pothole":
      case "road_damage":
        return "Department of Public Works - Asphalt Maintenance Division";
      case "water_leak":
      case "drainage_issue":
        return "Water and Environmental Utilities Bureau";
      case "street_light_failure":
        return "Municipal Grid & Street Lighting Authority";
      case "garbage_dump":
        return "Sanitation & Ecological Waste Management";
      default:
        return "Citizen Services & General Maintenance Dept";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <AnimatePresence mode="wait">
        
        {/* ==========================================
            SCREEN 1: INTAKE SCREEN
           ========================================== */}
        {step === "intake" && (
          <motion.div
            key="intake-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="space-y-1 text-center py-2">
              <h2 className="text-xl font-bold tracking-tight text-[#0A2540] flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1A73E8]" /> New Autonomous Report
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                No forms required. Snap a photo, speak, or describe the hazard. AI takes care of the rest.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Camera / Image Upload Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white hover:bg-slate-50 p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] group cursor-pointer shadow-xs hover:border-[#1A73E8]"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md">
                    <img src={selectedImage} alt="Uploaded attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-600 block">{imageFileName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage("");
                        setImageFileName("");
                      }}
                      className="mt-2 text-xs text-rose-600 hover:text-rose-500 font-bold flex items-center gap-1 mx-auto"
                    >
                      <X className="w-3.5 h-3.5" /> Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 text-[#1A73E8] rounded-full group-hover:scale-105 group-hover:bg-[#1A73E8] group-hover:text-white transition-all duration-300 inline-flex">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Drag & Drop Image or Click to Capture</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Accepts live camera photos, JPG, PNG, or SVGs</p>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Recording / Acoustic intake card */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-3xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Acoustic Speech Intake</span>
                </div>
                {isRecording && (
                  <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 rounded-full text-[10px] font-bold font-mono animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    Recording 0:{voiceTimer < 10 ? `0${voiceTimer}` : voiceTimer}
                  </span>
                )}
              </div>

              {isRecording ? (
                <div className="flex items-center gap-4 py-3 justify-center">
                  <div className="flex items-center gap-1">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [12, 32, 12] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-emerald-500 rounded-full"
                        style={{ height: "16px" }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-md cursor-pointer"
                  >
                    <MicOff className="w-3.5 h-3.5" /> Stop & Transcribe
                  </button>
                </div>
              ) : voiceTranscript ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 italic">
                    "{voiceTranscript}"
                  </div>
                  <button
                    onClick={() => setVoiceTranscript("")}
                    className="text-[10px] text-rose-600 hover:text-rose-500 font-bold flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear Transcription
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={startRecording}
                    className="px-4 py-2.5 bg-emerald-50 border border-emerald-200/60 hover:bg-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" /> Speak Operational Details
                  </button>
                </div>
              )}
            </div>

            {/* Quick Describe text field */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">Written Descriptive Intake</span>
                </div>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe the issue... (e.g., Water pooling on secondary lane, street light flickering at strategic pedestrian crossing...)"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]/20 transition-all"
              />
            </div>

            {/* Location indicator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs font-mono shadow-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-red-500 animate-pulse" />
                <span>GPS Location Lock:</span>
                <span className="text-slate-800 font-semibold">{detectedLocation}</span>
              </div>
              <span className="text-[10px] text-slate-600 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg uppercase">Auto Plotted</span>
            </div>

            {/* Preset quick test helper */}
            <div className="flex flex-col gap-2 bg-blue-50/30 p-4 border border-blue-100 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-[#1A73E8] tracking-wider uppercase">
                ⚡ Hackathon Preset Tester:
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyPreset("pothole")}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50/50 text-slate-700 hover:text-[#1A73E8] hover:border-blue-300 text-[11px] rounded-xl border border-slate-200/80 font-bold shadow-xs transition cursor-pointer"
                >
                  Apply Pothole Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("water")}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50/50 text-slate-700 hover:text-[#1A73E8] hover:border-blue-300 text-[11px] rounded-xl border border-slate-200/80 font-bold shadow-xs transition cursor-pointer"
                >
                  Apply Leak Preset
                </button>
              </div>
            </div>

            {/* Run Analysis CTA */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleTriggerAnalysis}
              className="w-full py-3 bg-[#1A73E8] hover:bg-blue-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Trigger Gemini AI Diagnosis
            </motion.button>
          </motion.div>
        )}

        {/* ==========================================
            SCREEN 2: AI PROCESSING THINKING
           ========================================== */}
        {step === "processing" && (
          <motion.div
            key="processing-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-12"
          >
            <AIProcessingLoader currentStage={processingStage} />
          </motion.div>
        )}

        {/* ==========================================
            SCREEN 3: AI REVIEW CONFIRMATION
           ========================================== */}
        {step === "review" && (
          <motion.div
            key="review-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="space-y-1 text-center py-2">
              <h2 className="text-xl font-bold tracking-tight text-[#0A2540] flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 animate-bounce" /> Confirm AI Verification
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Verify confidence rankings and adjust telemetry descriptors if necessary.
              </p>
            </div>

            {/* AI Insight Insight Card */}
            <AIInsightCard report={aiReport} expandedByDefault={true} />

            {/* Editable Fields form */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase">
                Interactive Report Parameters
              </h3>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]/20 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                  Description / Context Summary
                </label>
                <textarea
                  value={editableDesc}
                  onChange={(e) => setEditableDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location Lock */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                    Location Description
                  </label>
                  <input
                    type="text"
                    value={editableLocation}
                    onChange={(e) => setEditableLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]/20 transition-all"
                  />
                </div>

                {/* Suggested Severity override */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                    Dispatch Priority
                  </label>
                  <select
                    value={editableSeverity}
                    onChange={(e) => setEditableSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]/20 transition-all"
                  >
                    <option value="low">Low Severity (Routine)</option>
                    <option value="medium">Medium Severity (Moderate)</option>
                    <option value="high">High Severity (Critical)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Directives details and CTA bar */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("intake")}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition cursor-pointer border border-slate-200"
              >
                Re-Diagnose Incident
              </button>
              
              <button
                onClick={handleConfirmReport}
                className="flex-1.5 py-2.5 bg-[#1A73E8] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Save & Dispatch Crews
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

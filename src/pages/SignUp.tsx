import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { mockAuth } from "../services/mockAuth";
import { Shield, Mail, Lock, User, Phone, Briefcase, MapPin, Loader2, ArrowRight, CheckCircle2, X, Sparkles } from "lucide-react";

export function SignUp() {
  const [role, setRole] = useState<"citizen" | "officer">("citizen");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    employeeId: "",
    department: "",
    governmentEmail: "",
    officeLocation: "",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Lily",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await mockAuth.register({
        ...formData,
        role,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Complete!</h2>
          <p className="text-slate-600 mb-8">
            Demo account created successfully.
          </p>
          <p className="text-sm font-semibold text-slate-400">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex relative overflow-hidden">
      {/* Dynamic Background Elements - Apply globally in this view */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Left Side - Illustration (Now more integrated) */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden z-10 border-r border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-slate-900/80 to-slate-900/95 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-[0_0_30px_rgba(79,70,229,0.3)]"
          >
            <Shield className="w-8 h-8 text-indigo-300" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300"
          >
            Join the future of municipal management.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-indigo-200/80 text-lg mb-12 font-medium"
          >
            CivicMind connects citizens directly with city infrastructure management using advanced AI detection and real-time spatial analytics.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {[
              "AI-powered issue detection and categorization.",
              "Real-time transparent progress tracking.",
              "Direct connection to verified city officials."
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="font-semibold text-indigo-50 text-sm tracking-wide">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto relative z-10 bg-slate-900/50 lg:bg-transparent backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/20 border border-white/20"
        >
          <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-100 lg:border-none lg:pb-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create an Account</h2>
              <p className="text-slate-500 mt-1 text-xs sm:text-sm">Join CivicMind to improve your city</p>
            </div>
            <Link 
              to="/" 
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full shadow-sm shrink-0"
              title="Go Back"
            >
              <X className="w-5 h-5" />
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                  role === "citizen"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole("officer")}
                className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                  role === "officer"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                City Officer
              </button>
            </div>

            {/* Avatar Selection */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
              <label className="block text-sm font-bold text-slate-800 mb-3">Choose Profile Avatar</label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Active Preview */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-indigo-50">
                      <img 
                        src={formData.avatar} 
                        alt="Selected Avatar Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 shadow-sm border border-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="flex-1 overflow-hidden">
                    <span className="text-xs font-semibold text-slate-500 block mb-2">Select premium vector style:</span>
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                      {[
                        "https://api.dicebear.com/7.x/lorelei/svg?seed=Lily",
                        "https://api.dicebear.com/7.x/adventurer/svg?seed=George",
                        "https://api.dicebear.com/7.x/lorelei/svg?seed=Nala",
                        "https://api.dicebear.com/7.x/bottts/svg?seed=Terminator",
                        "https://api.dicebear.com/7.x/open-peeps/svg?seed=Max",
                        "https://api.dicebear.com/7.x/adventurer/svg?seed=Bear",
                        "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cute",
                        "https://api.dicebear.com/7.x/open-peeps/svg?seed=Aria"
                      ].map((avatarUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar: avatarUrl })}
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                            formData.avatar === avatarUrl
                              ? "border-indigo-600 ring-2 ring-indigo-600/20 scale-105"
                              : "border-slate-200 hover:border-slate-300 opacity-85 hover:opacity-100"
                          }`}
                        >
                          <img src={avatarUrl} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover bg-slate-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Avatar Seed Generator */}
                <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Or personalize avatar:
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="w-full pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                      placeholder="Type your name or any text to generate custom avatar..."
                      onChange={(e) => {
                        const seed = e.target.value.trim();
                        if (seed) {
                          setFormData({
                            ...formData,
                            avatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(seed)}`
                          });
                        } else {
                          setFormData({
                            ...formData,
                            avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Lily"
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {role === "officer" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden pt-4 border-t border-slate-100"
                >
                  <h3 className="text-lg font-bold text-slate-800">Officer Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Employee ID</label>
                      <input
                        type="text"
                        name="employeeId"
                        required={role === "officer"}
                        value={formData.employeeId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                        placeholder="OFF-12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                      <select
                        name="department"
                        required={role === "officer"}
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-slate-700"
                      >
                        <option value="">Select Department</option>
                        <option value="Roads">Roads & Transport</option>
                        <option value="Water">Water & Sanitation</option>
                        <option value="Power">Electricity</option>
                        <option value="Safety">Public Safety</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Government Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Briefcase className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          name="governmentEmail"
                          required={role === "officer"}
                          value={formData.governmentEmail}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                          placeholder="name@city.gov"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Office Location</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          name="officeLocation"
                          required={role === "officer"}
                          value={formData.officeLocation}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                          placeholder="City Hall, Room 402"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 transition font-bold"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

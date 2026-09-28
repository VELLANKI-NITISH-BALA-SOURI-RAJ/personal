"use client";

import { useState } from "react";
import { 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Check, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Star,
  Activity,
  Heart,
  GitCompare,
  TrendingUp,
  Award,
  Cpu,
  BadgeAlert
} from "lucide-react";
import { Accessory } from "../../data/accessoriesData";
import { RecommendationResult, QuestionnaireInput } from "../../lib/recommendationEngine";
import { dbService } from "../../lib/dbService";

export default function Recommend() {
  // Questionnaire wizard state
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuestionnaireInput>({
    budget: 5000,
    category: "tws",
    usage: "all-rounder",
    wiredWireless: "either",
    ancNeeded: false,
    batteryExpectation: "any",
    preferredBrands: [],
    compatibility: "any",
    comfortImportance: false,
    micImportance: false,
    soundPreference: "any",
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<RecommendationResult | null>(null);

  // Saved / Wishlist notifications
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [brandInput, setBrandInput] = useState("");

  const loadingSequence = [
    "Connecting to crawler gateways...",
    "Crawling Amazon & Flipkart review logs...",
    "Scanning Reddit boards (r/headphones, r/iem) for durability audits...",
    "Filtering affiliate promotions and sponsored hype spikes...",
    "Calculating multi-dimensional value and performance score...",
    "Synthesizing direct tradeoffs and honest verdict..."
  ];

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleBrandAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && brandInput.trim()) {
      e.preventDefault();
      if (!form.preferredBrands.includes(brandInput.trim())) {
        setForm({
          ...form,
          preferredBrands: [...form.preferredBrands, brandInput.trim()]
        });
      }
      setBrandInput("");
    }
  };

  const handleBrandRemove = (bName: string) => {
    setForm({
      ...form,
      preferredBrands: form.preferredBrands.filter((b) => b !== bName)
    });
  };

  const triggerRecommendation = async () => {
    setIsProcessing(true);
    setLoadingStep(0);

    // Simulate multi-step loading sequences
    for (let i = 0; i < loadingSequence.length; i++) {
      setLoadingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const resData = await response.json();
      if (resData.success) {
        setResults(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveProduct = async (product: Accessory) => {
    await dbService.saveProduct(product, "Saved from AI recommendation scan.");
    setSavedIds(new Set([...savedIds, product.id]));
  };

  const handleAddToCompare = (product: Accessory) => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('tgid_compare_ids') : null;
    let list: string[] = stored ? JSON.parse(stored) : [];
    if (!list.includes(product.id)) {
      list.push(product.id);
      localStorage.setItem('tgid_compare_ids', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
      setCompareIds(new Set([...compareIds, product.id]));
    }
  };

  const handleReset = () => {
    setResults(null);
    setStep(1);
    setForm({
      budget: 5000,
      category: "tws",
      usage: "all-rounder",
      wiredWireless: "either",
      ancNeeded: false,
      batteryExpectation: "any",
      preferredBrands: [],
      compatibility: "any",
      comfortImportance: false,
      micImportance: false,
      soundPreference: "any",
    });
    setSavedIds(new Set());
  };

  const categories = [
    { id: "tws", label: "TWS Earbuds" },
    { id: "headphones", label: "Over-ear Headphones" },
    { id: "gaming-headsets", label: "Gaming Headsets" },
    { id: "wired-earphones", label: "Wired IEMs" },
    { id: "speakers", label: "Bluetooth Speakers" },
    { id: "chargers", label: "Fast Chargers" },
    { id: "power-banks", label: "Power Banks" },
    { id: "keyboards", label: "Keyboards" },
    { id: "mouse", label: "Mouse Devices" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-16 animate-fade-in">
      
      {/* Header section */}
      <section className="flex flex-col gap-2 border-b border-white/5 pb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-accent" />
          <h1 className="text-3xl font-black tracking-tight text-white">AI Accessories Advisor</h1>
        </div>
        <p className="text-slate-400 text-sm font-light max-w-xl">
          Enter your specific hardware guidelines. We filter out marketing spin and locate products built to last.
        </p>
      </section>

      {/* Main wizard interface */}
      {!isProcessing && !results && (
        <div className="glass-card rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col gap-8">
          
          {/* Progress Indicators */}
          <div className="flex justify-between items-center bg-white/2 p-3 rounded-xl border border-white/5">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  step === s 
                    ? "bg-cyber-gradient text-background neon-glow-teal" 
                    : step > s 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                      : "bg-white/5 text-slate-500 border border-white/5"
                }`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                <span className={`hidden sm:inline text-xs font-bold ${step === s ? "text-teal-accent" : "text-slate-500"}`}>
                  {s === 1 && "Category & Budget"}
                  {s === 2 && "Usage & Specs"}
                  {s === 3 && "Acoustics & Build"}
                  {s === 4 && "Devices & Brands"}
                </span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="min-h-[250px]">
            
            {/* Step 1: Category and Budget */}
            {step === 1 && (
              <div className="flex flex-col gap-6 animate-slide-up">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-300">What category of accessory are you seeking?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setForm({ ...form, category: cat.id })}
                        className={`p-4 rounded-xl border text-xs font-bold text-left transition-all ${
                          form.category === cat.id
                            ? "bg-white/10 text-teal-accent border-teal-accent/40"
                            : "bg-white/2 text-slate-400 border-white/5 hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-300">Max Budget Threshold</label>
                    <span className="text-lg font-black text-teal-accent">₹{form.budget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-accent"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>₹1,000</span>
                    <span>₹5,000</span>
                    <span>₹10,000</span>
                    <span>₹15,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Connection & Usage */}
            {step === 2 && (
              <div className="flex flex-col gap-6 animate-slide-up">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-300">Wired or Wireless preferences?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "wireless", label: "Wireless / Bluetooth" },
                      { id: "wired", label: "Wired Only" },
                      { id: "either", label: "No Preference" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setForm({ ...form, wiredWireless: opt.id as any })}
                        className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                          form.wiredWireless === opt.id
                            ? "bg-white/10 text-teal-accent border-teal-accent/40"
                            : "bg-white/2 text-slate-400 border-white/5 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-sm font-bold text-slate-300">Primary Usage Focus</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: "all-rounder", label: "General Daily Usage" },
                      { id: "gaming", label: "Low-latency Gaming" },
                      { id: "music", label: "Acoustics & Music" },
                      { id: "calls", label: "Office Calls / Mic Quality" },
                      { id: "workout", label: "Gym & Workouts (Sweatproof)" },
                      { id: "travel", label: "Commuting & Travel (Battery)" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setForm({ ...form, usage: opt.id as any })}
                        className={`p-4 rounded-xl border text-xs font-bold text-left transition-all ${
                          form.usage === opt.id
                            ? "bg-white/10 text-teal-accent border-teal-accent/40"
                            : "bg-white/2 text-slate-400 border-white/5 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Acoustics & Build */}
            {step === 3 && (
              <div className="flex flex-col gap-6 animate-slide-up">
                
                {/* ANC & Sound signature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* ANC Toggle (only showing if relevant) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-300">Is Active Noise Cancellation (ANC) required?</label>
                    <div className="flex gap-3">
                      {[
                        { id: true, label: "Yes, block ambient noise" },
                        { id: false, label: "No / Not relevant" }
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setForm({ ...form, ancNeeded: opt.id })}
                          className={`flex-1 p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                            form.ancNeeded === opt.id
                              ? "bg-white/10 text-teal-accent border-teal-accent/40"
                              : "bg-white/2 text-slate-400 border-white/5 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sound Profile */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-300">Acoustic Sound Signature preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "balanced", label: "Balanced / Neutral" },
                        { id: "bass-heavy", label: "Bass-heavy / Warm" },
                        { id: "vocal-clarity", label: "Vocal Clarity / Highs" }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setForm({ ...form, soundPreference: opt.id as any })}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                            form.soundPreference === opt.id
                              ? "bg-white/10 text-teal-accent border-teal-accent/40"
                              : "bg-white/2 text-slate-400 border-white/5 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Micro-Flags */}
                <div className="flex flex-col gap-2 mt-4 bg-white/2 p-4 rounded-xl border border-white/5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Key Focus Flags</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-300">
                      <input
                        type="checkbox"
                        checked={form.comfortImportance}
                        onChange={(e) => setForm({ ...form, comfortImportance: e.target.checked })}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-teal-accent focus:ring-teal-accent focus:ring-offset-slate-900 cursor-pointer"
                      />
                      Prioritize Cushioning & Comfort
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-300">
                      <input
                        type="checkbox"
                        checked={form.micImportance}
                        onChange={(e) => setForm({ ...form, micImportance: e.target.checked })}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-teal-accent focus:ring-teal-accent focus:ring-offset-slate-900 cursor-pointer"
                      />
                      Prioritize Microphone Quality
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Device Compatibility & Preferred Brands */}
            {step === 4 && (
              <div className="flex flex-col gap-6 animate-slide-up">
                
                {/* Device compatibility */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-300">Device Ecosystem / Compatibility</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "any", label: "All Ecosystems" },
                      { id: "iOS", label: "iPhone / iPad (iOS)" },
                      { id: "Android", label: "Android OS" },
                      { id: "Mac", label: "macOS / Windows" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setForm({ ...form, compatibility: opt.id as any })}
                        className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                          form.compatibility === opt.id
                            ? "bg-white/10 text-teal-accent border-teal-accent/40"
                            : "bg-white/2 text-slate-400 border-white/5 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands input */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-sm font-bold text-slate-300">Preferred Brands (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type brand name and hit Enter (e.g. 'Sony', 'OnePlus')..."
                      value={brandInput}
                      onChange={(e) => setBrandInput(e.target.value)}
                      onKeyDown={handleBrandAdd}
                      className="flex-1 p-3 rounded-xl glass-input text-xs"
                    />
                  </div>
                  
                  {form.preferredBrands.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.preferredBrands.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300"
                        >
                          {b}
                          <button
                            onClick={() => handleBrandRemove(b)}
                            className="hover:text-rose-accent ml-1"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Action Bar */}
          <div className="flex justify-between border-t border-white/5 pt-6 mt-2">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 font-bold text-xs text-slate-300 transition-colors ${
                step === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5 cursor-pointer"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs text-teal-accent hover:text-white transition-all cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={triggerRecommendation}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-gradient text-background font-black text-xs hover:scale-[1.01] transition-all cursor-pointer neon-glow-teal"
              >
                <Sparkles className="w-4 h-4" />
                Find Best Recommendations
              </button>
            )}
          </div>

        </div>
      )}

      {/* Crawling and processing loading state */}
      {isProcessing && (
        <div className="glass-card rounded-2xl border border-white/5 p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
          
          {/* Animated custom loader */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer spinning radar */}
            <div className="absolute inset-0 rounded-full border-2 border-teal-accent/20 border-t-teal-accent animate-spin duration-1000"></div>
            {/* Inner radar rings */}
            <div className="absolute w-16 h-16 rounded-full border border-blue-accent/20 border-b-blue-accent animate-spin duration-700 reverse"></div>
            <Activity className="w-8 h-8 text-teal-accent animate-pulse" />
          </div>

          <div className="flex flex-col items-center text-center gap-2 max-w-md">
            <h3 className="font-extrabold text-lg text-white">Deep Crawler Analysis Active</h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              We are bypassing affiliate tracking tokens, analyzing structural failure complaints on Amazon/Flipkart, and retrieving Reddit consensus.
            </p>
          </div>

          {/* Scrolling crawl steps logs */}
          <div className="w-full max-w-lg bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[11px] text-slate-400 flex flex-col gap-2">
            {loadingSequence.map((seq, index) => {
              const isDone = index < loadingStep;
              const isActive = index === loadingStep;
              return (
                <div key={seq} className={`flex items-center gap-2 ${
                  isDone 
                    ? "text-emerald-400" 
                    : isActive 
                      ? "text-teal-accent font-semibold" 
                      : "text-slate-600"
                }`}>
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  ) : isActive ? (
                    <span className="w-3.5 h-3.5 rounded-full border border-teal-accent border-t-transparent animate-spin shrink-0"></span>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"></div>
                  )}
                  <span>{seq}</span>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Recommendations Results View */}
      {results && !isProcessing && (
        <div className="flex flex-col gap-10 animate-fade-in">
          
          {/* Summary Panel */}
          <section className="glass-card rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-gradient opacity-5 rounded-full blur-[80px]"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-teal-accent" />
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Advisor Verdict</span>
                  <h2 className="text-xl font-extrabold text-white leading-tight mt-0.5">Audit Summary</h2>
                </div>
              </div>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 text-slate-300 font-bold text-xs border border-white/5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Scan Again
              </button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed font-light">
              {results.reasoningSummary}
            </p>
          </section>

          {/* Unrealistic Budget / Tradeoffs Alert */}
          {results.tradeoffsAlert && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
              <BadgeAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black text-amber-500 uppercase tracking-wider">Acoustic Trade-Off Alert</span>
                <p className="text-xs text-amber-100/90 leading-relaxed font-light whitespace-pre-line">
                  {results.tradeoffsAlert}
                </p>
              </div>
            </div>
          )}

          {/* Standard Roles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { role: "Best Overall", item: results.bestOverall, color: "border-teal-accent/30 shadow-[0_4px_30px_rgba(0,242,254,0.02)]" },
              { role: "Best Value for Money", item: results.bestValue, color: "border-emerald-accent/30" },
              { role: "Best Premium Option", item: results.bestPremium, color: "border-blue-accent/30" },
              { role: "Best Budget Option", item: results.bestBudget, color: "border-slate-800" },
            ].map((roleGroup) => {
              const product = roleGroup.item;
              if (!product) return null;
              
              const isSaved = savedIds.has(product.id);
              const isCompared = compareIds.has(product.id);

              return (
                <div key={roleGroup.role} className={`rounded-2xl glass-card border ${roleGroup.color} p-6 flex flex-col justify-between group`}>
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest">{roleGroup.role}</span>
                        <h3 className="font-extrabold text-xl text-white mt-1 line-clamp-1">{product.name}</h3>
                      </div>
                      <span className="text-xs font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-300">
                        ₹{product.priceINR.toLocaleString()}
                      </span>
                    </div>

                    {/* Image and Specs overview */}
                    <div className="flex gap-4 mb-4">
                      <div 
                        className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 border border-white/5 bg-slate-900"
                        style={{ backgroundImage: `url(${product.image})` }}
                      ></div>
                      <div className="flex flex-col gap-1 justify-center py-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold">{product.rating}</span>
                          <span className="text-slate-500 font-light">| Trust: {product.brandTrustScore}/10</span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 line-clamp-2"><strong className="text-slate-300">Best for:</strong> {product.bestFor}</span>
                      </div>
                    </div>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      <span className="text-[10px] font-bold bg-white/2 border border-white/5 px-2.5 py-1 rounded-md text-slate-400">Battery: {product.batteryLife}</span>
                      {product.anc !== "None" && (
                        <span className="text-[10px] font-bold bg-white/2 border border-white/5 px-2.5 py-1 rounded-md text-slate-400">ANC: Yes</span>
                      )}
                      <span className="text-[10px] font-bold bg-white/2 border border-white/5 px-2.5 py-1 rounded-md text-slate-400">Durability: {product.durabilityScore}/10</span>
                    </div>

                    {/* Pros and Cons lists */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/2 border border-white/5 rounded-xl p-4 mb-5">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-emerald-accent uppercase tracking-wider">Pros</span>
                        <ul className="flex flex-col gap-1.5 text-[11px] font-light text-slate-400">
                          {product.pros.slice(0, 2).map((p) => (
                            <li key={p} className="flex gap-1.5">
                              <span className="text-emerald-400 shrink-0">&bull;</span>
                              <span className="line-clamp-2">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2 border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-4">
                        <span className="text-[10px] font-black text-rose-accent uppercase tracking-wider">Cons</span>
                        <ul className="flex flex-col gap-1.5 text-[11px] font-light text-slate-400">
                          {product.cons.slice(0, 2).map((c) => (
                            <li key={c} className="flex gap-1.5">
                              <span className="text-rose-accent shrink-0">&bull;</span>
                              <span className="line-clamp-2">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex gap-2 border-t border-white/5 pt-4">
                    <button
                      onClick={() => handleSaveProduct(product)}
                      disabled={isSaved}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                        isSaved 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-white/3 border-white/5 hover:bg-white/8 text-slate-300"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? "fill-emerald-400 text-emerald-400" : "text-slate-400"}`} />
                      {isSaved ? "Saved" : "Save Product"}
                    </button>
                    <button
                      onClick={() => handleAddToCompare(product)}
                      disabled={isCompared}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                        isCompared 
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                          : "bg-white/3 border-white/5 hover:bg-white/8 text-slate-300"
                      }`}
                    >
                      <GitCompare className="w-4 h-4 text-slate-400" />
                      {isCompared ? "Compared" : "Add to Compare"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alternative Picks list */}
          {results.alternatives.length > 0 && (
            <section className="flex flex-col gap-4 border-t border-white/5 pt-8">
              <h3 className="font-extrabold text-xl text-white">Alternative Candidates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.alternatives.map((item) => (
                  <div key={item.id} className="glass-card rounded-xl border border-white/5 p-4 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span className="uppercase">{item.brand}</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-white line-clamp-1 mt-1">{item.name}</h4>
                      <span className="text-xs font-black text-slate-300 mt-2 block">₹{item.priceINR.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-1.5 border-t border-white/5 pt-3">
                      <button
                        onClick={() => handleSaveProduct(item)}
                        className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAddToCompare(item)}
                        className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`/product/${item.id}`}
                        className="flex-1 text-center py-2 bg-white/5 hover:bg-white/8 text-[10px] font-bold text-slate-300 border border-white/5 rounded-lg cursor-pointer"
                      >
                        Audit Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

    </div>
  );
}

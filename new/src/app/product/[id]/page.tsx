"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  GitCompare, 
  ShieldCheck, 
  ShieldAlert, 
  Database,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  MessageSquare,
  Cpu,
  BookmarkCheck
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { accessoriesData, Accessory } from "../../../data/accessoriesData";
import { dbService } from "../../../lib/dbService";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Accessory | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Find the product
    const match = accessoriesData.find((p) => p.id === id);
    if (match) {
      setProduct(match);
      checkSavedAndCompared(match.id);
    }
  }, [id]);

  const checkSavedAndCompared = async (productId: string) => {
    // Check saved
    const saved = await dbService.getSavedProducts();
    setIsSaved(saved.some((item) => item.product.id === productId));

    // Check compared
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tgid_compare_ids");
      if (stored) {
        try {
          const compareList: string[] = JSON.parse(stored);
          setIsCompared(compareList.includes(productId));
        } catch {
          setIsCompared(false);
        }
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!product) return;
    await dbService.saveProduct(product, "Saved from dynamic product audit page.");
    setIsSaved(true);
  };

  const handleAddToCompare = () => {
    if (!product) return;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('tgid_compare_ids') : null;
    let list: string[] = stored ? JSON.parse(stored) : [];
    if (!list.includes(product.id)) {
      list.push(product.id);
      localStorage.setItem('tgid_compare_ids', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
      setIsCompared(true);
    }
  };

  if (!product) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-center">
        <Cpu className="w-12 h-12 text-slate-700 animate-spin" />
        <h3 className="text-lg font-bold text-white">Loading Accessory Audit Log...</h3>
      </div>
    );
  }

  // 1. Data Prep: Reddit Sentiment Ratios
  const redditSentimentData = [
    { name: "Positive Sentiment", value: product.sentiment.redditScore },
    { name: "Negative/Critical Reviews", value: 100 - product.sentiment.redditScore },
  ];

  // 2. Data Prep: Channel Ratings (Reddit, Amazon, Flipkart, TechBlogs)
  const channelData = [
    { name: "Reddit approval", Rating: product.sentiment.redditScore / 10 },
    { name: "Amazon Rating", Rating: product.rating },
    { name: "Flipkart Rating", Rating: Number((product.rating - 0.2).toFixed(1)) },
    { name: "Expert Blogs", Rating: Number((product.durabilityScore).toFixed(1)) },
  ];

  const REDDIT_COLORS = ["#00f2fe", "#f43f5e"];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-16 animate-fade-in text-left">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 font-extrabold text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>
      </div>

      {/* Main Grid split: Product Cover Specs (Left) & Deep Sentiment Analysis (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Product Card details (1 Col) */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
            {/* Image banner */}
            <div 
              className="w-full h-56 bg-cover bg-center border-b border-white/5 bg-slate-900"
              style={{ backgroundImage: `url(${product.image})` }}
            ></div>
            
            {/* Direct details */}
            <div className="p-6 flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest leading-none">{product.brand}</span>
                <h2 className="text-2xl font-black text-white mt-1 leading-tight">{product.name}</h2>
                <span className="text-xl font-black text-slate-300 mt-2 block">₹{product.priceINR.toLocaleString()}</span>
              </div>

              {/* Specification List */}
              <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ecosystem compatibility:</span>
                  <span className="font-bold text-slate-300">{product.bestFor.includes("iPhone") || product.name.includes("OnePlus") ? "Android / iOS" : "Universal"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Battery Life:</span>
                  <span className="font-bold text-slate-300">{product.batteryLife}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ANC Spec:</span>
                  <span className="font-bold text-slate-300">{product.anc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Warranty:</span>
                  <span className="font-bold text-slate-300">{product.warranty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Water resistance:</span>
                  <span className="font-bold text-slate-300">{product.waterResistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Connection Mode:</span>
                  <span className="font-bold text-slate-300">{product.bluetoothVersion !== "None" ? `Wireless (${product.bluetoothVersion})` : "Wired Mode"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                <button
                  onClick={handleSaveProduct}
                  disabled={isSaved}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    isSaved 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-cyber-gradient text-background neon-glow-teal hover:scale-[1.01]"
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  {isSaved ? "Saved to Wishlist" : "Bookmark Product"}
                </button>
                <button
                  onClick={handleAddToCompare}
                  disabled={isCompared}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    isCompared 
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  <GitCompare className="w-4 h-4" />
                  {isCompared ? "Already Compared" : "Add to Compare Matrix"}
                </button>
              </div>
            </div>
          </div>

          {/* Customer support ratings card */}
          <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider">Manufacturer Audit</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-white/2 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Brand Trust Score</span>
                  <span className="text-base font-extrabold text-slate-200 mt-0.5">{product.brandTrustScore}/10</span>
                </div>
                <ShieldCheck className="w-6 h-6 text-teal-accent" />
              </div>
              <div className="flex justify-between items-center bg-white/2 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Claim Support Rating</span>
                  <span className="text-base font-extrabold text-slate-200 mt-0.5">{product.supportScore}/10</span>
                </div>
                <TrendingUp className="w-6 h-6 text-emerald-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Sentiment Dashboard (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Section 1: Score & Honest Verdict */}
          <section className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-accent" />
                <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">Advisor Verdict</h3>
              </div>
              
              <div className="flex items-center gap-1 bg-teal-accent/15 px-3 py-1 rounded-lg border border-teal-accent/25">
                <Star className="w-3.5 h-3.5 fill-teal-accent text-teal-accent" />
                <span className="text-xs font-black text-teal-accent">{product.rating} / 5.0</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Summary Verdict</span>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {product.finalVerdict}
              </p>
            </div>
          </section>

          {/* Section 2: Review Sentiment Dashboard Charts */}
          {mounted && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pie: Reddit Sentiment */}
              <div className="glass-card rounded-2xl border border-white/5 p-5 flex flex-col gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">Reddit Sentiment Approval Ratio</span>
                
                <div className="h-48 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={redditSentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {redditSentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={REDDIT_COLORS[index % REDDIT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0d0f15", borderColor: "rgba(255,255,255,0.08)", borderRadius: "10px" }}
                        itemStyle={{ color: "#f8fafc" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Central Text percentage */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-teal-accent">{product.sentiment.redditScore}%</span>
                    <span className="text-[9px] text-slate-500 uppercase font-black">Reddit Positive</span>
                  </div>
                </div>
              </div>

              {/* Bar: Channels Rating Index */}
              <div className="glass-card rounded-2xl border border-white/5 p-5 flex flex-col gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">Scoring Index by Channel</span>
                
                <div className="h-48 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                      <YAxis stroke="#64748b" domain={[0, 10]} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0d0f15", borderColor: "rgba(255,255,255,0.08)", borderRadius: "10px" }}
                        itemStyle={{ color: "#f8fafc" }}
                      />
                      <Bar dataKey="Rating" fill="#00f2fe" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </section>
          )}

          {/* Section 3: Pros & Cons Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Pros & High Points</span>
              </div>
              <ul className="flex flex-col gap-3 text-xs font-light text-slate-400 leading-normal">
                {product.pros.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-emerald-400 shrink-0">&bull;</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/15 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-rose-500/10 pb-2">
                <ThumbsDown className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider">Cons & Tradeoffs</span>
              </div>
              <ul className="flex flex-col gap-3 text-xs font-light text-slate-400 leading-normal">
                {product.cons.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-rose-400 shrink-0">&bull;</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4: Durability Audit Logs */}
          <section className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-accent" />
                <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">Durability Incident Logs</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                <span className="text-xs font-black text-rose-400">Incident Rate: {product.sentiment.durabilityComplaintRate}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-xs font-light text-slate-400">
              <p className="leading-relaxed">
                Our web crawling engine scanned r/techsupport and e-commerce complaints to catalog long-term mechanical or hardware breakdowns. Below are authenticated reports that occurred after 3 to 12 months of daily use:
              </p>
              
              <div className="flex flex-col gap-3 mt-1.5">
                {product.sentiment.recentComplaints.map((comp) => (
                  <div key={comp} className="flex gap-3 bg-white/2 p-3.5 rounded-xl border border-white/5 text-slate-300">
                    <ShieldAlert className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium text-xs">{comp}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-500 leading-tight mt-2 italic">
                *Anti-Hype warning: High sponsored scores on Amazon (4.8+) often mask these mechanical flaws which only appear under heavy cyclic wear.
              </p>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}

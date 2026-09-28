"use client";

import { useState, useEffect } from "react";
import { 
  GitCompare, 
  Plus, 
  Trash2, 
  Trophy, 
  Search, 
  Sparkles,
  Award,
  ChevronRight,
  TrendingDown,
  Activity
} from "lucide-react";
import { Accessory, accessoriesData } from "../../data/accessoriesData";

interface WinnerSelection {
  overall: Accessory | null;
  gaming: Accessory | null;
  music: Accessory | null;
  calls: Accessory | null;
  budget: Accessory | null;
}

export default function Compare() {
  const [comparedProducts, setComparedProducts] = useState<Accessory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Accessory[]>([]);
  const [winners, setWinners] = useState<WinnerSelection>({
    overall: null,
    gaming: null,
    music: null,
    calls: null,
    budget: null,
  });

  useEffect(() => {
    loadComparedProducts();
  }, []);

  useEffect(() => {
    calculateWinners();
  }, [comparedProducts]);

  const loadComparedProducts = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tgid_compare_ids");
      if (stored) {
        try {
          const ids: string[] = JSON.parse(stored);
          const list = accessoriesData.filter((item) => ids.includes(item.id));
          setComparedProducts(list.slice(0, 4)); // cap at 4
        } catch {
          setComparedProducts([]);
        }
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    // Exclude already compared items
    const currentIds = comparedProducts.map((p) => p.id);
    const matches = accessoriesData.filter(
      (item) =>
        !currentIds.includes(item.id) &&
        (item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q))
    );
    setSearchResults(matches);
  };

  const handleAddProduct = (product: Accessory) => {
    if (comparedProducts.length >= 4) return; // limit 4
    const updated = [...comparedProducts, product];
    setComparedProducts(updated);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("tgid_compare_ids", JSON.stringify(updated.map((p) => p.id)));
      window.dispatchEvent(new Event('storage'));
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveProduct = (productId: string) => {
    const updated = comparedProducts.filter((p) => p.id !== productId);
    setComparedProducts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("tgid_compare_ids", JSON.stringify(updated.map((p) => p.id)));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleClearAll = () => {
    setComparedProducts([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("tgid_compare_ids");
      window.dispatchEvent(new Event('storage'));
    }
  };

  const calculateWinners = () => {
    if (comparedProducts.length === 0) {
      setWinners({ overall: null, gaming: null, music: null, calls: null, budget: null });
      return;
    }

    // 1. Winner Overall: Highest Rating * DurabilityScore combo
    const overall = [...comparedProducts].sort(
      (a, b) => (b.rating * b.durabilityScore) - (a.rating * a.durabilityScore)
    )[0];

    // 2. Winner for Gaming: Lowest Latency or best gaming indicators
    const gaming = [...comparedProducts].sort((a, b) => {
      const latA = parseInt(a.latency) || (a.id.includes('wired') || a.id.includes('salnotes') || a.id.includes('blackshark') ? 0 : 200);
      const latB = parseInt(b.latency) || (b.id.includes('wired') || b.id.includes('salnotes') || b.id.includes('blackshark') ? 0 : 200);
      return latA - latB;
    })[0];

    // 3. Winner for Music: Highest rated or Salnotes / IEM focused
    const music = [...comparedProducts].sort((a, b) => {
      let scoreA = a.rating;
      let scoreB = b.rating;
      if (a.category === 'wired-earphones') scoreA += 1;
      if (b.category === 'wired-earphones') scoreB += 1;
      return scoreB - scoreA;
    })[0];

    // 4. Winner for Calls: Best mic score indicator
    const calls = [...comparedProducts].sort((a, b) => {
      const getMicVal = (p: Accessory) => {
        if (p.micQuality.toLowerCase().includes('excellent')) return 5;
        if (p.micQuality.toLowerCase().includes('great')) return 4;
        if (p.micQuality.toLowerCase().includes('good')) return 3;
        return 2;
      };
      return getMicVal(b) - getMicVal(a);
    })[0];

    // 5. Winner under Budget: Lowest price
    const budget = [...comparedProducts].sort((a, b) => a.priceINR - b.priceINR)[0];

    setWinners({ overall, gaming, music, calls, budget });
  };

  const specificationsRow = [
    { label: "Price (INR)", key: "priceINR", format: (val: number) => `₹${val.toLocaleString()}` },
    { label: "Battery Life", key: "batteryLife" },
    { label: "Active Noise Cancellation", key: "anc" },
    { label: "Driver Size", key: "driverSize" },
    { label: "Bluetooth Version", key: "bluetoothVersion" },
    { label: "Codecs Supported", key: "codecs", format: (val: string[]) => val && val.length > 0 ? val.join(", ") : "N/A" },
    { label: "Gaming Latency", key: "latency" },
    { label: "Mic Quality", key: "micQuality" },
    { label: "Fast Charging", key: "fastCharging" },
    { label: "Water Resistance", key: "waterResistance" },
    { label: "Warranty Period", key: "warranty" },
    { label: "Durability Rating", key: "durabilityScore", format: (val: number) => `${val}/10` },
    { label: "Brand Trust Index", key: "brandTrustScore", format: (val: number) => `${val}/10` },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-16 animate-fade-in">
      
      {/* Header section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-teal-accent" />
            <h1 className="text-3xl font-black tracking-tight text-white">Product Comparison Matrix</h1>
          </div>
          <p className="text-slate-400 text-sm font-light max-w-xl">
            Compare key technical specifications side-by-side. Bypasses brand branding fluff to expose direct performance indicators.
          </p>
        </div>
        
        {comparedProducts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs cursor-pointer transition-colors"
          >
            Clear All
          </button>
        )}
      </section>

      {/* Dynamic Search & Add Bar */}
      {comparedProducts.length < 4 && (
        <section className="flex flex-col gap-3 p-5 rounded-2xl bg-white/2 border border-white/5">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Search & Add to Compare Matrix ({comparedProducts.length}/4)</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search accessories (e.g. OnePlus, Keychron, SonyWH)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs text-slate-300 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick results */}
          {searchResults.length > 0 && (
            <div className="flex flex-col gap-2 mt-2 max-h-60 overflow-y-auto border border-white/5 p-2 rounded-xl bg-black/40">
              {searchResults.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 border border-white/5"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{item.brand}</span>
                      <span className="text-xs font-bold text-white leading-tight">{item.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddProduct(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-accent/15 hover:bg-teal-accent text-teal-accent hover:text-background font-extrabold text-[10px] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {comparedProducts.length === 0 ? (
        <div className="glass-card rounded-2xl border border-white/5 p-12 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
          <GitCompare className="w-12 h-12 text-slate-600 animate-pulse" />
          <h3 className="font-extrabold text-lg text-white">Compare Matrix Empty</h3>
          <p className="text-xs text-slate-500 font-light max-w-sm">
            Launch the AI Recommendation Advisor, or use the search bar above to select up to 4 items and benchmark their specifications.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          
          {/* Comparison Matrix Grid */}
          <div className="overflow-x-auto rounded-2xl border border-white/5 glass-card">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Table Header containing Product Card Info */}
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-6 bg-black/20 w-52 shrink-0">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Technical Spec</span>
                  </th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-6 bg-black/10 border-l border-white/5 relative group">
                      <button
                        onClick={() => handleRemoveProduct(p.id)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="flex flex-col gap-3">
                        <div 
                          className="w-full h-28 rounded-lg bg-cover bg-center border border-white/5 bg-slate-900"
                          style={{ backgroundImage: `url(${p.image})` }}
                        ></div>
                        <div>
                          <span className="text-[9px] font-black text-teal-accent uppercase">{p.brand}</span>
                          <h3 className="font-extrabold text-sm text-white line-clamp-2 mt-0.5 leading-tight">{p.name}</h3>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body rows */}
              <tbody>
                {specificationsRow.map((row) => (
                  <tr key={row.key} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4 bg-black/20 font-bold text-xs text-slate-400">
                      {row.label}
                    </td>
                    {comparedProducts.map((p) => {
                      const val = (p as any)[row.key];
                      return (
                        <td key={`${p.id}-${row.key}`} className="p-4 border-l border-white/5 text-xs text-slate-200 font-medium">
                          {row.format ? row.format(val) : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Direct AI Winner Judgements (Only render if 2 or more products) */}
          {comparedProducts.length >= 2 && (
            <section className="flex flex-col gap-6">
              
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="w-5 h-5 text-teal-accent" />
                <h3 className="font-extrabold text-lg text-white">Advisor Direct Judgment Log</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Winner Overall", item: winners.overall, badge: "bg-teal-accent/10 border-teal-accent/30 text-teal-accent", desc: "Highest combined build, acoustic, and trust rating scores." },
                  { title: "Winner under Budget", item: winners.budget, badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", desc: "Best technical entry value representing minimal investment." },
                  { title: "Winner for Gaming", item: winners.gaming, badge: "bg-blue-500/10 border-blue-500/30 text-blue-400", desc: "Selected for absolute lowest latency and high positional sound imaging." },
                  { title: "Winner for Music", item: winners.music, badge: "bg-purple-500/10 border-purple-500/30 text-purple-400", desc: "Prioritizes sound curve accuracy, detail extraction, and acoustic codecs." },
                  { title: "Winner for Calls", item: winners.calls, badge: "bg-amber-500/10 border-amber-500/30 text-amber-400", desc: "Optimized beamforming microphones and ambient noise filtering." },
                ].map((w) => {
                  const item = w.item;
                  if (!item) return null;
                  return (
                    <div key={w.title} className="p-5 rounded-2xl glass-card border border-white/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{w.title}</span>
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black border ${w.badge} uppercase tracking-widest`}>
                          Winner
                        </div>
                      </div>
                      <div className="flex gap-3 mt-1">
                        <div 
                          className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-white/5"
                          style={{ backgroundImage: `url(${item.image})` }}
                        ></div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-extrabold text-sm text-white line-clamp-1 leading-tight">{item.name}</h4>
                          <span className="text-[10px] font-bold text-slate-400 mt-1">₹{item.priceINR.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 font-light leading-normal border-t border-white/5 pt-3">
                        {w.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

            </section>
          )}

        </div>
      )}

    </div>
  );
}

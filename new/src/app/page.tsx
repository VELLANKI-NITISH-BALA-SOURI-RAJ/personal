"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  Award, 
  History, 
  ShieldAlert, 
  Star,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Database
} from "lucide-react";
import { Accessory, accessoriesData } from "../data/accessoriesData";
import { dbService, SearchQuery } from "../lib/dbService";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Accessory[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchQuery[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  const categories = [
    { id: "all", label: "All Tech" },
    { id: "tws", label: "TWS Earbuds" },
    { id: "headphones", label: "Headphones" },
    { id: "gaming-headsets", label: "Gaming Headsets" },
    { id: "wired-earphones", label: "Wired IEMs" },
    { id: "speakers", label: "Speakers" },
    { id: "chargers", label: "Chargers" },
    { id: "power-banks", label: "Power Banks" },
    { id: "keyboards", label: "Keyboards" },
    { id: "mouse", label: "Mice" },
  ];

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    const list = await dbService.getRecentSearches();
    setRecentSearches(list);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = accessoriesData.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keyFeatures.some((f) => f.toLowerCase().includes(q))
    );
    setSearchResults(matches);
    dbService.saveSearch(searchQuery);
    setTimeout(loadRecentSearches, 500);
  };

  const filteredTrending = accessoriesData
    .filter((item) => selectedCategoryFilter === "all" || item.category === selectedCategoryFilter)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full pb-16 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-card p-8 md:p-12 border border-white/5 flex flex-col gap-6 text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-gradient opacity-10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 w-fit">
          <Sparkles className="w-4 h-4 text-teal-accent" />
          <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">Anti-Hype Electronics Advisor</span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Stop buying tech based on <br />
            <span className="text-cyber-gradient">sponsored hype.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl font-light">
            We crawl Reddit opinions, analyze structural durability complaints, and parse technical specifications to deliver completely honest, un-sponsored buying consulting.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-2">
          <Link
            href="/recommend"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyber-gradient text-background font-extrabold text-sm hover:scale-[1.02] transition-all duration-200 neon-glow-teal cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Launch AI Recommendation Advisor
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/8 text-white font-extrabold text-sm border border-white/10 transition-all duration-200 cursor-pointer"
          >
            Open Side-by-Side Comparison
          </Link>
        </div>
      </section>

      {/* Main Search Panel */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-200 px-1">Quick Product Search</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by brand, product type, or specific feature (e.g. 'OnePlus', 'mechanical keyboard', 'LDAC')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl glass-input text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-sm text-slate-200 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Search Results Display */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 animate-slide-up">
            {searchResults.map((item) => (
              <Link 
                key={item.id} 
                href={`/product/${item.id}`}
                className="flex gap-4 p-4 rounded-xl glass-card border border-white/5 hover:-translate-y-0.5 transition-transform"
              >
                <div 
                  className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0 border border-white/5 bg-slate-800"
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-teal-accent uppercase">{item.brand}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-200">{item.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm text-white line-clamp-1 mt-0.5">{item.name}</h3>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-black text-slate-300">₹{item.priceINR.toLocaleString()}</span>
                    <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-full font-bold text-slate-400 hover:text-white transition-colors">
                      View Audit &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Grid: Trending Accessories & Recent searches */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Trending Accessories Carousel & List (Col Span 3) */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-accent" />
              <h2 className="text-xl font-bold tracking-tight text-slate-200">Trending Accessories Index</h2>
            </div>
            
            {/* Category Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategoryFilter === cat.id
                      ? "bg-white/10 text-teal-accent border border-teal-accent/30"
                      : "bg-white/2 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrending.map((item) => (
              <div key={item.id} className="relative rounded-2xl glass-card border border-white/5 overflow-hidden flex flex-col justify-between group">
                {/* Brand Badge */}
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-teal-accent uppercase">{item.brand}</span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-extrabold text-slate-200">{item.rating}</span>
                </div>

                {/* Product Cover Image */}
                <div 
                  className="w-full h-48 bg-cover bg-center border-b border-white/5 bg-slate-900 group-hover:scale-[1.01] transition-transform duration-300"
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>

                {/* Details */}
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-white line-clamp-1 leading-tight">{item.name}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 font-light line-clamp-2">{item.bestFor}</p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-col gap-1.5 bg-white/2 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durability Audit</span>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Score:</span>
                      <span className="font-bold text-emerald-accent">{item.durabilityScore}/10</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Reddit Sentiment:</span>
                      <span className="font-bold text-slate-200">{item.sentiment.redditScore}% positive</span>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Honest Price</span>
                      <span className="text-lg font-black text-slate-200">₹{item.priceINR.toLocaleString()}</span>
                    </div>
                    <Link
                      href={`/product/${item.id}`}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-extrabold text-xs text-slate-200 hover:text-white transition-all flex items-center gap-1"
                    >
                      Audit Report
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Searches Sidebar & Methodologies (Col Span 1) */}
        <div className="flex flex-col gap-6">
          {/* Recent Searches */}
          <section className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <History className="w-4.5 h-4.5 text-blue-accent" />
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Recent Searches</h3>
            </div>
            
            {recentSearches.length === 0 ? (
              <span className="text-xs text-slate-500 italic py-2">No recent searches. Launch advisor to start.</span>
            ) : (
              <div className="flex flex-col gap-2">
                {recentSearches.slice(0, 5).map((search) => (
                  <button
                    key={search.id}
                    onClick={() => {
                      setSearchQuery(search.query);
                      const matches = accessoriesData.filter(
                        (item) =>
                          item.name.toLowerCase().includes(search.query.toLowerCase()) ||
                          item.brand.toLowerCase().includes(search.query.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.query.toLowerCase())
                      );
                      setSearchResults(matches);
                    }}
                    className="flex flex-col text-left p-2.5 rounded-lg bg-white/2 hover:bg-white/5 border border-white/5 transition-colors cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-300 group-hover:text-teal-accent truncate">{search.query}</span>
                    <span className="text-[9px] text-slate-500 mt-1">
                      {new Date(search.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Durability Standard */}
          <section className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Award className="w-4.5 h-4.5 text-emerald-accent" />
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">TGID Trust Score</h3>
            </div>
            <div className="flex flex-col gap-3.5 text-xs font-light text-slate-400">
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-accent shrink-0 mt-0.5" />
                <p><strong>Anti-Hype Filter:</strong> We scan text structure to automatically identify sponsored keywords or fake rating patterns.</p>
              </div>
              <div className="flex gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-accent shrink-0 mt-0.5" />
                <p><strong>Durability Scan:</strong> Aggregates long-term product reports from Reddit (r/headphones, r/iem, etc.) looking for cracks or battery health failure metrics.</p>
              </div>
              <div className="flex gap-2">
                <HelpCircle className="w-4 h-4 text-blue-accent shrink-0 mt-0.5" />
                <p><strong>Value Matrix:</strong> We compare features vs build durability rather than just listing raw specifications.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Home, 
  Sparkles, 
  GitCompare, 
  Heart, 
  TrendingUp, 
  Menu, 
  X, 
  Database,
  Cpu
} from "lucide-react";
import { dbService } from "../lib/dbService";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDbSupabase, setIsDbSupabase] = useState(false);

  useEffect(() => {
    setIsDbSupabase(dbService.isUsingSupabase());
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "AI Advisor", href: "/recommend", icon: Sparkles },
    { name: "Compare Matrix", href: "/compare", icon: GitCompare },
    { name: "Saved Products", href: "/saved", icon: Heart },
    { name: "Trends & Analytics", href: "/trending", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyber-gradient flex items-center justify-center neon-glow-teal">
            <Cpu className="w-4 h-4 text-background" />
          </div>
          <span className="font-extrabold text-lg bg-cyber-gradient bg-clip-text text-transparent">TGID Advisor</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-lg flex flex-col justify-between p-8 pt-24 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all ${
                    isActive 
                      ? "bg-cyber-gradient text-background neon-glow-teal" 
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Connection Status Drawer Footer */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
            <Database className={`w-4 h-4 ${isDbSupabase ? "text-emerald-400" : "text-blue-accent"}`} />
            <span className="text-xs font-semibold text-slate-400">
              Storage: {isDbSupabase ? "Supabase Cloud" : "LocalStorage Mode"}
            </span>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 bg-card border-r border-card-border p-6 select-none z-30">
        <div className="flex flex-col gap-8">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 px-2 group">
            <div className="w-10 h-10 rounded-xl bg-cyber-gradient flex items-center justify-center neon-glow-teal group-hover:scale-105 transition-transform duration-300">
              <Cpu className="w-5 h-5 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none bg-cyber-gradient bg-clip-text text-transparent">TGID</span>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Smart Advisor</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                    isActive 
                      ? "bg-white/5 text-teal-accent border-l-2 border-teal-accent font-semibold pl-6" 
                      : "text-slate-400 hover:bg-white/2 hover:text-slate-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-teal-accent" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Database Status badge */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/3 rounded-xl border border-white/5 backdrop-blur-sm">
          <div className="relative flex">
            <span className={`absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75 animate-ping ${isDbSupabase ? "bg-emerald-400" : "bg-blue-accent"}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDbSupabase ? "bg-emerald-500" : "bg-blue-500"}`}></span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-300 leading-tight">Database Engine</span>
            <span className="text-[10px] text-slate-500 leading-none">
              {isDbSupabase ? "Supabase Connected" : "Local Sandbox Active"}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

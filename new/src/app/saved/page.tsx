"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Heart, 
  Trash2, 
  Edit2, 
  Save, 
  GitCompare, 
  Star,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { dbService, SavedProduct } from "../../lib/dbService";

export default function Saved() {
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    const list = await dbService.getSavedProducts();
    setSavedProducts(list);
  };

  const handleRemove = async (productId: string) => {
    const success = await dbService.removeSavedProduct(productId);
    if (success) {
      loadSaved();
    }
  };

  const startEdit = (id: string, currentNotes: string = "") => {
    setEditingId(id);
    setTempNotes(currentNotes);
  };

  const saveNotes = async (productId: string) => {
    const success = await dbService.updateSavedNotes(productId, tempNotes);
    if (success) {
      setEditingId(null);
      loadSaved();
    }
  };

  const addToCompare = (productId: string) => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('tgid_compare_ids') : null;
    let list: string[] = stored ? JSON.parse(stored) : [];
    if (!list.includes(productId)) {
      list.push(productId);
      localStorage.setItem('tgid_compare_ids', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-16 animate-fade-in">
      
      {/* Header */}
      <section className="flex flex-col gap-2 border-b border-white/5 pb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-accent fill-rose-accent/10" />
          <h1 className="text-3xl font-black tracking-tight text-white">Your Saved Accessories</h1>
        </div>
        <p className="text-slate-400 text-sm font-light max-w-xl">
          Review your bookmarked accessories and add custom research notes to aid your final buying decisions.
        </p>
      </section>

      {savedProducts.length === 0 ? (
        <div className="glass-card rounded-2xl border border-white/5 p-12 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
          <Heart className="w-12 h-12 text-slate-600 animate-pulse" />
          <h3 className="font-extrabold text-lg text-white">Wishlist Empty</h3>
          <p className="text-xs text-slate-500 font-light max-w-sm">
            You haven't bookmarked any electronic accessories yet. Launch the AI recommendation advisor to inspect high-fidelity options.
          </p>
          <Link
            href="/recommend"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-gradient text-background font-extrabold text-xs hover:scale-[1.01] transition-all duration-200 cursor-pointer"
          >
            Launch Recommendations Advisor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {savedProducts.map((item) => {
            const product = item.product;
            const isEditing = editingId === product.id;
            return (
              <div 
                key={item.id} 
                className="glass-card rounded-2xl border border-white/5 p-5 md:p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-stretch"
              >
                
                {/* Details Section */}
                <div className="flex gap-4 flex-1">
                  <div 
                    className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 border border-white/5 bg-slate-900"
                    style={{ backgroundImage: `url(${product.image})` }}
                  ></div>
                  <div className="flex flex-col gap-1 py-1">
                    <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest leading-none">{product.brand}</span>
                    <h3 className="font-extrabold text-base text-white leading-tight mt-1">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-300">{product.rating}</span>
                      <span>|</span>
                      <span>₹{product.priceINR.toLocaleString()}</span>
                    </div>

                    <p className="text-xs text-slate-500 font-light mt-1.5 line-clamp-1">
                      {product.bestFor}
                    </p>
                  </div>
                </div>

                {/* Custom Notes Section */}
                <div className="flex-1 flex flex-col gap-2 min-w-[280px] w-full border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 justify-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">My Buying Notes</span>
                  {isEditing ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        className="flex-1 p-2 rounded-lg glass-input text-xs"
                        placeholder="Compare battery specs, mic issues..."
                      />
                      <button
                        onClick={() => saveNotes(product.id)}
                        className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30 transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs text-slate-400 italic font-light leading-relaxed">
                        {item.notes || "No custom annotations yet. Click edit to add notes."}
                      </p>
                      <button
                        onClick={() => startEdit(product.id, item.notes)}
                        className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex md:flex-col gap-2 shrink-0 justify-end w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <Link
                    href={`/product/${product.id}`}
                    className="flex-1 md:flex-initial text-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-extrabold text-xs text-slate-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Audit
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => addToCompare(product.id)}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-extrabold text-xs text-blue-accent hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    Compare Matrix
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 font-extrabold text-xs text-rose-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

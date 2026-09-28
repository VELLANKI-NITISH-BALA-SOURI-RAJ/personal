import { createClient } from '@supabase/supabase-js';
import { Accessory } from '../data/accessoriesData';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize real Supabase client only if keys are present
const isSupabaseConfigured = SUPABASE_URL.trim() !== '' && SUPABASE_ANON_KEY.trim() !== '';
export const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export interface SavedProduct {
  id: string;
  product: Accessory;
  savedAt: string;
  notes?: string;
}

export interface SearchQuery {
  id: string;
  query: string;
  timestamp: string;
  category?: string;
  budget?: number;
}

export const dbService = {
  isUsingSupabase(): boolean {
    return isSupabaseConfigured;
  },

  // --- Saved Products (Wishlist) ---
  async getSavedProducts(): Promise<SavedProduct[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('saved_products')
          .select('*')
          .order('saved_at', { ascending: false });

        if (!error && data) {
          return data.map((item) => ({
            id: item.id,
            product: item.product_data as Accessory,
            savedAt: item.saved_at,
            notes: item.notes,
          }));
        }
        console.error('Supabase fetch error, using fallback:', error);
      } catch (err) {
        console.error('Supabase catch error, using fallback:', err);
      }
    }

    // LocalStorage Fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tgid_saved_products');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  },

  async saveProduct(product: Accessory, notes: string = ''): Promise<SavedProduct> {
    const newSave: SavedProduct = {
      id: `save-${product.id}-${Date.now()}`,
      product,
      savedAt: new Date().toISOString(),
      notes,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('saved_products')
          .insert({
            product_id: product.id,
            product_data: product,
            notes: notes,
            saved_at: newSave.savedAt,
          })
          .select();

        if (!error && data && data.length > 0) {
          return {
            id: data[0].id,
            product: data[0].product_data as Accessory,
            savedAt: data[0].saved_at,
            notes: data[0].notes,
          };
        }
        console.error('Supabase save error, using fallback:', error);
      } catch (err) {
        console.error('Supabase save catch error, using fallback:', err);
      }
    }

    // LocalStorage Fallback
    if (typeof window !== 'undefined') {
      const current = await this.getSavedProducts();
      // Check if already saved
      const exists = current.find((item) => item.product.id === product.id);
      if (exists) {
        return exists;
      }
      const updated = [newSave, ...current];
      localStorage.setItem('tgid_saved_products', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage')); // Trigger update across pages
      return newSave;
    }
    return newSave;
  },

  async removeSavedProduct(productId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('saved_products')
          .delete()
          .eq('product_id', productId);

        if (!error) return true;
        console.error('Supabase delete error, using fallback:', error);
      } catch (err) {
        console.error('Supabase delete catch error, using fallback:', err);
      }
    }

    // LocalStorage Fallback
    if (typeof window !== 'undefined') {
      const current = await this.getSavedProducts();
      const filtered = current.filter((item) => item.product.id !== productId);
      localStorage.setItem('tgid_saved_products', JSON.stringify(filtered));
      window.dispatchEvent(new Event('storage'));
      return true;
    }
    return false;
  },

  async updateSavedNotes(productId: string, notes: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('saved_products')
          .update({ notes })
          .eq('product_id', productId);

        if (!error) return true;
        console.error('Supabase update error, using fallback:', error);
      } catch (err) {
        console.error('Supabase update catch error, using fallback:', err);
      }
    }

    // LocalStorage Fallback
    if (typeof window !== 'undefined') {
      const current = await this.getSavedProducts();
      const updated = current.map((item) => {
        if (item.product.id === productId) {
          return { ...item, notes };
        }
        return item;
      });
      localStorage.setItem('tgid_saved_products', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      return true;
    }
    return false;
  },

  // --- Search History ---
  async getRecentSearches(): Promise<SearchQuery[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(8);

        if (!error && data) {
          return data.map((item) => ({
            id: item.id,
            query: item.query,
            timestamp: item.timestamp,
            category: item.category,
            budget: item.budget,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }

    // LocalStorage Fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tgid_recent_searches');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  },

  async saveSearch(query: string, category?: string, budget?: number): Promise<SearchQuery> {
    const newSearch: SearchQuery = {
      id: `search-${Date.now()}`,
      query,
      timestamp: new Date().toISOString(),
      category,
      budget,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('search_history').insert({
          query,
          category,
          budget,
          timestamp: newSearch.timestamp,
        });
      } catch (err) {
        console.error(err);
      }
    }

    // LocalStorage Fallback
    if (typeof window !== 'undefined') {
      const current = await this.getRecentSearches();
      // Remove matching query to prevent duplicates
      const filtered = current.filter((item) => item.query.toLowerCase() !== query.toLowerCase());
      const updated = [newSearch, ...filtered].slice(0, 10);
      localStorage.setItem('tgid_recent_searches', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
    return newSearch;
  },
};

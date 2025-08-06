import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../lib/supabase';
import { Manifestation, ManifestationState } from '../types/manifestation';

interface User {
  id: string;
  wallet_address: string;
  name: string | null;
  avatar_url: string | null;
  energy_level: number;
  daily_streak: number;
  total_manifestations: number;
  completed_count: number;
  daily_intent: string | null;
  last_active: string; // Add this missing property
  created_at: string;  // Add this missing property
  updated_at: string;  // Add this for completeness
}

interface ManifestationStore {
  // State
  user: User | null;
  manifestations: Manifestation[];
  dailyIntent: string;
  energyLevel: number;
  isLoading: boolean;
  
  // Actions
  initializeUser: (walletAddress: string) => Promise<void>;
  addManifestation: (title: string, description?: string, emoji?: string) => Promise<void>;
  updateManifestation: (id: string, updates: Partial<Manifestation>) => Promise<void>;
  updateManifestationState: (id: string, state: ManifestationState) => Promise<void>;
  deleteManifestation: (id: string) => Promise<void>;
  setDailyIntent: (intent: string) => Promise<void>;
  updateEnergyLevel: (level: number) => void;
  updateUserStats: () => Promise<void>;
  syncUserData: () => Promise<void>;
  getStats: () => {
    total: number;
    dream: number;
    working: number;
    done: number;
    archived: number;
  };
}

export const useManifestationStore = create<ManifestationStore>((set, get) => ({
  // Initial State
  user: null,
  manifestations: [],
  dailyIntent: '',
  energyLevel: 25,
  isLoading: false,
  
  // Initialize user when wallet connects
  initializeUser: async (walletAddress: string) => {
    set({ isLoading: true });
    
    try {
      // Check if user exists
      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
      
      // Create user if doesn't exist
      if (error && error.code === 'PGRST116') {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            name: `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
            energy_level: 25,
          })
          .select()
          .single();
        
        if (createError) throw createError;
        user = newUser;
      } else if (error) {
        throw error;
      }
      
      // Update last active
      await supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('id', user.id);
      
      // Fetch user's manifestations
      const { data: manifestations, error: manifestationsError } = await supabase
        .from('manifestations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (manifestationsError) throw manifestationsError;
      
      // Convert dates and set state
      const convertedManifestations = manifestations.map(m => ({
        ...m,
        createdAt: new Date(m.created_at),
        updatedAt: new Date(m.updated_at),
      }));
      
      set({
        user,
        manifestations: convertedManifestations,
        dailyIntent: user.daily_intent || '',
        energyLevel: user.energy_level,
        isLoading: false,
      });
      
      // Update stats and energy based on current manifestations
      await get().updateUserStats();
      
    } catch (error) {
      console.error('Error initializing user:', error);
      set({ isLoading: false });
    }
  },
  
  // Add new manifestation
  addManifestation: async (title: string, description?: string, emoji?: string) => {
    const { user } = get();
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manifestations')
        .insert({
          user_id: user.id,
          title,
          description,
          emoji: emoji || '✨',
          state: 'dream',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newManifestation = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      
      set((state) => ({
        manifestations: [newManifestation, ...state.manifestations],
      }));
      
      // Update user stats and energy
      await get().updateUserStats();
      
    } catch (error) {
      console.error('Error adding manifestation:', error);
    }
  },
  
  // Update manifestation
  updateManifestation: async (id: string, updates: Partial<Manifestation>) => {
    try {
      const { data, error } = await supabase
        .from('manifestations')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedManifestation = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      
      set((state) => ({
        manifestations: state.manifestations.map((m) =>
          m.id === id ? updatedManifestation : m
        ),
      }));
      
      // Update user stats if state changed
      if (updates.state) {
        await get().updateUserStats();
      }
      
    } catch (error) {
      console.error('Error updating manifestation:', error);
    }
  },
  
  // Update manifestation state
  updateManifestationState: async (id: string, state: ManifestationState) => {
    await get().updateManifestation(id, { state });
  },
  
  // Delete manifestation
  deleteManifestation: async (id: string) => {
    try {
      const { error } = await supabase
        .from('manifestations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        manifestations: state.manifestations.filter((m) => m.id !== id),
      }));
      
      // Update user stats
      await get().updateUserStats();
      
    } catch (error) {
      console.error('Error deleting manifestation:', error);
    }
  },
  
  // Set daily intent
  setDailyIntent: async (intent: string) => {
    const { user } = get();
    if (!user) return;
    
    try {
      // Update user's daily intent
      await supabase
        .from('users')
        .update({ daily_intent: intent })
        .eq('id', user.id);
      
      // Add to daily intents log
      await supabase
        .from('daily_intents')
        .upsert({
          user_id: user.id,
          intent,
          date: new Date().toISOString().split('T')[0],
        });
      
      set((state) => ({
        dailyIntent: intent,
        user: state.user ? { ...state.user, daily_intent: intent } : null,
      }));
      
      // Update user stats and energy
      await get().updateUserStats();
      
    } catch (error) {
      console.error('Error setting daily intent:', error);
    }
  },

  // Update energy level (for local updates)
  updateEnergyLevel: (level: number) => {
    set({ energyLevel: Math.max(0, Math.min(100, level)) });
  },
  
  // Update user stats and energy based on activity
  updateUserStats: async () => {
    const { user, manifestations } = get();
    if (!user) return;
    
    try {
      const completedCount = manifestations.filter(m => m.state === 'done').length;
      const totalManifestations = manifestations.length;
      
      // Calculate energy level based on activity
      let energyLevel = 25; // Base level for all users
      
      // Add energy for manifestations created
      energyLevel += Math.min(totalManifestations * 3, 30); // +3 per manifestation, max +30
      
      // Add energy for completions (big boost)
      energyLevel += completedCount * 15; // +15 per completion
      
      // Add energy for daily intent (if set today)
      if (user.daily_intent) {
        energyLevel += 8; // +8 for having daily intent
      }
      
      // Add energy for streak (loyalty bonus)
      energyLevel += Math.min(user.daily_streak * 2, 25); // +2 per streak day, max +25
      
      // Add energy for active manifestations (work in progress)
      const workingCount = manifestations.filter(m => m.state === 'working').length;
      energyLevel += workingCount * 5; // +5 per active manifestation
      
      // Cap at 100
      energyLevel = Math.min(energyLevel, 100);
      
      // Calculate daily streak (simplified - in real app you'd check daily activity)
      let dailyStreak = user.daily_streak;
      if (user.daily_intent || totalManifestations > 0) {
        // If user has activity today, maintain or increment streak
        const lastActive = new Date(user.last_active);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          dailyStreak += 1; // Increment streak if last active yesterday
        } else if (daysDiff > 1) {
          dailyStreak = 1; // Reset streak if gap is more than a day
        }
        // If daysDiff === 0, user was active today, maintain streak
      }
      
      // Update user in database
      const { data, error } = await supabase
        .from('users')
        .update({
          total_manifestations: totalManifestations,
          completed_count: completedCount,
          energy_level: energyLevel,
          daily_streak: dailyStreak,
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set({
        user: data,
        energyLevel: data.energy_level,
      });
      
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  },
  
  // Sync user data from database
  syncUserData: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      set({
        user: data,
        energyLevel: data.energy_level,
        dailyIntent: data.daily_intent || '',
      });
      
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  },
  
  // Get stats
  getStats: () => {
    const manifestations = get().manifestations;
    return {
      total: manifestations.length,
      dream: manifestations.filter(m => m.state === 'dream').length,
      working: manifestations.filter(m => m.state === 'working').length,
      done: manifestations.filter(m => m.state === 'done').length,
      archived: manifestations.filter(m => m.state === 'archived').length,
    };
  },
}));
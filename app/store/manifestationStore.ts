import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Manifestation, ManifestationState } from '../types/manifestation';

interface ManifestationStore {
  manifestations: Manifestation[];
  dailyIntent: string;
  energyLevel: number;
  
  // Actions
  addManifestation: (title: string, description?: string, emoji?: string) => void;
  updateManifestationState: (id: string, state: ManifestationState) => void;
  deleteManifestation: (id: string) => void;
  setDailyIntent: (intent: string) => void;
  updateEnergyLevel: (level: number) => void;
  getStats: () => {
    total: number;
    dream: number;
    working: number;
    done: number;
    archived: number;
  };
}

export const useManifestationStore = create<ManifestationStore>()(
  persist(
    (set, get) => ({
      manifestations: [],
      dailyIntent: '',
      energyLevel: 75,
      
      addManifestation: (title, description, emoji) =>
        set((state) => ({
          manifestations: [
            ...state.manifestations,
            {
              id: crypto.randomUUID(),
              title,
              description,
              emoji: emoji || '✨',
              state: 'dream',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
        
      updateManifestationState: (id, newState) =>
        set((state) => ({
          manifestations: state.manifestations.map((m) =>
            m.id === id ? { ...m, state: newState, updatedAt: new Date() } : m
          ),
        })),
        
      deleteManifestation: (id) =>
        set((state) => ({
          manifestations: state.manifestations.filter((m) => m.id !== id),
        })),
        
      setDailyIntent: (intent) => set({ dailyIntent: intent }),
      
      updateEnergyLevel: (level) => set({ energyLevel: level }),
      
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
    }),
    {
      name: 'manifestation-storage',
    }
  )
);
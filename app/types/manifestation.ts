export type ManifestationState = 'dream' | 'working' | 'done' | 'archived';

export interface Manifestation {
  id: string;
  title: string;
  description?: string;
  state: ManifestationState;
  createdAt: Date;
  updatedAt: Date;
  emoji?: string;
}

export interface DailyStats {
  totalManifestations: number;
  completedToday: number;
  energyLevel: number; // 0-100
  streak: number;
}
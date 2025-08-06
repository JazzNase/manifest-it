export type ManifestationState = 'dream' | 'working' | 'done' | 'archived';

export interface Manifestation {
  id: string;
  user_id?: string; // Add this for Supabase
  title: string;
  description?: string;
  emoji?: string;
  state: ManifestationState;
  is_public?: boolean; // Add this for community features
  category?: string;
  tags?: string[];
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
  created_at?: string; // Supabase format
  updated_at?: string; // Supabase format
}

export interface DailyStats {
  totalManifestations: number;
  completedToday: number;
  energyLevel: number; // 0-100
  streak: number;
}
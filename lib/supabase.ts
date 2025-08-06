import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          name: string | null
          avatar_url: string | null
          energy_level: number
          daily_streak: number
          total_manifestations: number
          completed_count: number
          last_active: string
          daily_intent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          name?: string | null
          avatar_url?: string | null
          energy_level?: number
          daily_streak?: number
          total_manifestations?: number
          completed_count?: number
          last_active?: string
          daily_intent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          name?: string | null
          avatar_url?: string | null
          energy_level?: number
          daily_streak?: number
          total_manifestations?: number
          completed_count?: number
          last_active?: string
          daily_intent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      manifestations: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          emoji: string
          state: 'dream' | 'working' | 'done' | 'archived'
          is_public: boolean
          category: string | null
          tags: string[] | null
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          emoji?: string
          state?: 'dream' | 'working' | 'done' | 'archived'
          is_public?: boolean
          category?: string | null
          tags?: string[] | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          emoji?: string
          state?: 'dream' | 'working' | 'done' | 'archived'
          is_public?: boolean
          category?: string | null
          tags?: string[] | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_intents: {
        Row: {
          id: string
          user_id: string
          intent: string
          date: string
          energy_boost: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          intent: string
          date: string
          energy_boost?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          intent?: string
          date?: string
          energy_boost?: number
          created_at?: string
        }
      }
      community_interactions: {
        Row: {
          id: string
          user_id: string
          manifestation_id: string
          type: 'like' | 'support' | 'comment'
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          manifestation_id: string
          type: 'like' | 'support' | 'comment'
          content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          manifestation_id?: string
          type?: 'like' | 'support' | 'comment'
          content?: string | null
          created_at?: string
        }
      }
    }
  }
}
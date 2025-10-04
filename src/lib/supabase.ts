import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Supabase client configuration
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Connection test
export const testConnection = async () => {
  if (!supabase) {
    return false;
  }
  
  try {
    const { error } = await supabase.auth.getSession();
    if (error && !error.message.includes('session_not_found')) {
      return false;
    }
    return true;
  } catch (error: any) {
    return false;
  }
};

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          movie_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
          likes: number
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
          likes?: number
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
          likes?: number
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          movie_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: string
          created_at?: string
        }
      }
    }
  }
}
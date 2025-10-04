import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Configuration Check:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.log('Expected variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

// Simple Supabase client configuration
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

if (supabase) {
  console.log('✅ Supabase client initialized successfully');
} else {
  console.error('❌ Supabase client initialization failed');
}

// Simple connection test
export const testConnection = async () => {
  if (!supabase) {
    console.error('❌ Cannot test connection - Supabase client not initialized');
    return false;
  }
  
  try {
    console.log('🔍 Testing Supabase connection...');
    const { error } = await supabase.auth.getSession();
    if (error && !error.message.includes('session_not_found')) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error: any) {
    console.error('❌ Connection test error:', error.message);
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
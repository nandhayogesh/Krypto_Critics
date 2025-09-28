// Simple Supabase connection test
import { supabase } from './supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test auth connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase auth error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log('📍 Current session:', data.session ? 'Active session found' : 'No active session');
    
    return true;
  } catch (err: any) {
    console.error('💥 Supabase connection failed:', err.message);
    
    if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
      console.error('🌐 Network issue - check your internet connection');
    }
    
    return false;
  }
};

// Test signin function
export const testSignIn = async (email: string, password: string) => {
  try {
    console.log('🔐 Testing signin for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('📨 Signin result:', {
      user: data.user ? `${data.user.email} (confirmed: ${data.user.email_confirmed_at ? 'YES' : 'NO'})` : 'None',
      session: data.session ? 'Active' : 'None',
      error: error ? error.message : 'None'
    });
    
    return { data, error };
  } catch (err: any) {
    console.error('💥 Signin test failed:', err.message);
    return { data: null, error: err };
  }
};
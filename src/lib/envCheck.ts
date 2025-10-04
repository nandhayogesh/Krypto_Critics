// Environment variable checker
console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set ✅' : 'Missing ❌');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? `Set ✅ (length: ${import.meta.env.VITE_SUPABASE_ANON_KEY.length})` : 'Missing ❌');

if (import.meta.env.VITE_SUPABASE_URL) {
  console.log('URL Value:', import.meta.env.VITE_SUPABASE_URL);
}

// Test if the environment variables are loaded correctly
export const envCheck = {
  hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  url: import.meta.env.VITE_SUPABASE_URL,
  keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
};
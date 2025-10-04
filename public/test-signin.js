// Quick Supabase signin test
const testSignin = async () => {
  console.log('🧪 Testing signin with your credentials...');
  
  // Test with environment variables
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Environment check:');
  console.log('URL:', url ? '✅ Present' : '❌ Missing');
  console.log('Key:', key ? '✅ Present' : '❌ Missing');
  
  if (!url || !key) {
    console.error('❌ Environment variables not loaded');
    return;
  }
  
  // Import and use supabase client
  const { supabase } = await import('./src/lib/supabase.js');
  
  if (!supabase) {
    console.error('❌ Supabase client not initialized');
    return;
  }
  
  console.log('✅ Supabase client ready');
  
  // Test connection
  try {
    const { error: sessionError } = await supabase.auth.getSession();
    if (sessionError && !sessionError.message.includes('session_not_found')) {
      console.error('❌ Connection error:', sessionError.message);
      return;
    }
    console.log('✅ Connection test passed');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return;
  }
  
  // Prompt for credentials
  const email = prompt('Enter your email:');
  const password = prompt('Enter your password:');
  
  if (!email || !password) {
    console.log('❌ Email and password required');
    return;
  }
  
  console.log('🔐 Testing signin for:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('📨 Response received:');
    console.log('User:', data?.user ? '✅ Present' : '❌ None');
    console.log('Session:', data?.session ? '✅ Active' : '❌ None');
    console.log('Error:', error ? `❌ ${error.message}` : '✅ None');
    
    if (error) {
      console.error('❌ Signin failed:', error.message);
    } else if (data.user && data.session) {
      console.log('🎉 Signin successful!');
    } else if (data.user && !data.session) {
      console.log('📧 User exists but needs email confirmation');
    }
    
  } catch (err) {
    console.error('❌ Signin error:', err.message);
  }
};

// Add button to page for testing
const button = document.createElement('button');
button.textContent = '🧪 Test Signin';
button.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;';
button.onclick = testSignin;
document.body.appendChild(button);

console.log('🧪 Test button added to page - click to test signin');
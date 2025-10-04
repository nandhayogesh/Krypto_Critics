import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrwaabpwnzhixhkmdwqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd2FhYnB3bnpoaXhoa21kd3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDMxODEsImV4cCI6MjA3NDYxOTE4MX0.IQHOnBnlR5F_kL00SMIpDIfEZTYEsUkxa--LvNvmSJQ';

console.log('🔗 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('📡 Testing auth...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error && !error.message.includes('session_not_found')) {
      console.error('❌ Auth error:', error);
      return false;
    }
    
    console.log('✅ Auth test passed');
    
    // Test database connection
    console.log('🗄️ Testing database...');
    const { data: dbData, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (dbError) {
      console.error('❌ Database error:', dbError);
      return false;
    }
    
    console.log('✅ Database test passed');
    return true;
  } catch (error) {
    console.error('💥 Connection failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('🎉 All tests passed! Supabase is working correctly.');
  } else {
    console.log('❌ Tests failed. Check your Supabase configuration.');
  }
  process.exit(success ? 0 : 1);
});
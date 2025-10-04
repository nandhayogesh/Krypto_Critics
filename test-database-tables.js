import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrwaabpwnzhixhkmdwqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd2FhYnB3bnpoaXhoa21kd3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDMxODEsImV4cCI6MjA3NDYxOTE4MX0.IQHOnBnlR5F_kL00SMIpDIfEZTYEsUkxa--LvNvmSJQ';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Testing database tables...');

async function testTables() {
  try {
    // Test profiles table
    console.log('📋 Testing profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message);
    } else {
      console.log('✅ Profiles table exists');
    }

    // Test reviews table
    console.log('📝 Testing reviews table...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('count')
      .limit(1);
    
    if (reviewsError) {
      console.error('❌ Reviews table error:', reviewsError.message);
    } else {
      console.log('✅ Reviews table exists');
    }

    // Test watchlist table
    console.log('💖 Testing watchlist table...');
    const { data: watchlist, error: watchlistError } = await supabase
      .from('watchlist')
      .select('count')
      .limit(1);
    
    if (watchlistError) {
      console.error('❌ Watchlist table error:', watchlistError.message);
    } else {
      console.log('✅ Watchlist table exists');
    }

    if (!profilesError && !reviewsError && !watchlistError) {
      console.log('🎉 All tables exist! Database is ready.');
    } else {
      console.log('⚠️ Some tables are missing. Please run the QUICK_SETUP.sql script.');
    }

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

testTables();
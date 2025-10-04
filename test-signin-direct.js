// Direct Supabase signin test
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 SIGNIN DIAGNOSTICS STARTING...\n');

// Test 1: Environment Variables
console.log('1. Environment Variables Check:');
console.log(`   URL: ${supabaseUrl ? '✅ ' + supabaseUrl : '❌ Missing'}`);
console.log(`   Key: ${supabaseAnonKey ? '✅ ' + supabaseAnonKey.substring(0, 20) + '...' : '❌ Missing'}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Environment variables missing!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

console.log('2. Supabase Client Created ✅\n');

async function testSigninDirect() {
  try {
    // Test 3: Basic connection
    console.log('3. Testing Basic Connection...');
    const { error: connectionError } = await supabase.auth.getSession();
    if (connectionError && !connectionError.message.includes('session_not_found')) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    console.log('   ✅ Basic connection successful\n');

    // Test 4: Check if user exists
    console.log('4. Testing User Lookup...');
    
    // You need to replace this with your actual email
    const testEmail = 'your-registered-email@example.com'; // REPLACE WITH YOUR EMAIL
    const testPassword = 'your-password'; // REPLACE WITH YOUR PASSWORD
    
    console.log('⚠️  IMPORTANT: Edit this file and replace the email/password above with your actual credentials');
    console.log(`   Testing with: ${testEmail}\n`);
    
    if (testEmail === 'your-registered-email@example.com') {
      console.log('❌ Please edit test-signin-direct.js and add your real email/password');
      console.log('   Lines 33-34: Replace with your actual credentials');
      return;
    }

    // Test 5: Actual signin attempt
    console.log('5. Testing Signin...');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${'*'.repeat(testPassword.length)} (${testPassword.length} chars)`);
    
    const startTime = Date.now();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`   Response time: ${responseTime}ms\n`);

    // Analyze response
    console.log('6. Response Analysis:');
    console.log(`   User object: ${data?.user ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Session object: ${data?.session ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Error: ${error ? `❌ ${error.message}` : '✅ None'}`);
    
    if (data?.user) {
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   User email: ${data.user.email}`);
      console.log(`   Email confirmed: ${data.user.email_confirmed_at ? '✅ Yes' : '❌ No'}`);
      console.log(`   User created: ${data.user.created_at}`);
    }
    
    if (data?.session) {
      console.log(`   Session access token: ${data.session.access_token ? '✅ Present' : '❌ Missing'}`);
      console.log(`   Session expires: ${data.session.expires_at ? new Date(data.session.expires_at * 1000) : 'Unknown'}`);
    }

    if (error) {
      console.log('\n❌ SIGNIN FAILED:');
      console.log(`   Error code: ${error.status || 'Unknown'}`);
      console.log(`   Error message: ${error.message}`);
      console.log(`   Error name: ${error.name || 'Unknown'}`);
      
      // Specific troubleshooting
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n🔧 TROUBLESHOOTING:');
        console.log('   - Double-check your email address (case sensitive)');
        console.log('   - Verify your password (case sensitive)');
        console.log('   - Make sure you created the account successfully');
      } else if (error.message.includes('Email not confirmed')) {
        console.log('\n🔧 TROUBLESHOOTING:');
        console.log('   - Check your email inbox for confirmation email');
        console.log('   - Click the confirmation link');
        console.log('   - Check spam folder');
      }
    } else if (data?.user && data?.session) {
      console.log('\n🎉 SIGNIN SUCCESSFUL!');
      console.log('   Your Supabase authentication is working correctly.');
      console.log('   The issue might be in the React app, not Supabase itself.');
    } else if (data?.user && !data?.session) {
      console.log('\n⚠️  USER FOUND BUT NO SESSION:');
      console.log('   This usually means email confirmation is required.');
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.log('\n🔧 Possible issues:');
    console.log('   - Internet connection problems');
    console.log('   - Supabase service temporarily down');
    console.log('   - Incorrect environment variables');
    console.log('   - Firewall blocking the connection');
  }
}

// Test 7: Quick auth settings check
async function checkAuthSettings() {
  console.log('\n7. Auth Settings Check:');
  try {
    // This will show current auth config
    const { data: { user } } = await supabase.auth.getUser();
    console.log('   Current user session:', user ? 'Active session found' : 'No active session');
  } catch (error) {
    console.log('   Session check failed:', error.message);
  }
}

// Run all tests
console.log('Starting comprehensive signin test...\n');
testSigninDirect().then(() => {
  return checkAuthSettings();
}).then(() => {
  console.log('\n✅ DIAGNOSIS COMPLETE');
  console.log('\nNext steps:');
  console.log('1. Edit this file with your real credentials');
  console.log('2. Run: node test-signin-direct.js');
  console.log('3. Share the results to get specific help');
});
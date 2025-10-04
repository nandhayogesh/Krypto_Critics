import { supabase } from './src/lib/supabase.js';

console.log('🧪 Testing Auth Flow...');

const testLogin = async () => {
  const testEmail = 'test@example.com';
  const testPassword = 'testpass123';

  try {
    console.log('1️⃣ Testing signup...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User'
        }
      }
    });

    if (signUpError) {
      console.log('❌ Signup error:', signUpError.message);
    } else {
      console.log('✅ Signup successful:', {
        user: signUpData.user ? 'Created' : 'None',
        session: signUpData.session ? 'Active' : 'None'
      });
    }

    console.log('2️⃣ Testing signin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      console.log('❌ Signin error:', signInError.message);
    } else {
      console.log('✅ Signin successful:', {
        user: signInData.user ? signInData.user.email : 'None',
        session: signInData.session ? 'Active' : 'None'
      });
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testLogin();
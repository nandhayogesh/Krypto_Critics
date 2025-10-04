import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Lock, User, AlertCircle, Film } from 'lucide-react';

// Direct Supabase signin test function
const testDirectSignin = async (email: string, password: string) => {
  console.log('🧪 DIRECT SUPABASE TEST STARTING...');
  console.log('📧 Email:', email);
  console.log('🔒 Password length:', password.length);
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  if (!supabase) {
    console.error('❌ Supabase client not available');
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    console.log('🔍 Testing basic connection...');
    const { error: connectionError } = await supabase.auth.getSession();
    if (connectionError && !connectionError.message.includes('session_not_found')) {
      console.error('❌ Connection test failed:', connectionError.message);
      return { success: false, error: `Connection failed: ${connectionError.message}` };
    }
    console.log('✅ Connection test passed');
    
    console.log('🔐 Attempting direct signin...');
    const startTime = performance.now();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    console.log(`⏱️ Response time: ${responseTime}ms`);
    console.log('📦 Response data:', {
      user: data?.user ? 'Present ✅' : 'Missing ❌',
      session: data?.session ? 'Present ✅' : 'Missing ❌',
      error: error ? `Present ❌: ${error.message}` : 'None ✅'
    });
    
    if (error) {
      console.error('❌ Signin error:', error.message);
      console.error('❌ Error details:', error);
      return { success: false, error: error.message, responseTime };
    }
    
    if (data?.user && data?.session) {
      console.log('🎉 DIRECT SIGNIN SUCCESSFUL!');
      console.log('👤 User email confirmed:', data.user.email_confirmed_at ? 'Yes ✅' : 'No ❌');
      return { success: true, user: data.user, session: data.session, responseTime };
    }
    
    if (data?.user && !data?.session) {
      console.log('⚠️ User found but no session (email confirmation needed)');
      return { success: false, error: 'Email confirmation required', responseTime };
    }
    
    console.log('❌ Unexpected response - no user or session');
    return { success: false, error: 'Unexpected response format', responseTime };
    
  } catch (err: any) {
    console.error('❌ Direct signin test failed:', err);
    return { success: false, error: err.message || 'Network error' };
  }
};


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  // Sign in form
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  // Sign up form
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
  });

  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add debugging
    console.log('🔐 Sign In Attempt:', {
      email: signInData.email,
      hasPassword: !!signInData.password,
      passwordLength: signInData.password.length,
      timestamp: new Date().toISOString(),
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set ✅' : 'Missing ❌',
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌'
    });

    try {
      console.log('🔐 Starting signin process...');
      await signIn(signInData.email, signInData.password);
      
      console.log('✅ Signin successful, closing modal...');
      // Only close modal and reset form on successful signin
      onClose();
      setSignInData({ email: '', password: '' });
      setError(null);
    } catch (err: any) {
      console.error('❌ Signin failed:', err);
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (err?.message) {
        if (err.message.includes('Connection timeout') || err.message.includes('timeout')) {
          errorMessage = 'Connection timeout. Please check your internet connection and try again.';
        } else if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials or switch to Sign Up if you need to create an account.';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before signing in.';
        } else if (err.message.includes('service unavailable')) {
          errorMessage = 'Authentication service temporarily unavailable. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.email || !signUpData.password || !signUpData.username || !signUpData.firstName || !signUpData.lastName) {
      setError('Please fill in all fields');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signUp(signUpData.email, signUpData.password, {
        username: signUpData.username,
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
      });
      
      // Show confirmation message instead of closing modal
      setEmailSent(true);
      setError(null);
      
      // Reset form
      setSignUpData({
        email: '',
        password: '',
        username: '',
        firstName: '',
        lastName: '',
      });
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setEmailSent(false);
    setSignInData({ email: '', password: '' });
    setSignUpData({
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="h-6 w-6 text-yellow-500" />
            <DialogTitle className="text-slate-100 font-bold text-xl">KryptoCritics</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Join the ultimate movie critics community
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as 'signin' | 'signup'); setError(null); setEmailSent(false); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="font-medium">
              ⭐ Create Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            {/* Helpful hint for new users */}
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-200 font-medium">New to KryptoCritics?</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Switch to the "Sign Up" tab above to create your account first, then return here to sign in.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="john@example.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              {/* Temporary test button */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={async () => {
                  setIsLoading(true);
                  setError(null);
                  try {
                    if (!signInData.email || !signInData.password) {
                      setError('❌ Please enter email and password first');
                      return;
                    }
                    
                    console.log('🧪 Starting direct Supabase test...');
                    const result = await testDirectSignin(signInData.email, signInData.password);
                    
                    if (result.success) {
                      setError(`✅ DIRECT TEST SUCCESSFUL! Response time: ${result.responseTime}ms`);
                      console.log('🎉 Direct test passed - the issue is in the React auth flow');
                    } else {
                      setError(`❌ DIRECT TEST FAILED: ${result.error}${result.responseTime ? ` (${result.responseTime}ms)` : ''}`);
                      console.log('❌ Direct test failed - issue is with Supabase auth');
                    }
                    
                  } catch (err: any) {
                    console.error('❌ Test error:', err);
                    setError('❌ Test error: ' + (err.message || 'Unknown error'));
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                🧪 Test Direct Supabase
              </Button>
              
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full" 
                onClick={async () => {
                  setIsLoading(true);
                  setError(null);
                  try {
                    if (!signInData.email || !signInData.password) {
                      setError('❌ Please enter email and password first');
                      return;
                    }
                    
                    console.log('🧪 Testing via React Auth Context...');
                    await signIn(signInData.email, signInData.password);
                    setError('✅ REACT AUTH TEST SUCCESSFUL!');
                    console.log('✅ React auth test passed');
                  } catch (err: any) {
                    console.error('❌ React auth test failed:', err);
                    setError('❌ REACT AUTH FAILED: ' + (err.message || 'Unknown error'));
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                🧪 Test React Auth
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-firstname">First Name</Label>
                  <Input
                    id="signup-firstname"
                    type="text"
                    placeholder="John"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastname">Last Name</Label>
                  <Input
                    id="signup-lastname"
                    type="text"
                    placeholder="Doe"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="johndoe"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="john@example.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            
            {emailSent && (
              <Alert className="mt-4">
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Please check your email to confirm your account. Check your spam folder if you don't see it.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
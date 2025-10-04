import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, testConnection } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  signUp: (email: string, password: string, userData: { username: string; firstName: string; lastName: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session with error handling
    const initAuth = async () => {
      try {
        console.log('🚀 Initializing authentication...');
        
        // Test connection first
        if (!supabase) {
          console.warn('⚠️ Supabase client not available');
          setIsLoading(false);
          return;
        }

        const connectionOk = await testConnection();
        if (!connectionOk) {
          console.warn('⚠️ Supabase connection failed, auth unavailable');
          setIsLoading(false);
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error && !error.message.includes('session_not_found')) {
          console.error('Auth initialization error:', error);
          throw error;
        }
        
        console.log('📍 Initial session:', session ? 'Found active session' : 'No active session');
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          console.log('👤 Fetching profile for user:', session.user.email);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Continue without auth if Supabase is not available
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes with error handling
    let subscription: any;
    if (supabase) {
      try {
        const {
          data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔄 Auth state change:', event, session ? 'Session active' : 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('👤 Updating profile for user:', session.user.email);
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
          
          setIsLoading(false);
        });
        subscription = authSubscription;
      } catch (error) {
        console.error('Failed to set up auth listener:', error);
        setIsLoading(false);
      }
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: { username: string; firstName: string; lastName: string }) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error('Authentication service unavailable. Please check your connection.');
      }
      
      console.log('🆕 Attempting signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
          emailRedirectTo: window.location.origin
        },
      });

      console.log('📝 Signup response:', { 
        user: data?.user ? `${data.user.email}` : 'None',
        session: data?.session ? 'Active' : 'None',
        error: error ? error.message : 'None'
      });

      if (error) {
        console.error('❌ Signup error:', error);
        
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          throw new Error('An account with this email already exists. Please try signing in instead.');
        }
        if (error.message.includes('Password should be')) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        }
        
        throw new Error(`Sign up failed: ${error.message}`);
      }

      if (data.user) {
        if (data.session) {
          // User created and immediately signed in
          console.log('✅ Signup successful with immediate signin!');
          toast({
            title: "Welcome!",
            description: "Account created successfully! You are now signed in.",
          });
        } else {
          // User created but needs email confirmation
          console.log('📧 Signup successful, email confirmation required');
          toast({
            title: "Account created!",
            description: "Please check your email and click the confirmation link to complete setup.",
          });
        }
        return;
      }
      
      throw new Error('Account creation failed. Please try again.');
      
    } catch (error) {
      const authError = error as AuthError;
      console.error('❌ Signup error:', authError);
      
      toast({
        title: "Sign up failed",
        description: authError.message || 'Failed to create account',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      console.error('❌ Signin timeout - taking too long');
    }, 15000); // 15 second timeout
    
    try {
      if (!supabase) {
        throw new Error('Authentication service unavailable. Please check your connection.');
      }
      
      console.log('🔐 Attempting signin for:', email);
      console.log('🔧 Current timestamp:', new Date().toISOString());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('📨 Signin response:', { 
        user: data?.user ? `${data.user.email}` : 'None',
        session: data?.session ? 'Active' : 'None',
        error: error ? error.message : 'None',
        timestamp: new Date().toISOString()
      });

      if (error) {
        console.error('❌ Signin error details:', error);
        console.error('❌ Error code:', error.status);
        console.error('❌ Error name:', error.name);
        
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        }
        if (error.message.includes('signup_disabled')) {
          throw new Error('Sign up is currently disabled. Please try again later.');
        }
        if (error.message.includes('rate limit') || error.message.includes('rate_limit_exceeded')) {
          throw new Error('Too many attempts. Please wait a few minutes before trying again.');
        }
        if (error.message.includes('User not found') || error.message.includes('user_not_found')) {
          throw new Error('No account found with this email. Please create an account first.');
        }
        
        // Generic error message for other cases
        throw new Error(`Sign in failed: ${error.message}`);
      }

      if (data.user && data.session) {
        console.log('✅ Signin successful!');
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        return;
      }
      
      if (data.user && !data.session) {
        throw new Error('Please confirm your email before signing in.');
      }
      
      throw new Error('Sign in failed. Please try again.');
      
    } catch (error: any) {
      console.error('❌ Signin error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
      throw error;
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Explicitly clear state
      setUser(null);
      setProfile(null);
      setSession(null);

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Sign out failed",
        description: authError.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile
      await fetchProfile(user.id);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    profile,
    session,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

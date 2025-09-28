import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
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
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
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
    try {
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });

      if (error) throw error;

      console.log('Signup response:', { data, error }); // Debug logging

      if (data.user && !data.session) {
        // User created but needs email confirmation
        toast({
          title: "Account created!",
          description: "Please check your email (including spam folder) to verify your account.",
        });
      } else if (data.user && data.session) {
        // User created and immediately signed in (email confirmation disabled)
        toast({
          title: "Welcome!",
          description: "Account created successfully!",
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Signup error:', authError); // Debug logging
      
      toast({
        title: "Sign up failed",
        description: authError.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Add timeout to prevent hanging
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout - please check your internet connection and try again')), 10000)
      );
      
      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;

      if (error) {
        // Handle network/connection errors
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          throw new Error('Connection failed. Please check your internet connection and try again.');
        }
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        }
        if (error.message.includes('signup_disabled')) {
          throw new Error('Sign up is currently disabled. Please try again later.');
        }
        throw new Error(error.message || 'Sign in failed. Please try again.');
      }

      if (data.user && data.session) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      } else if (data.user && !data.session) {
        throw new Error('Please confirm your email before signing in.');
      } else {
        throw new Error('Sign in failed. Please try again.');
      }
    } catch (error: any) {
      // Don't show toast here, let the component handle it
      throw error;
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

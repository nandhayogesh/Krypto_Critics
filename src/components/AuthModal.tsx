import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { testSupabaseConnection, testSignIn } from '@/lib/debugAuth';
import { Loader2, Mail, Lock, User, AlertCircle, Film, Bug } from 'lucide-react';


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

  const handleDebugTest = async () => {
    setIsLoading(true);
    setError(null);

    // Test connection first
    const connectionOk = await testSupabaseConnection();
    
    if (!connectionOk) {
      setError('❌ Supabase connection failed. Check console for details.');
      setIsLoading(false);
      return;
    }

    if (signInData.email && signInData.password) {
      // Test signin
      const result = await testSignIn(signInData.email, signInData.password);
      
      if (result.error) {
        setError(`❌ Signin test failed: ${result.error.message}`);
      } else {
        setError(`✅ Signin test successful! Check console for details.`);
      }
    } else {
      setError('✅ Connection OK. Enter email/password to test signin.');
    }
    
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signIn(signInData.email, signInData.password);
      
      // Only close modal and reset form on successful signin
      onClose();
      setSignInData({ email: '', password: '' });
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
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
            <Film className="h-6 w-6 text-primary" />
            <DialogTitle>Film Folio</DialogTitle>
          </div>
          <DialogDescription>
            Sign in to rate movies and write reviews
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
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
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleDebugTest}
                disabled={isLoading}
              >
                <Bug className="mr-2 h-4 w-4" />
                Debug Test
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
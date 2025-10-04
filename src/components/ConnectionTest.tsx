import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, testConnection } from '@/lib/supabase';
import { testSupabaseConnection } from '@/lib/debugAuth';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';

export function ConnectionTest() {
  const [status, setStatus] = useState<{
    envVars: boolean;
    client: boolean;
    connection: boolean;
    testing: boolean;
    message: string;
  }>({
    envVars: false,
    client: false,
    connection: false,
    testing: false,
    message: ''
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, testing: true, message: 'Testing connection...' }));
    
    // Check environment variables
    const hasEnvVars = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Check client initialization
    const hasClient = !!supabase;
    
    // Test actual connection
    let hasConnection = false;
    try {
      hasConnection = await testConnection();
    } catch (error) {
      console.error('Connection test error:', error);
    }
    
    let message = '';
    if (!hasEnvVars) {
      message = 'Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY';
    } else if (!hasClient) {
      message = 'Supabase client failed to initialize';
    } else if (!hasConnection) {
      message = 'Cannot connect to Supabase - check your internet connection';
    } else {
      message = 'All systems operational!';
    }
    
    setStatus({
      envVars: hasEnvVars,
      client: hasClient,
      connection: hasConnection,
      testing: false,
      message
    });
  };

  const runFullTest = async () => {
    setStatus(prev => ({ ...prev, testing: true, message: 'Running full diagnostic...' }));
    
    console.log('=== SUPABASE CONNECTION DIAGNOSTIC ===');
    console.log('Environment Variables:');
    console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
    console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (length: ' + import.meta.env.VITE_SUPABASE_ANON_KEY.length + ')' : 'Missing');
    console.log('Supabase Client:', supabase ? 'Initialized' : 'Not initialized');
    
    await testSupabaseConnection();
    await checkConnection();
  };

  const StatusIcon = ({ condition }: { condition: boolean }) => 
    condition ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Connection Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Environment Variables</span>
            <StatusIcon condition={status.envVars} />
          </div>
          <div className="flex items-center justify-between">
            <span>Supabase Client</span>
            <StatusIcon condition={status.client} />
          </div>
          <div className="flex items-center justify-between">
            <span>Database Connection</span>
            <StatusIcon condition={status.connection} />
          </div>
        </div>
        
        <Alert variant={status.connection ? "default" : "destructive"}>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Badge variant={status.connection ? "default" : "destructive"}>
            Status: {status.connection ? 'ONLINE' : 'OFFLINE'}
          </Badge>
          
          <div className="flex gap-2">
            <Button 
              onClick={checkConnection} 
              disabled={status.testing}
              size="sm"
              variant="outline"
            >
              {status.testing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Quick Test'}
            </Button>
            <Button 
              onClick={runFullTest} 
              disabled={status.testing}
              size="sm"
            >
              {status.testing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Full Diagnostic'}
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Check browser console for detailed logs
        </div>
      </CardContent>
    </Card>
  );
}
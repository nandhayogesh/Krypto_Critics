import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Users, Database, Wifi } from 'lucide-react';
import { supabase, testConnection } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SystemHealthProps {
  className?: string;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ className = '' }) => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<any>(null);
  const { user, isAuthenticated } = useAuth();

  const runConnectionTest = async () => {
    setIsTestingConnection(true);
    try {
      const result = await testConnection();
      setConnectionStatus('success');
      setTestResults(result);
    } catch (error) {
      setConnectionStatus('error');
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const createTestUser = async () => {
    try {
      const testEmail = `test.${Date.now()}@filmfolio.app`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpass123',
        options: {
          data: {
            username: `testuser${Date.now()}`,
            first_name: 'Test',
            last_name: 'User'
          }
        }
      });

      if (error) throw error;
      
      alert(`✅ Test user created: ${testEmail}\nPassword: testpass123\n\nCheck your email for confirmation link!`);
    } catch (error: any) {
      alert(`❌ Failed to create test user: ${error.message}`);
    }
  };

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          System Health Dashboard
        </CardTitle>
        <CardDescription>
          Monitor authentication and database connectivity
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Authentication Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="font-medium">Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Signed In
                </Badge>
                <span className="text-sm text-gray-600">
                  {user?.email}
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Not Signed In
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Database Connection */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span className="font-medium">Database Connection</span>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus === 'success' && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </>
            )}
            {connectionStatus === 'error' && (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Error
                </Badge>
              </>
            )}
            {connectionStatus === 'idle' && (
              <>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <Badge variant="outline">
                  Not Tested
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={runConnectionTest}
            disabled={isTestingConnection}
            variant="outline"
            size="sm"
          >
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
          
          <Button 
            onClick={createTestUser}
            variant="outline"
            size="sm"
          >
            Create Test User
          </Button>
        </div>

        {/* Usage Instructions */}
        {!isAuthenticated && (
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-800 mb-1">Need to create an account?</h4>
            <p className="text-sm text-blue-700">
              Click "Sign In" → "Sign Up" tab → Fill details → Check email for confirmation → Sign in
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { fallbackReviewService } from '@/lib/fallbackService';
import { supabase, testConnection } from '@/lib/supabase';

export function OfflineIndicator() {
  const [status, setStatus] = useState<{
    isOffline: boolean;
    reason: string;
  }>({
    isOffline: false,
    reason: ''
  });

  useEffect(() => {
    const checkOfflineStatus = async () => {
      // Check if we're in fallback mode
      const inFallbackMode = fallbackReviewService.isOfflineMode();
      
      if (!inFallbackMode) {
        setStatus({ isOffline: false, reason: '' });
        return;
      }

      // If in fallback mode, determine the reason
      if (!supabase) {
        setStatus({ 
          isOffline: true, 
          reason: 'Database configuration unavailable. Check environment settings.' 
        });
        return;
      }

      try {
        const connectionOk = await testConnection();
        if (!connectionOk) {
          setStatus({ 
            isOffline: true, 
            reason: 'Cannot connect to database. Check your internet connection.' 
          });
        } else {
          // Connection is OK but we're still in offline mode for some reason
          setStatus({ 
            isOffline: true, 
            reason: 'Database temporarily unavailable. Your data will be stored locally.' 
          });
        }
      } catch (error) {
        setStatus({ 
          isOffline: true, 
          reason: 'Database connection error. Running in offline mode.' 
        });
      }
    };

    // Check initial status
    checkOfflineStatus();

    // Check periodically (less frequently to avoid spam)
    const interval = setInterval(checkOfflineStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!status.isOffline) return null;

  return (
    <Alert className="mb-4 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
      <WifiOff className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertDescription className="text-orange-800 dark:text-orange-200">
        <strong>Offline Mode:</strong> {status.reason}
      </AlertDescription>
    </Alert>
  );
}
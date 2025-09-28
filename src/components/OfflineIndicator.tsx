import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';
import { fallbackReviewService } from '@/lib/fallbackService';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkOfflineStatus = () => {
      setIsOffline(fallbackReviewService.isOfflineMode());
    };

    // Check initial status
    checkOfflineStatus();

    // Check periodically
    const interval = setInterval(checkOfflineStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isOffline) return null;

  return (
    <Alert className="mb-4 bg-orange-50 border-orange-200">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        Database connection unavailable. Running in offline mode. Your reviews will be stored locally.
      </AlertDescription>
    </Alert>
  );
}
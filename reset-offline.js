import { fallbackReviewService } from './src/lib/fallbackService.js';

console.log('🔄 Resetting offline mode...');
fallbackReviewService.setOfflineMode(false);
console.log('✅ Offline mode reset');
console.log('Current offline status:', fallbackReviewService.isOfflineMode());
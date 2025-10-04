// Fallback service when Supabase is not available
import { Review } from '@/types/movie';

let offlineMode = false; // Start in online mode by default
let reviews: Review[] = [];

export const fallbackReviewService = {
  setOfflineMode(isOffline: boolean) {
    if (isOffline !== offlineMode) {
      console.log(`🔄 Offline mode changed: ${offlineMode} -> ${isOffline}`);
      offlineMode = isOffline;
    }
  },

  isOfflineMode() {
    return offlineMode;
  },

  // Store reviews in memory when offline
  async getMovieReviews(movieId: string): Promise<Review[]> {
    if (!offlineMode) throw new Error('Not in offline mode');
    return reviews.filter(r => r.movieId === movieId);
  },

  async getUserReviews(userId: string): Promise<Review[]> {
    if (!offlineMode) throw new Error('Not in offline mode');
    return reviews.filter(r => r.userId === userId);
  },

  async upsertReview(userId: string, movieId: string, rating: number, reviewText?: string): Promise<Review> {
    if (!offlineMode) throw new Error('Not in offline mode');
    
    const existingIndex = reviews.findIndex(r => r.userId === userId && r.movieId === movieId);
    
    const review: Review = {
      id: `offline-${Date.now()}`,
      movieId,
      userId,
      username: 'You (Offline)',
      rating,
      comment: reviewText || '',
      createdAt: new Date(),
      likes: 0,
    };

    if (existingIndex >= 0) {
      reviews[existingIndex] = review;
    } else {
      reviews.push(review);
    }

    return review;
  },

  async deleteReview(userId: string, movieId: string): Promise<void> {
    if (!offlineMode) throw new Error('Not in offline mode');
    reviews = reviews.filter(r => !(r.userId === userId && r.movieId === movieId));
  },

  async getUserMovieReview(userId: string, movieId: string): Promise<Review | null> {
    if (!offlineMode) throw new Error('Not in offline mode');
    return reviews.find(r => r.userId === userId && r.movieId === movieId) || null;
  },

  async getMovieStats(movieId: string): Promise<{ averageRating: number; totalReviews: number }> {
    if (!offlineMode) throw new Error('Not in offline mode');
    const movieReviews = reviews.filter(r => r.movieId === movieId);
    
    if (movieReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = movieReviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      averageRating: totalRating / movieReviews.length,
      totalReviews: movieReviews.length,
    };
  },
};
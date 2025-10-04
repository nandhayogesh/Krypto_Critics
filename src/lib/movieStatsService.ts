import { movies } from '@/data/movies';
import { reviewService } from './reviewService';

class MovieStatsService {
  private movieStats: Map<string, { rating: number; reviewCount: number }> = new Map();

  constructor() {
    // Initialize with current movie data
    movies.forEach(movie => {
      this.movieStats.set(movie.id, {
        rating: movie.rating,
        reviewCount: movie.reviewCount
      });
    });
  }

  async updateMovieStats(movieId: string): Promise<void> {
    try {
      // Get all reviews for this movie
      const reviews = await reviewService.getMovieReviews(movieId);
      
      if (reviews.length === 0) {
        this.movieStats.set(movieId, { rating: 0, reviewCount: 0 });
        return;
      }

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      // Update stats
      this.movieStats.set(movieId, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: reviews.length
      });

      console.log(`📊 Updated stats for movie ${movieId}:`, {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length
      });
    } catch (error) {
      console.error('Error updating movie stats:', error);
    }
  }

  getMovieStats(movieId: string): { rating: number; reviewCount: number } {
    return this.movieStats.get(movieId) || { rating: 0, reviewCount: 0 };
  }

  async addReview(movieId: string, rating: number): Promise<void> {
    // This will be called after a review is added
    await this.updateMovieStats(movieId);
  }

  async removeReview(movieId: string): Promise<void> {
    // This will be called after a review is removed
    await this.updateMovieStats(movieId);
  }

  // Get updated movie data with current stats
  getUpdatedMovies() {
    return movies.map(movie => ({
      ...movie,
      ...this.getMovieStats(movie.id)
    }));
  }

  // Get single updated movie
  getUpdatedMovie(movieId: string) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return null;
    
    return {
      ...movie,
      ...this.getMovieStats(movieId)
    };
  }
}

export const movieStatsService = new MovieStatsService();
import { supabase } from './supabase';
import { Review } from '@/types/movie';
import { fallbackReviewService } from './fallbackService';

export interface SupabaseReview {
  id: string;
  user_id: string;
  movie_id: string;
  movie_title: string;
  movie_poster: string | null;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const reviewService = {
  // Get reviews for a movie
  async getMovieReviews(movieId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.transformReview);
    } catch (error) {
      console.warn('Supabase unavailable, using fallback:', error);
      fallbackReviewService.setOfflineMode(true);
      return await fallbackReviewService.getMovieReviews(movieId);
    }
  },

  // Get user's reviews
  async getUserReviews(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          username,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(this.transformReview);
  },

  // Create or update review
  async upsertReview(userId: string, movieId: string, rating: number, reviewText?: string, movieTitle?: string, moviePoster?: string): Promise<Review> {
    try {
      const reviewData = {
        user_id: userId,
        movie_id: movieId,
        movie_title: movieTitle || 'Unknown Movie',
        movie_poster: moviePoster || null,
        rating,
        review_text: reviewText || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('reviews')
        .upsert(reviewData, {
          onConflict: 'user_id,movie_id',
          ignoreDuplicates: false,
        })
        .select(`
          *,
          profiles (
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      return this.transformReview(data);
    } catch (error) {
      console.warn('Supabase unavailable for review, using fallback:', error);
      fallbackReviewService.setOfflineMode(true);
      return await fallbackReviewService.upsertReview(userId, movieId, rating, reviewText);
    }
  },

  // Delete review
  async deleteReview(userId: string, movieId: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', movieId);

    if (error) throw error;
  },

  // Get user's review for a specific movie
  async getUserMovieReview(userId: string, movieId: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          username,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .eq('movie_id', movieId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data ? this.transformReview(data) : null;
  },

  // Get movie statistics
  async getMovieStats(movieId: string): Promise<{ averageRating: number; totalReviews: number }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('movie_id', movieId);

    if (error) throw error;

    const totalReviews = data.length;
    const averageRating = totalReviews > 0 
      ? data.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    return { averageRating, totalReviews };
  },

  // Transform Supabase review to app format
  transformReview(data: SupabaseReview): Review {
    return {
      id: data.id,
      movieId: data.movie_id,
      userId: data.user_id,
      username: data.profiles?.username || 'Anonymous',
      rating: data.rating,
      comment: data.review_text || '',
      createdAt: new Date(data.created_at),
      likes: 0, // Default to 0 since not implemented yet
    };
  },
};
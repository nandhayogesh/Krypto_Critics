import { supabase } from './supabase';

export interface WishlistItem {
  id: string;
  user_id: string;
  movie_id: string;
  created_at: string;
}

class WishlistService {
  async addToWishlist(userId: string, movieId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wishlist')
        .insert([
          { user_id: userId, movie_id: movieId }
        ]);

      if (error) {
        console.error('Error adding to wishlist:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  }

  async removeFromWishlist(userId: string, movieId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId);

      if (error) {
        console.error('Error removing from wishlist:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  }

  async getUserWishlist(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('movie_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching wishlist:', error);
        return [];
      }

      return data?.map(item => item.movie_id) || [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  }

  async isInWishlist(userId: string, movieId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking wishlist:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }
}

export const wishlistService = new WishlistService();
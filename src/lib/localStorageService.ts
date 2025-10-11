// Simple local storage service for managing reviews and user data
import { Review } from '@/types/movie';

const STORAGE_KEYS = {
  USERNAME: 'krypto_username',
  REVIEWS: 'krypto_reviews',
  WISHLIST: 'krypto_wishlist',
};

// User management
export const getUsername = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USERNAME);
};

export const setUsername = (username: string): void => {
  localStorage.setItem(STORAGE_KEYS.USERNAME, username);
};

export const clearUsername = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USERNAME);
};

// Review management
export const getAllReviews = (): Review[] => {
  try {
    const reviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return reviews ? JSON.parse(reviews) : [];
  } catch (error) {
    console.error('Error loading reviews:', error);
    return [];
  }
};

export const getUserReviews = (username: string): Review[] => {
  const allReviews = getAllReviews();
  return allReviews.filter(review => review.user_id === username);
};

export const getMovieReviews = (movieId: string): Review[] => {
  const allReviews = getAllReviews();
  return allReviews.filter(review => review.movie_id === movieId);
};

export const getUserMovieReview = (username: string, movieId: string): Review | null => {
  const allReviews = getAllReviews();
  return allReviews.find(review => review.user_id === username && review.movie_id === movieId) || null;
};

export const saveReview = (
  username: string,
  movieId: string,
  rating: number,
  comment: string,
  movieTitle: string,
  moviePoster?: string
): Review => {
  const allReviews = getAllReviews();
  const existingReviewIndex = allReviews.findIndex(
    review => review.user_id === username && review.movie_id === movieId
  );

  const now = new Date().toISOString();
  const review: Review = {
    id: existingReviewIndex >= 0 ? allReviews[existingReviewIndex].id : `review_${Date.now()}_${Math.random()}`,
    movie_id: movieId,
    user_id: username,
    rating,
    comment,
    created_at: existingReviewIndex >= 0 ? allReviews[existingReviewIndex].created_at : now,
    updated_at: now,
    movie_title: movieTitle,
    movie_poster: moviePoster,
    profiles: {
      username,
      avatar_url: null,
    },
  };

  if (existingReviewIndex >= 0) {
    allReviews[existingReviewIndex] = review;
  } else {
    allReviews.push(review);
  }

  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
  return review;
};

export const deleteReview = (username: string, movieId: string): boolean => {
  const allReviews = getAllReviews();
  const filteredReviews = allReviews.filter(
    review => !(review.user_id === username && review.movie_id === movieId)
  );

  if (filteredReviews.length < allReviews.length) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(filteredReviews));
    return true;
  }
  return false;
};

// Movie stats
export const getMovieStats = (movieId: string) => {
  const reviews = getMovieReviews(movieId);
  if (reviews.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
  };
};

// Wishlist management
export const getWishlist = (username: string): string[] => {
  try {
    const wishlist = localStorage.getItem(`${STORAGE_KEYS.WISHLIST}_${username}`);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error loading wishlist:', error);
    return [];
  }
};

export const addToWishlist = (username: string, movieId: string): void => {
  const wishlist = getWishlist(username);
  if (!wishlist.includes(movieId)) {
    wishlist.push(movieId);
    localStorage.setItem(`${STORAGE_KEYS.WISHLIST}_${username}`, JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (username: string, movieId: string): void => {
  const wishlist = getWishlist(username);
  const filtered = wishlist.filter(id => id !== movieId);
  localStorage.setItem(`${STORAGE_KEYS.WISHLIST}_${username}`, JSON.stringify(filtered));
};

export const isInWishlist = (username: string, movieId: string): boolean => {
  const wishlist = getWishlist(username);
  return wishlist.includes(movieId);
};

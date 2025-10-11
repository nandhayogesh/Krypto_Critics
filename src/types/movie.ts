export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string[];
  poster: string;
  description: string;
  duration: number;
  rating: number; // Average rating
  userRating?: number; // Current user's rating
  reviewCount: number;
}

export interface Review {
  id: string;
  movie_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  movie_title?: string;
  movie_poster?: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
}
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
  movieId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: Date;
  likes: number;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
}
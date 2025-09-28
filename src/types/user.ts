export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface UserReview {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

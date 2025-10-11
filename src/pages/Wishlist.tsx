import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { getUsername, getWishlist, getMovieStats } from '@/lib/localStorageService';
import { movies } from '@/data/movies';
import { Movie } from '@/types/movie';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Wishlist() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [wishlistMovies, setWishlistMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const user = getUsername();
    setUsername(user);
    if (user) {
      loadWishlist(user);
    }
  }, []);

  const loadWishlist = (user: string) => {
    try {
      const wishlistMovieIds = getWishlist(user);
      
      // Get movies from data and update with current stats
      const moviesInWishlist = movies
        .filter(movie => wishlistMovieIds.includes(movie.id))
        .map(movie => {
          const stats = getMovieStats(movie.id);
          return { 
            ...movie, 
            rating: stats.averageRating,
            reviewCount: stats.totalReviews
          };
        });

      setWishlistMovies(moviesInWishlist);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('Failed to load wishlist');
    }
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-10 w-10 p-0 text-slate-300 hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-slate-100">My Wishlist</h1>
                <p className="text-slate-400">
                  {username 
                    ? `${wishlistMovies.length} movie${wishlistMovies.length !== 1 ? 's' : ''} saved`
                    : 'Set a username to save movies to wishlist'
                  }
                </p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Wishlist Content */}
          {!username ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                <CardTitle className="text-slate-100">Set a username first</CardTitle>
                <CardDescription className="text-slate-400">
                  Click "Set Username" in the header to get started
                </CardDescription>
              </CardHeader>
            </Card>
          ) : wishlistMovies.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-slate-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-slate-100">Your wishlist is empty</h2>
              <p className="text-slate-400 mb-6">
                Start adding movies to your wishlist by clicking the heart icon on any movie card
              </p>
              <Button onClick={() => navigate('/')} className="bg-yellow-600 hover:bg-yellow-700">
                Browse Movies
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {wishlistMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
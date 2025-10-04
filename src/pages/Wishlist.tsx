import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { wishlistService } from '@/lib/wishlistService';
import { movieStatsService } from '@/lib/movieStatsService';
import { movies } from '@/data/movies';
import { Movie } from '@/types/movie';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Wishlist() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistMovies, setWishlistMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const wishlistMovieIds = await wishlistService.getUserWishlist(user.id);
      
      // Get movies from data and update with current stats
      const moviesInWishlist = movies
        .filter(movie => wishlistMovieIds.includes(movie.id))
        .map(movie => {
          const stats = movieStatsService.getMovieStats(movie.id);
          return { ...movie, ...stats };
        });

      setWishlistMovies(moviesInWishlist);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <CardTitle>Sign In Required</CardTitle>
                <CardDescription>
                  Please sign in to view your wishlist
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => navigate('/')}>
                  Go to Homepage
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlistMovies.length} movie{wishlistMovies.length !== 1 ? 's' : ''} saved
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
        {wishlistMovies.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding movies to your wishlist by clicking the heart icon on any movie card
            </p>
            <Button onClick={() => navigate('/')}>
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
  );
}
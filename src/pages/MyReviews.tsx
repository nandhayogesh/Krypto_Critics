import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reviewService } from '@/lib/reviewService';
import { Review, Movie } from '@/types/movie';
import { movies } from '@/data/movies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Calendar, MessageSquare, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function MyReviews() {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<(Review & { movie?: Movie })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserReviews();
    }
  }, [isAuthenticated, user]);

  const loadUserReviews = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const userReviews = await reviewService.getUserReviews(user.id);
      
      // Enrich reviews with movie data
      const enrichedReviews = userReviews.map(review => ({
        ...review,
        movie: movies.find(m => m.id === review.movieId)
      }));
      
      // Sort by creation date (newest first)
      enrichedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setReviews(enrichedReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (movieId: string) => {
    if (!user) return;
    
    try {
      await reviewService.deleteReview(user.id, movieId);
      setReviews(prev => prev.filter(review => review.movieId !== movieId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <MessageSquare className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view your movie reviews.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-24 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
        <p className="text-muted-foreground">
          Your movie ratings and reviews • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No reviews yet</CardTitle>
            <CardDescription className="mb-4">
              Start rating and reviewing movies to see them here
            </CardDescription>
            <Button onClick={() => window.location.href = '/'}>
              Discover Movies
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="transition-colors duration-200 hover:bg-muted/30">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {review.movie && (
                    <img
                      src={review.movie.poster}
                      alt={review.movie.title}
                      className="w-16 h-24 object-cover rounded border"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg line-clamp-1">
                          {review.movie?.title || 'Movie not found'}
                        </CardTitle>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(review.createdAt))} ago
                          </div>
                          
                          {review.movie && (
                            <Badge variant="secondary" className="text-xs">
                              {review.movie.year}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReview(review.movieId)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <StarRating rating={review.rating} size="sm" showValue />
                      <span className="text-sm text-muted-foreground">
                        {review.rating}/5 stars
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {review.comment && (
                <CardContent className="pt-0">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
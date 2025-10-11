import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { getUsername, getUserReviews, deleteReview } from '@/lib/localStorageService';
import { Review, Movie } from '@/types/movie';
import { movies } from '@/data/movies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Calendar, MessageSquare, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function MyReviews() {
  const [username, setUsername] = useState<string | null>(null);
  const [reviews, setReviews] = useState<(Review & { movie?: Movie })[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUsername();
    setUsername(user);
    if (user) {
      loadUserReviews(user);
    }
  }, []);

  const loadUserReviews = (user: string) => {
    try {
      const userReviews = getUserReviews(user);
      
      // Enrich reviews with movie data
      const enrichedReviews = userReviews.map(review => ({
        ...review,
        movie: movies.find(m => m.id === review.movie_id)
      }));
      
      // Sort by creation date (newest first)
      enrichedReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setReviews(enrichedReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    }
  };

  const handleDeleteReview = (movieId: string) => {
    if (!username) return;
    
    try {
      deleteReview(username, movieId);
      setReviews(prev => prev.filter(review => review.movie_id !== movieId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-100">My Reviews</h1>
          <p className="text-slate-400">
            {username 
              ? `Your movie ratings and reviews • ${reviews.length} review${reviews.length !== 1 ? 's' : ''}`
              : 'Set a username to start reviewing movies'
            }
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!username ? (
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <CardTitle className="mb-2 text-slate-200">Set a username first</CardTitle>
              <CardDescription className="mb-4 text-slate-400">
                Click "Set Username" in the header to get started
              </CardDescription>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="text-center py-12">
              <Star className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <CardTitle className="mb-2 text-slate-200">No reviews yet</CardTitle>
              <CardDescription className="mb-4 text-slate-400">
                Start rating and reviewing movies to see them here
              </CardDescription>
              <Button onClick={() => navigate('/')} className="bg-yellow-600 hover:bg-yellow-700">
                Discover Movies
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="transition-colors duration-200 bg-slate-900 border-slate-700 hover:bg-slate-800">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {review.movie && (
                      <img
                        src={review.movie.poster}
                        alt={review.movie.title}
                        className="w-16 h-24 object-cover rounded border border-slate-700 cursor-pointer"
                        onClick={() => navigate(`/movie/${review.movie_id}`)}
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle 
                            className="text-lg line-clamp-1 text-slate-100 cursor-pointer hover:text-yellow-500"
                            onClick={() => navigate(`/movie/${review.movie_id}`)}
                          >
                            {review.movie?.title || 'Movie not found'}
                          </CardTitle>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(review.created_at))} ago
                            </div>
                            
                            {review.movie && (
                              <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-300">
                                {review.movie.year}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review.movie_id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <StarRating rating={review.rating} size="sm" showValue />
                        <span className="text-sm text-slate-400">
                          {review.rating}/5 stars
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {review.comment && (
                  <CardContent className="pt-0">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="text-sm leading-relaxed text-slate-300">{review.comment}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
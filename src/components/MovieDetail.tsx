import { Movie, Review } from "@/types/movie";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "./ReviewForm";
import { Clock, Calendar, User, Heart, MessageCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { reviewService } from "@/lib/reviewService";

interface MovieDetailProps {
  movie: Movie;
  reviews: Review[];
  onBack: () => void;
}

export function MovieDetail({ 
  movie, 
  reviews: initialReviews, 
  onBack
}: MovieDetailProps) {
  const [movieStats, setMovieStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [currentReviews, setCurrentReviews] = useState<Review[]>(initialReviews);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    loadMovieStats();
    loadReviews();
  }, [movie.id]);

  const loadMovieStats = async () => {
    try {
      const stats = await reviewService.getMovieStats(movie.id);
      setMovieStats(stats);
    } catch (error) {
      console.error('Error loading movie stats:', error);
    }
  };

  const loadReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const reviews = await reviewService.getMovieReviews(movie.id);
      setCurrentReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleReviewSubmitted = (review: Review) => {
    // Reload stats and reviews when a review is submitted
    loadMovieStats();
    loadReviews();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 hover:bg-secondary"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Movies
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Movie Poster */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="w-full rounded-lg shadow-[var(--shadow-movie)]"
            />
          </div>
        </div>

        {/* Movie Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-subtle mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{movie.duration} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{movie.director}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <StarRating rating={movieStats.averageRating || movie.rating} size="lg" showValue />
                <span className="text-subtle">
                  ({movieStats.totalReviews || movie.reviewCount} reviews)
                </span>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              {movie.description}
            </p>
          </div>

          {/* Review Form */}
          <div className="mb-8">
            <ReviewForm 
              movieId={movie.id}
              movieTitle={movie.title}
              moviePoster={movie.poster}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">
                Reviews ({currentReviews.length})
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadReviews}
                disabled={isLoadingReviews}
              >
                {isLoadingReviews ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="space-y-6">
              {currentReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {review.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold">{review.username}</span>
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-sm text-subtle">
                            {review.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-foreground mb-3 leading-relaxed">
                          {review.comment}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-subtle">
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>{review.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {currentReviews.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-subtle">No reviews yet. Be the first to review this movie!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Movie, Review } from "@/types/movie";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "./ReviewForm";
import { Clock, Calendar, User, Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { getMovieStats } from "@/lib/localStorageService";

interface MovieDetailProps {
  movie: Movie;
  reviews: Review[];
  onBack: () => void;
  onReviewUpdate?: () => void;
}

export function MovieDetail({ 
  movie, 
  reviews, 
  onBack,
  onReviewUpdate
}: MovieDetailProps) {
  const [movieStats, setMovieStats] = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    loadMovieStats();
  }, [movie.id, reviews]);

  const loadMovieStats = () => {
    const stats = getMovieStats(movie.id);
    setMovieStats(stats);
  };

  const handleReviewSubmitted = (review: Review) => {
    // Reload stats when a review is submitted
    loadMovieStats();
    onReviewUpdate?.();
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
              <h3 className="text-2xl font-semibold text-slate-100">
                Reviews ({reviews.length})
              </h3>
            </div>
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="bg-slate-900 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-slate-800 text-yellow-500">
                          {review.profiles?.username?.charAt(0).toUpperCase() || review.user_id.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-slate-200">
                            {review.profiles?.username || review.user_id}
                          </span>
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-sm text-slate-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {review.comment && (
                          <p className="text-slate-300 mb-3 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {reviews.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No reviews yet. Be the first to review this movie!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
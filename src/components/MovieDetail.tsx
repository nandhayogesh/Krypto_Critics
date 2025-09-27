import { Movie, Review } from "@/types/movie";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, User, Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface MovieDetailProps {
  movie: Movie;
  reviews: Review[];
  onBack: () => void;
  onRatingChange: (movieId: string, rating: number) => void;
  onAddReview: (movieId: string, rating: number, comment: string) => void;
}

export function MovieDetail({ 
  movie, 
  reviews, 
  onBack, 
  onRatingChange, 
  onAddReview 
}: MovieDetailProps) {
  const [userRating, setUserRating] = useState(movie.userRating || 0);
  const [reviewText, setReviewText] = useState("");

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    onRatingChange(movie.id, rating);
  };

  const handleSubmitReview = () => {
    if (reviewText.trim() && userRating > 0) {
      onAddReview(movie.id, userRating, reviewText.trim());
      setReviewText("");
    }
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
            
            {/* Rating Section */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="font-semibold">Your Rating</h3>
              </CardHeader>
              <CardContent>
                <StarRating
                  rating={userRating}
                  onRatingChange={handleRatingChange}
                  size="lg"
                  className="justify-center"
                />
                <p className="text-center text-sm text-subtle mt-2">
                  Click to rate
                </p>
              </CardContent>
            </Card>
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
                <StarRating rating={movie.rating} size="lg" showValue />
                <span className="text-subtle">({movie.reviewCount} reviews)</span>
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">
              {movie.description}
            </p>
          </div>

          {/* Add Review Section */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="font-semibold">Write a Review</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <StarRating
                  rating={userRating}
                  onRatingChange={handleRatingChange}
                  size="lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Review</label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  className="min-h-[100px]"
                />
              </div>
              <Button 
                onClick={handleSubmitReview}
                disabled={!reviewText.trim() || userRating === 0}
                className="w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Post Review
              </Button>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Reviews ({reviews.length})
            </h3>
            
            <div className="space-y-6">
              {reviews.map((review) => (
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
              
              {reviews.length === 0 && (
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
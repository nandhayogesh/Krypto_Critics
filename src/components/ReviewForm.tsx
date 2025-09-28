import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reviewService } from '@/lib/reviewService';
import { Review } from '@/types/movie';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StarRating } from '@/components/StarRating';
import { AuthModal } from '@/components/AuthModal';
import { Loader2, MessageSquare, Star, Edit3 } from 'lucide-react';

interface ReviewFormProps {
  movieId: string;
  movieTitle: string;
  moviePoster?: string;
  onReviewSubmitted?: (review: Review) => void;
}

export function ReviewForm({ movieId, movieTitle, moviePoster, onReviewSubmitted }: ReviewFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing review when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadExistingReview();
    } else {
      setExistingReview(null);
      setRating(0);
      setReviewText('');
    }
  }, [isAuthenticated, user, movieId]);

  const loadExistingReview = async () => {
    if (!user) return;
    
    try {
      setIsLoadingExisting(true);
      const review = await reviewService.getUserMovieReview(user.id, movieId);
      
      if (review) {
        setExistingReview(review);
        setRating(review.rating);
        setReviewText(review.comment);
      }
    } catch (err) {
      console.error('Error loading existing review:', err);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const review = await reviewService.upsertReview(user.id, movieId, rating, reviewText.trim(), movieTitle, moviePoster);
      
      setSuccess(existingReview ? 'Review updated successfully!' : 'Review added successfully!');
      setExistingReview(review);
      onReviewSubmitted?.(review);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Rate & Review
            </CardTitle>
            <CardDescription>
              Share your thoughts about {movieTitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Sign in to rate and review this movie</span>
                <Button onClick={() => setShowAuthModal(true)} size="sm">
                  Sign In
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  if (isLoadingExisting) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-48"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-40"></div>
            <div className="h-20 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {existingReview ? <Edit3 className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            {existingReview ? 'Update Review' : 'Rate & Review'}
          </CardTitle>
          <CardDescription>
            {existingReview 
              ? `Update your review for ${movieTitle}`
              : `Share your thoughts about ${movieTitle}`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={rating}
                  onRatingChange={handleRatingChange}
                  interactive
                  size="lg"
                />
                <span className="text-sm text-muted-foreground">
                  {rating > 0 ? `${rating}/5 stars` : 'Click to rate'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Review (Optional)</Label>
              <Textarea
                id="review"
                placeholder="What did you think of this movie? Share your thoughts..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {reviewText.length}/500 characters
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || rating === 0}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {existingReview ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                existingReview ? 'Update Review' : 'Submit Review'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
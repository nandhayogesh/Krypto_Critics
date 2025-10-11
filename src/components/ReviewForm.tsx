import React, { useState, useEffect } from 'react';
import { getUsername, saveReview, getUserMovieReview } from '@/lib/localStorageService';
import { Review } from '@/types/movie';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StarRating } from '@/components/StarRating';
import { Loader2, MessageSquare, Star, Edit3, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ReviewFormProps {
  movieId: string;
  movieTitle: string;
  moviePoster?: string;
  onReviewSubmitted?: (review: Review) => void;
}

export function ReviewForm({ movieId, movieTitle, moviePoster, onReviewSubmitted }: ReviewFormProps) {
  const [username, setUsernameState] = useState<string>("");
  const [tempUsername, setTempUsername] = useState("");
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load username and existing review
  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setUsernameState(storedUsername);
      loadExistingReview(storedUsername);
    }
  }, [movieId]);

  const loadExistingReview = (user: string) => {
    const review = getUserMovieReview(user, movieId);
    if (review) {
      setExistingReview(review);
      setRating(review.rating);
      setReviewText(review.comment);
    } else {
      setExistingReview(null);
      setRating(0);
      setReviewText('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      setShowUsernameInput(true);
      setError('Please set a username first');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const review = saveReview(username, movieId, rating, reviewText.trim(), movieTitle, moviePoster);
      
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

  const handleSaveUsername = () => {
    if (tempUsername.trim()) {
      const user = tempUsername.trim();
      setUsernameState(user);
      setShowUsernameInput(false);
      setTempUsername("");
      loadExistingReview(user);
      // Also save to localStorage via the service
      import('@/lib/localStorageService').then(({ setUsername }) => {
        setUsername(user);
      });
    }
  };

  return (
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
        {!username && (
          <Alert className="mb-4 border-blue-200 bg-blue-900/20">
            <UserIcon className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              Please set a username to submit reviews
            </AlertDescription>
          </Alert>
        )}
        
        {showUsernameInput && (
          <div className="mb-4 space-y-2">
            <Label>Enter your username</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Username"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveUsername()}
                className="bg-slate-800 border-slate-600 text-slate-200"
              />
              <Button type="button" onClick={handleSaveUsername}>
                Save
              </Button>
            </div>
          </div>
        )}
        
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-900/20">
            <AlertDescription className="text-green-200">{success}</AlertDescription>
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
              maxLength={500}
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
            ) : !username ? (
              'Set Username to Submit'
            ) : (
              existingReview ? 'Update Review' : 'Submit Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Movie, Review } from "@/types/movie";
import { movies } from "@/data/movies";
import { movieStatsService } from "@/lib/movieStatsService";
import { MovieGrid } from "@/components/MovieGrid";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FeaturedMovies } from "@/components/FeaturedMovies";
import { MovieGridSkeleton, HeroSkeleton } from "@/components/LoadingSkeletons";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [movieReviews, setMovieReviews] = useState<Record<string, Review[]>>({});

  const { toast } = useToast();

  // Add user ratings and dynamic stats to movies
  const moviesWithRatings = useMemo(() => {
    return movies.map(movie => {
      const stats = movieStatsService.getMovieStats(movie.id);
      return {
        ...movie,
        userRating: userRatings[movie.id],
        rating: stats.rating,
        reviewCount: stats.reviewCount
      };
    });
  }, [userRatings]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleRatingChange = (movieId: string, rating: number) => {
    setUserRatings(prev => ({
      ...prev,
      [movieId]: rating
    }));
    
    toast({
      title: "Rating saved",
      description: `You rated this movie ${rating} star${rating !== 1 ? 's' : ''}`,
    });
  };

  const handleAddReview = (movieId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `r${Date.now()}`,
      movieId,
      userId: "current-user",
      username: "You",
      rating,
      comment,
      createdAt: new Date(),
      likes: 0
    };

    setMovieReviews(prev => ({
      ...prev,
      [movieId]: [newReview, ...(prev[movieId] || [])]
    }));

    setUserRatings(prev => ({
      ...prev,
      [movieId]: rating
    }));

    toast({
      title: "Review posted",
      description: "Your review has been added successfully!",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Carousel */}
          {isLoading ? (
            <HeroSkeleton />
          ) : (
            <HeroCarousel onMovieClick={(movieId) => navigate(`/movie/${movieId}`)} />
          )}
          
          {/* Featured Movies Section */}
          {isLoading ? (
            <MovieGridSkeleton count={8} />
          ) : (
            <FeaturedMovies 
              movies={moviesWithRatings}
              onMovieClick={handleMovieClick}
            />
          )}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation 
        activeTab="home"
        onTabChange={() => {}}
      />
      
      {/* Add padding bottom for mobile to account for bottom navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default Index;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Movie, Review } from "@/types/movie";
import { movies } from "@/data/movies";
import { MovieGrid } from "@/components/MovieGrid";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FeaturedMovies } from "@/components/FeaturedMovies";
import { EnhancedSearchBar, SearchFilters } from "@/components/EnhancedSearchBar";
import { MovieGridSkeleton, HeroSkeleton } from "@/components/LoadingSkeletons";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
    genres: [],
    yearRange: [1900, 2025],
    ratingRange: [0, 5],
    sortBy: 'title',
    sortOrder: 'asc'
  });
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [movieReviews, setMovieReviews] = useState<Record<string, Review[]>>({
    "1": [
      {
        id: "r1",
        movieId: "1",
        userId: "u1",
        username: "CinemaLover",
        rating: 5,
        comment: "Visually stunning and emotionally profound. Villeneuve has crafted a masterpiece that honors the original while carving its own path. The cinematography is breathtaking.",
        createdAt: new Date("2024-01-15"),
        likes: 23
      },
      {
        id: "r2",
        movieId: "1",
        userId: "u2",
        username: "SciFiFan42",
        rating: 4,
        comment: "A worthy successor to the original Blade Runner. The world-building is incredible and the themes are more relevant than ever.",
        createdAt: new Date("2024-01-10"),
        likes: 15
      }
    ],
    "4": [
      {
        id: "r3",
        movieId: "4",
        userId: "u3",
        username: "FilmBuff",
        rating: 5,
        comment: "Tarantino at his absolute best. The dialogue, the structure, the performances - everything is perfect. A true classic.",
        createdAt: new Date("2024-01-20"),
        likes: 42
      }
    ]
  });

  const { toast } = useToast();

  const filteredMovies = useMemo(() => {
    let filtered = movies.map(movie => ({
      ...movie,
      userRating: userRatings[movie.id]
    }));

    // Apply text search
    if (searchFilters.query.trim()) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.genre.some(g => g.toLowerCase().includes(query))
      );
    }

    // Apply genre filters
    if (searchFilters.genres.length > 0) {
      filtered = filtered.filter(movie =>
        searchFilters.genres.some(genre => movie.genre.includes(genre))
      );
    }

    // Apply year range filter
    filtered = filtered.filter(movie =>
      movie.year >= searchFilters.yearRange[0] && movie.year <= searchFilters.yearRange[1]
    );

    // Apply rating filter
    filtered = filtered.filter(movie =>
      movie.rating >= searchFilters.ratingRange[0] && movie.rating <= searchFilters.ratingRange[1]
    );

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[searchFilters.sortBy];
      const bValue = b[searchFilters.sortBy];
      
      if (searchFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchFilters, userRatings]);

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

  const hasSearchQuery = searchFilters.query.trim() !== "";
  const hasActiveFilters = searchFilters.genres.length > 0 || 
    searchFilters.yearRange[0] !== 1900 || searchFilters.yearRange[1] !== 2025 ||
    searchFilters.ratingRange[0] !== 0 || searchFilters.ratingRange[1] !== 5;

  return (
    <div className="min-h-screen">
      <Header 
        searchQuery={searchFilters.query}
        onSearchChange={(query) => setSearchFilters({ ...searchFilters, query })}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!hasSearchQuery && !hasActiveFilters ? (
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
                movies={filteredMovies}
                onMovieClick={handleMovieClick}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Search Bar */}
            <EnhancedSearchBar 
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              placeholder="Search movies, directors, genres..."
            />
            
            {/* Search Results Header */}
            <div className="border-b pb-4">
              <h2 className="text-3xl font-bold mb-2">
                {hasSearchQuery ? "Search Results" : "All Movies"}
              </h2>
              <p className="text-subtle">
                Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
                {hasSearchQuery && ` matching "${searchFilters.query}"`}
              </p>
            </div>
            
            {/* Search Results */}
            {isLoading ? (
              <MovieGridSkeleton />
            ) : (
              <MovieGrid 
                movies={filteredMovies}
                onMovieClick={handleMovieClick}
              />
            )}
          </div>
        )}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation 
        activeTab={hasSearchQuery || hasActiveFilters ? 'search' : 'home'}
        onTabChange={(tab) => {
          if (tab === 'home') {
            setSearchFilters({
              query: "",
              genres: [],
              yearRange: [1900, 2025],
              ratingRange: [0, 5],
              sortBy: 'title',
              sortOrder: 'asc'
            });
          }
        }}
      />
      
      {/* Add padding bottom for mobile to account for bottom navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default Index;

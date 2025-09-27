import { useState, useMemo } from "react";
import { Movie, Review } from "@/types/movie";
import { movies } from "@/data/movies";
import { MovieGrid } from "@/components/MovieGrid";
import { MovieDetail } from "@/components/MovieDetail";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ImageSlider } from "@/components/ImageSlider";
import { FeaturedMovies } from "@/components/FeaturedMovies";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    const moviesWithUserRatings = movies.map(movie => ({
      ...movie,
      userRating: userRatings[movie.id]
    }));

    if (!searchQuery.trim()) {
      return moviesWithUserRatings;
    }

    const query = searchQuery.toLowerCase();
    return moviesWithUserRatings.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.director.toLowerCase().includes(query) ||
      movie.genre.some(g => g.toLowerCase().includes(query))
    );
  }, [searchQuery, userRatings]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie({
      ...movie,
      userRating: userRatings[movie.id]
    });
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

  if (selectedMovie) {
    return (
      <div className="min-h-screen">
        <Header 
          searchQuery=""
          onSearchChange={() => {}}
        />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <MovieDetail
            movie={selectedMovie}
            reviews={movieReviews[selectedMovie.id] || []}
            onBack={() => setSelectedMovie(null)}
            onRatingChange={handleRatingChange}
            onAddReview={handleAddReview}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!searchQuery ? (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <HeroSection />
              <FeaturedMovies 
                movies={filteredMovies}
                onMovieClick={handleMovieClick}
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ImageSlider />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Search Results</h2>
              <p className="text-subtle">
                Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
            </div>
            <MovieGrid 
              movies={filteredMovies}
              onMovieClick={handleMovieClick}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

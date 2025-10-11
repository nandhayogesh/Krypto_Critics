import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Movie, Review } from "@/types/movie";
import { movies } from "@/data/movies";
import { getMovieReviews } from "@/lib/localStorageService";
import { MovieDetail as MovieDetailComponent } from "@/components/MovieDetail";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      const foundMovie = movies.find(m => m.id === id);
      if (foundMovie) {
        setMovie(foundMovie);
        // Load reviews from localStorage
        const movieReviews = getMovieReviews(id);
        setReviews(movieReviews);
      }
    }
  }, [id]);

  const handleReviewUpdate = () => {
    // Reload reviews when a new review is submitted
    if (id) {
      const movieReviews = getMovieReviews(id);
      setReviews(movieReviews);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-slate-100">Movie Not Found</h2>
              <p className="text-slate-400 mb-4">The movie you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/")} className="bg-yellow-600 hover:bg-yellow-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Home", onClick: () => navigate("/") },
            { label: "Movies", onClick: () => navigate("/") },
            { label: movie.title, isActive: true }
          ]}
          className="mb-6"
        />
        
        <MovieDetailComponent
          movie={movie}
          reviews={reviews}
          onBack={() => navigate("/")}
          onReviewUpdate={handleReviewUpdate}
        />
      </main>
    </div>
  );
};

export default MovieDetailPage;
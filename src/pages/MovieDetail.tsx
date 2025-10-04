import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Movie, Review } from "@/types/movie";
import { movies } from "@/data/movies";
import { MovieDetail as MovieDetailComponent } from "@/components/MovieDetail";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieReviews, setMovieReviews] = useState<Record<string, Review[]>>({});

  useEffect(() => {
    if (id) {
      const foundMovie = movies.find(m => m.id === id);
      if (foundMovie) {
        setMovie(foundMovie);
      }
    }
  }, [id]);



  if (!movie) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
              <p className="text-subtle mb-4">The movie you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/")}>
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
          reviews={movieReviews[movie.id] || []}
          onBack={() => navigate("/")}
        />
      </main>
    </div>
  );
};

export default MovieDetailPage;
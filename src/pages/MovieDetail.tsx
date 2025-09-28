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
        <Header searchQuery="" onSearchChange={() => {}} />
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
      <Header searchQuery="" onSearchChange={() => {}} />
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
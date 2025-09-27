import { MovieCard } from "./MovieCard";
import { Movie } from "@/types/movie";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedMoviesProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function FeaturedMovies({ movies, onMovieClick }: FeaturedMoviesProps) {
  const featuredMovies = movies.slice(0, 6);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Movies</h2>
          <p className="text-subtle">Discover the latest acclaimed films</p>
        </div>
        <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary">
          See all
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {featuredMovies.map((movie) => (
          <div key={movie.id} className="w-full">
            <MovieCard
              movie={movie}
              onClick={() => onMovieClick?.(movie)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
import { MovieCard } from "./MovieCard";
import { Movie } from "@/types/movie";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedMoviesProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function FeaturedMovies({ movies, onMovieClick }: FeaturedMoviesProps) {
  const featuredMovies = movies.slice(0, 12);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Movies</h2>
          <p className="text-muted-foreground">Discover the latest acclaimed films</p>
        </div>
        <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary transition-colors duration-200">
          See all
          <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`movie-grid-item opacity-0 animate-fade-in ${index < 4 ? '' : 'animate-fade-in'}`}
          >
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
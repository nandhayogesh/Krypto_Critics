import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-subtle">No movies found</p>
        <p className="text-sm text-subtle mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className="movie-grid-item opacity-0 animate-fadeInUp"
          style={{ animationDelay: `${(index % 8) * 0.1}s` }}
        >
          <MovieCard
            movie={movie}
            onClick={() => onMovieClick?.(movie)}
          />
        </div>
      ))}
    </div>
  );
}
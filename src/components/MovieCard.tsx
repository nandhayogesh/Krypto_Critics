import { Movie } from "@/types/movie";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div 
      className="movie-card p-0 cursor-pointer group overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-200 ease-out hover:border-primary/50 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-t-lg bg-muted">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        
        {/* Rating overlay */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1">
          <StarRating rating={movie.rating} size="sm" showValue />
        </div>
        
        {/* Simple play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 pt-0">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-subtle mb-3">
          <Calendar className="h-3 w-3" />
          <span>{movie.year}</span>
          <Clock className="h-3 w-3 ml-2" />
          <span>{movie.duration}m</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <User className="h-3 w-3 text-subtle" />
          <span className="text-sm text-subtle">{movie.director}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genre.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
          {movie.genre.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{movie.genre.length - 2}
            </Badge>
          )}
        </div>

        <p className="text-sm text-subtle line-clamp-3 mb-3">
          {movie.description}
        </p>

        <div className="flex items-center justify-between">
          <StarRating rating={movie.userRating || 0} size="sm" />
          <span className="text-xs text-subtle">
            {movie.reviewCount} reviews
          </span>
        </div>
      </div>
    </div>
  );
}
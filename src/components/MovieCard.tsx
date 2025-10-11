import { Movie } from "@/types/movie";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { getUsername, isInWishlist, addToWishlist, removeFromWishlist, getMovieStats } from "@/lib/localStorageService";
import { useToast } from "@/hooks/use-toast";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const { toast } = useToast();
  const [username, setUsername] = useState<string | null>(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [movieStats, setMovieStats] = useState({ rating: movie.rating, reviewCount: movie.reviewCount });

  // Load wishlist status and updated stats
  useEffect(() => {
    const user = getUsername();
    setUsername(user);
    if (user) {
      checkWishlistStatus(user);
    }
    updateMovieStats();
  }, [movie.id]);

  const checkWishlistStatus = (user: string) => {
    try {
      const inList = isInWishlist(user, movie.id);
      setInWishlist(inList);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const updateMovieStats = () => {
    const stats = getMovieStats(movie.id);
    setMovieStats({
      rating: stats.averageRating,
      reviewCount: stats.totalReviews
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!username) {
      toast({
        title: "Set username first",
        description: "Please set a username to add movies to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (inWishlist) {
        removeFromWishlist(username, movie.id);
        setInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: `${movie.title} has been removed from your wishlist.`,
        });
      } else {
        addToWishlist(username, movie.id);
        setInWishlist(true);
        toast({
          title: "Added to wishlist",
          description: `${movie.title} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };
  return (
    <div 
      className="movie-card cursor-pointer overflow-hidden rounded-xl bg-slate-900/90 border border-slate-700/50"
      onClick={onClick}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-800/50">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-slate-700">
          {movieStats.rating > 0 && (
            <div className="flex items-center gap-1">
              <StarRating rating={movieStats.rating} size="sm" />
              <span className="text-yellow-500 text-xs font-semibold">
                {movieStats.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Wishlist button */}
        <div className="absolute top-3 left-3">
          <Button
            variant="ghost"
            size="sm"
            className={`h-9 w-9 p-0 rounded-full bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700/90 transition-all duration-200 border border-slate-600 shadow-lg ${
              inWishlist ? 'scale-110' : ''
            }`}
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-200 ${
                inWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-400'
              }`}
            />
          </Button>
        </div>

      </div>

      {/* Movie Info */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-lg text-white line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        {/* Year and Duration */}
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-yellow-500" />
            <span>{movie.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-yellow-500" />
            <span>{movie.duration}m</span>
          </div>
        </div>

        {/* Director */}
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-sm text-slate-400 truncate">{movie.director}</span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5">
          {movie.genre.slice(0, 2).map((genre) => (
            <Badge 
              key={genre} 
              className="text-xs px-2 py-1 bg-slate-800 text-yellow-500 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              {genre}
            </Badge>
          ))}
          {movie.genre.length > 2 && (
            <Badge 
              className="text-xs px-2 py-1 bg-slate-800 text-slate-400 border border-slate-600"
            >
              +{movie.genre.length - 2}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {movie.description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <StarRating rating={movie.userRating || 0} size="sm" />
            {movie.userRating > 0 && (
              <span className="text-xs text-yellow-500 font-medium">
                {movie.userRating.toFixed(1)}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500">
            {movieStats.reviewCount} review{movieStats.reviewCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
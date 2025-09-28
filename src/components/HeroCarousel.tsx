import { useState, useEffect, useCallback } from "react";
import { Play, ThumbsUp, Heart, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { movies } from "@/data/movies";

// Hero movie data - featuring top 5 movies for the carousel
const heroMovies = movies.slice(0, 5);

interface HeroCarouselProps {
  onMovieClick?: (movieId: string) => void;
  autoSlideInterval?: number;
}

export function HeroCarousel({ onMovieClick, autoSlideInterval = 4000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoSliding || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === heroMovies.length - 1 ? 0 : prevIndex + 1;
        return nextIndex;
      });
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isAutoSliding, isPaused, autoSlideInterval]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoSliding(false);
    // Resume auto-sliding after user interaction
    setTimeout(() => setIsAutoSliding(true), 8000);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? heroMovies.length - 1 : prevIndex - 1);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 8000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === heroMovies.length - 1 ? 0 : prevIndex + 1);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 8000);
  }, []);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const currentMovie = heroMovies[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case ' ':
          event.preventDefault();
          setIsAutoSliding(prev => !prev);
          break;
        case 'Enter':
          event.preventDefault();
          onMovieClick?.(currentMovie.id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMovie.id, goToPrevious, goToNext, onMovieClick]);

  return (
    <div 
      className="relative h-[500px] md:h-[600px] overflow-hidden rounded-xl mb-8 group select-none focus-within:ring-2 focus-within:ring-primary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Featured movies carousel"
      aria-live="polite"
      tabIndex={0}
    >
      {/* Background Images with Transition */}
      <div className="absolute inset-0">
        {heroMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              index === currentIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            )}
          >
            {/* Create a banner-style background using the poster */}
            <div className="w-full h-full relative">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover object-center transform scale-150 blur-sm"
              />
              <img
                src={movie.poster}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
          </div>
        ))}
      </div>



      {/* Main Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Movie Details */}
            <div className="space-y-6 animate-fade-in">
              {/* Brand Badge */}
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground font-bold text-sm px-4 py-2">
                  FEATURED MOVIE
                </Badge>
                <Badge variant="outline" className="text-white border-white/30">
                  #{currentIndex + 1} of {heroMovies.length}
                </Badge>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {currentMovie.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                  Directed by {currentMovie.director} • {currentMovie.year}
                </p>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-200 max-w-lg leading-relaxed">
                {currentMovie.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <StarRating rating={currentMovie.rating} size="md" />
                  <span className="text-sm">{currentMovie.rating}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{currentMovie.reviewCount} reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{currentMovie.duration}m</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {currentMovie.genre.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-lg w-full sm:w-auto"
                  onClick={() => onMovieClick?.(currentMovie.id)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 transition-colors duration-200 hover:border-white/50 w-full sm:w-auto"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Watchlist
                </Button>
              </div>
            </div>

            {/* Right Side - Movie Poster */}
            <div className="hidden lg:flex justify-center">
              <Card className="w-80 h-96 overflow-hidden shadow-2xl">
                <img
                  src={currentMovie.poster}
                  alt={currentMovie.title}
                  className="w-full h-full object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-3">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                index === currentIndex 
                  ? "bg-primary scale-125" 
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20">
        <div 
          key={currentIndex} // Force re-render for each slide
          className={cn(
            "h-full bg-primary",
            isAutoSliding && !isPaused ? "animate-pulse" : ""
          )}
          style={{ 
            width: `${((currentIndex + 1) / heroMovies.length) * 100}%`,
            transition: isAutoSliding && !isPaused ? `width ${autoSlideInterval}ms linear` : 'width 300ms ease'
          }}
        />
      </div>

      {/* Swipe Indicator for Mobile */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 md:hidden opacity-60">
        <div className="flex items-center gap-2 text-white text-xs">
          <div className="w-8 h-0.5 bg-white/50 rounded-full"></div>
          <span>Swipe to navigate</span>
          <div className="w-8 h-0.5 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Auto-slide Status - Always Visible */}
      <div className="absolute top-6 left-6 z-20">
        {isAutoSliding && !isPaused && (
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-white text-xs">Auto-playing</span>
          </div>
        )}
      </div>

      {/* Controls and Info */}
      <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
          onClick={() => setIsAutoSliding(!isAutoSliding)}
          aria-label={isAutoSliding ? "Pause slideshow" : "Resume slideshow"}
        >
          {isAutoSliding ? "Pause" : "Play"}
        </Button>
        
        {/* Keyboard hints */}
        <div className="hidden md:block text-xs text-white/70 bg-black/20 backdrop-blur-sm rounded px-2 py-1">
          ← → Navigate • Space Pause • Enter View
        </div>
      </div>
    </div>
  );
}
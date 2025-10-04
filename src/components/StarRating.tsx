import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxStars = 5, 
  onRatingChange, 
  size = "md",
  showValue = false,
  interactive = false,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const handleStarClick = (starIndex: number) => {
    if (onRatingChange) {
      const newRating = starIndex + 1;
      onRatingChange(newRating === rating ? 0 : newRating);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxStars }, (_, index) => {
          const isFilled = index < rating;
          const isHalfFilled = index < rating && index + 1 > rating;
          
          return (
            <button
              key={index}
              onClick={() => handleStarClick(index)}
              disabled={!onRatingChange}
              className={cn(
                "transition-all duration-200",
                (onRatingChange || interactive) && "cursor-pointer hover:scale-110",
                !(onRatingChange || interactive) && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors duration-200",
                  isFilled ? "text-yellow-500 fill-yellow-500" : "text-slate-600",
                  isHalfFilled && "text-yellow-500 fill-yellow-500 opacity-50"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-yellow-500 ml-1 font-medium">
          {rating > 0 ? rating.toFixed(1) : "—"}
        </span>
      )}
    </div>
  );
}
import { Play, ThumbsUp, Heart, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import heroImage from "@/assets/hero-featured.jpg";

export function HeroSection() {
  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg mb-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Featured content"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            {/* Brand Badge */}
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1">
                CINE ORIGINALS
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              The Ultimate Cinema Test
            </h1>
            
            <p className="text-lg text-gray-200 mb-6">
              With the Cast of "The Masters of Cinema"
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">425</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">92</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">12.8K</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">6:42</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={4.3} size="md" />
              <span className="text-white/80 text-sm">4.3/5 • 1,247 reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
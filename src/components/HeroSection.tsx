import { Play, ThumbsUp, Heart, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import heroImage from "@/assets/hero-featured.jpg";

export function HeroSection() {
  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg mb-8 group bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Featured content"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl animate-slideInFromLeft">
            {/* Brand Badge */}
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-slate-800 text-yellow-500 font-bold text-sm px-4 py-2 animate-scaleIn border border-slate-700">
                FEATURED CONTENT
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              The Ultimate Cinema Test
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 mb-6">
              With the Cast of "The Masters of Cinema"
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">425</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm">92</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">12.8K</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">6:42</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={4.3} size="md" />
              <span className="text-gray-300 text-sm">4.3/5 • 1,247 reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
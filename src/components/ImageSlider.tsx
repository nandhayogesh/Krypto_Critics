import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { movies } from "@/data/movies";

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderImages = movies.slice(0, 4);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Featured Collection</h3>
      
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg group">
        {/* Main Image */}
        <img
          src={sliderImages[currentIndex].poster}
          alt={sliderImages[currentIndex].title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Movie Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h4 className="font-semibold text-lg mb-1">
            {sliderImages[currentIndex].title}
          </h4>
          <p className="text-sm text-white/80">
            {sliderImages[currentIndex].year} • {sliderImages[currentIndex].director}
          </p>
        </div>
      </div>
      
      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
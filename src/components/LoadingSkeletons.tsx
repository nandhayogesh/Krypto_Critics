import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <Card className="movie-card p-0 overflow-hidden animate-pulse">
      {/* Movie Poster Skeleton */}
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-t-lg">
        <Skeleton className="w-full h-full" />
        {/* Rating overlay skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="w-16 h-8 rounded-full" />
        </div>
      </div>

      {/* Movie Info Skeleton */}
      <div className="p-4 pt-0 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Year and Duration */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Director */}
        <Skeleton className="h-4 w-24" />

        {/* Genres */}
        <div className="flex gap-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        {/* Rating and reviews */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
}

export function MovieGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-xl mb-8 animate-pulse">
      <Skeleton className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content Skeleton */}
            <div className="space-y-6">
              <div className="flex gap-3">
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
              <Skeleton className="h-16 w-96" />
              <Skeleton className="h-6 w-80" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-lg" />
                <Skeleton className="h-4 w-4/5 max-w-lg" />
                <Skeleton className="h-4 w-3/5 max-w-lg" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
            
            {/* Right Side - Poster Skeleton */}
            <div className="hidden lg:flex justify-center">
              <Skeleton className="w-80 h-96 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicators Skeleton */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-3 h-3 rounded-full" />
        ))}
      </div>
    </div>
  );
}
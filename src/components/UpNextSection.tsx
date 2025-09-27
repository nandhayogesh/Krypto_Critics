import { Play, ThumbsUp, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { movies } from "@/data/movies";

interface UpNextItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  thumbnail: string;
  likes: number;
  hearts: number;
}

export function UpNextSection() {
  const upNextItems: UpNextItem[] = [
    {
      id: "1",
      title: "Shakun Batra on How to Make Your Movie Using AI",
      subtitle: "And Essential Tips for Filmmakers",
      duration: "21:23",
      thumbnail: movies[0].poster,
      likes: 78,
      hearts: 12
    },
    {
      id: "2",
      title: "'Wicked: For Good'",
      subtitle: "Watch the Final Trailer",
      duration: "3:06",
      thumbnail: movies[1].poster,
      likes: 457,
      hearts: 208
    },
    {
      id: "3",
      title: "Why Leonardo DiCaprio Wants You to Go to the Movies",
      subtitle: "Watch Our 'One Battle After Another' Interview",
      duration: "4:54",
      thumbnail: movies[2].poster,
      likes: 202,
      hearts: 69
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Up next</h2>
      </div>

      <div className="space-y-4">
        {upNextItems.map((item, index) => (
          <Card key={item.id} className="p-0 movie-card cursor-pointer group overflow-hidden">
            <div className="flex gap-4 p-4">
              {/* Thumbnail */}
              <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white fill-current" />
                </div>
                {/* Duration */}
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                  {item.duration}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-subtle mb-2 line-clamp-1">
                  {item.subtitle}
                </p>
                
                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-subtle">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{item.hearts}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button 
          variant="ghost" 
          className="w-full justify-center text-primary hover:text-primary-foreground hover:bg-primary"
        >
          Browse trailers
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
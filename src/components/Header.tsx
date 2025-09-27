import { Film } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--movie-bg))]/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Film className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">CineReview</h1>
                <p className="text-xs text-subtle">Your movie companion</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search movies..."
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Welcome back!</p>
              <p className="text-xs text-subtle">Discover your next favorite film</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
import { Film, Menu, Search, Bell, User } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--movie-bg))]/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-lg">
                CineDb
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </Button>

            <div className="hidden lg:flex items-center">
              <Button variant="ghost" size="sm">
                All
              </Button>
            </div>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-lg mx-6">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search CineDb"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden md:flex bg-primary/10 text-primary border-primary/20">
              CineDb Pro
            </Badge>
            
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Bell className="h-4 w-4 mr-2" />
              Watchlist
            </Button>

            <Button variant="default" size="sm">
              Sign In
            </Button>

            <Button variant="ghost" size="sm" className="hidden sm:flex">
              EN
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
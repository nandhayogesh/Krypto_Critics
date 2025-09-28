import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface SearchFilters {
  query: string;
  genres: string[];
  yearRange: [number, number];
  ratingRange: [number, number];
  sortBy: 'title' | 'year' | 'rating' | 'duration';
  sortOrder: 'asc' | 'desc';
}

interface EnhancedSearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
  "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
];

const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'year', label: 'Year' },
  { value: 'rating', label: 'Rating' },
  { value: 'duration', label: 'Duration' }
];

export function EnhancedSearchBar({ 
  filters, 
  onFiltersChange, 
  placeholder = "Search movies...",
  className 
}: EnhancedSearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<SearchFilters>(filters);

  const hasActiveFilters = 
    filters.genres.length > 0 || 
    filters.yearRange[0] !== 1900 || 
    filters.yearRange[1] !== 2025 ||
    filters.ratingRange[0] !== 0 || 
    filters.ratingRange[1] !== 5;

  const handleGenreToggle = (genre: string) => {
    const newGenres = tempFilters.genres.includes(genre)
      ? tempFilters.genres.filter(g => g !== genre)
      : [...tempFilters.genres, genre];
    
    setTempFilters({ ...tempFilters, genres: newGenres });
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    const resetFilters: SearchFilters = {
      query: filters.query,
      genres: [],
      yearRange: [1900, 2025],
      ratingRange: [0, 5],
      sortBy: 'title',
      sortOrder: 'asc'
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFilterCount = 
    filters.genres.length + 
    (filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2025 ? 1 : 0) +
    (filters.ratingRange[0] !== 0 || filters.ratingRange[1] !== 5 ? 1 : 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={filters.query}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
            placeholder={placeholder}
            className="pl-10 bg-card border-border/50 focus:border-primary/50 transition-colors duration-200"
          />
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "relative",
                hasActiveFilters && "border-primary bg-primary/10"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-80 p-0" align="end">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  Advanced Filters
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <div className="flex gap-2">
                    <Select
                      value={tempFilters.sortBy}
                      onValueChange={(value: any) => 
                        setTempFilters({ ...tempFilters, sortBy: value })
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={tempFilters.sortOrder}
                      onValueChange={(value: any) => 
                        setTempFilters({ ...tempFilters, sortOrder: value })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">A-Z</SelectItem>
                        <SelectItem value="desc">Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Year Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Year Range: {tempFilters.yearRange[0]} - {tempFilters.yearRange[1]}
                  </label>
                  <Slider
                    value={tempFilters.yearRange}
                    onValueChange={(value) => 
                      setTempFilters({ ...tempFilters, yearRange: value as [number, number] })
                    }
                    min={1900}
                    max={2025}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Rating Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Minimum Rating: {tempFilters.ratingRange[0]} stars
                  </label>
                  <Slider
                    value={[tempFilters.ratingRange[0]]}
                    onValueChange={(value) => 
                      setTempFilters({ 
                        ...tempFilters, 
                        ratingRange: [value[0], tempFilters.ratingRange[1]] 
                      })
                    }
                    min={0}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Genres */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Genres</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {GENRES.map(genre => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={genre}
                          checked={tempFilters.genres.includes(genre)}
                          onCheckedChange={() => handleGenreToggle(genre)}
                        />
                        <label 
                          htmlFor={genre}
                          className="text-xs cursor-pointer"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={applyFilters}
                    size="sm"
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.genres.map(genre => (
            <Badge 
              key={genre} 
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
              onClick={() => onFiltersChange({
                ...filters,
                genres: filters.genres.filter(g => g !== genre)
              })}
            >
              {genre}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          
          {(filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2025) && (
            <Badge 
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
              onClick={() => onFiltersChange({
                ...filters,
                yearRange: [1900, 2025]
              })}
            >
              {filters.yearRange[0]}-{filters.yearRange[1]}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          
          {(filters.ratingRange[0] !== 0 || filters.ratingRange[1] !== 5) && (
            <Badge 
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
              onClick={() => onFiltersChange({
                ...filters,
                ratingRange: [0, 5]
              })}
            >
              {filters.ratingRange[0]}+ stars
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
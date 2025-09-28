import { Home, Search, Heart, User, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab?: 'home' | 'search' | 'genres' | 'watchlist' | 'profile';
  onTabChange?: (tab: string) => void;
  className?: string;
}

export function BottomNavigation({ 
  activeTab = 'home', 
  onTabChange,
  className 
}: BottomNavigationProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      badge: null
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      badge: null
    },
    {
      id: 'genres',
      label: 'Genres',
      icon: Grid,
      badge: null
    },
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: Heart,
      badge: 3 // Example badge count
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      badge: null
    }
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border/50 px-2 py-2 md:hidden",
      className
    )}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 flex flex-col items-center gap-1 h-auto py-2 px-2 relative transition-colors duration-150",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onTabChange?.(tab.id)}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 transition-colors duration-150",
                  isActive && "scale-110"
                )} />
                {tab.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs leading-none transition-colors duration-150",
                isActive ? "font-medium" : "font-normal"
              )}>
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
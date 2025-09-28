import { Film, Menu, Search, Bell, User, X, LogOut, Star } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--movie-bg))]/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-lg">
                CineDb
              </div>
            </div>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <Button variant="ghost" className="justify-start" onClick={() => navigate("/")}>
                    All Movies
                  </Button>
                  {isAuthenticated && (
                    <Button variant="ghost" className="justify-start" onClick={() => navigate("/my-reviews")}>
                      <Star className="h-4 w-4 mr-2" />
                      My Reviews
                    </Button>
                  )}
                  <Button variant="ghost" className="justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Watchlist
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Top Rated
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Recent
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Genres
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                All
              </Button>
              {isAuthenticated && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/my-reviews")}>
                  My Reviews
                </Button>
              )}
              <Button variant="ghost" size="sm">
                Top Rated
              </Button>
            </div>
          </div>

          {/* Center Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search CineDb"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              {isMobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>

            <Badge variant="outline" className="hidden lg:flex bg-primary/10 text-primary border-primary/20 text-xs">
              Pro
            </Badge>
            
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <Bell className="h-4 w-4 mr-1" />
              <span className="hidden xl:inline">Watchlist</span>
            </Button>

            {/* Authentication Section */}
            {isAuthenticated && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm">
                      {profile.first_name} {profile.last_name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/my-reviews")}>
                    <Star className="h-4 w-4 mr-2" />
                    My Reviews
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="h-4 w-4 mr-2" />
                    Watchlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }} 
                    className="text-destructive"
                    disabled={isSigningOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs md:text-sm"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            )}

            <Button variant="ghost" size="sm" className="hidden sm:flex px-2">
              EN
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden mt-4 pb-2">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search CineDb"
            />
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
}
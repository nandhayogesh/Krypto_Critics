import { Film, Menu, Bell, User, X, LogOut } from "lucide-react";
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
  // No props needed anymore since we removed search
}

export function Header({}: HeaderProps) {
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
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-slate-800 text-yellow-500 px-4 py-2 rounded-lg font-bold text-xl shadow-lg border border-slate-700">
                KryptoCritics
              </div>
            </div>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-slate-300 hover:bg-slate-800">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-slate-900 border-r border-slate-700">
                <div className="flex flex-col space-y-4 mt-8">
                  <Button variant="ghost" className="justify-start text-slate-300 hover:bg-slate-800 hover:text-yellow-500" onClick={() => navigate("/")}>
                    All Movies
                  </Button>
                  {isAuthenticated && (
                    <Button variant="ghost" className="justify-start text-slate-300 hover:bg-slate-800 hover:text-yellow-500" onClick={() => navigate("/my-reviews")}>
                      <User className="h-4 w-4 mr-2" />
                      My Reviews
                    </Button>
                  )}
                  <Button variant="ghost" className="justify-start text-slate-300 hover:bg-slate-800 hover:text-yellow-500" onClick={() => navigate("/wishlist")}>
                    <Bell className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-800 hover:text-yellow-500" onClick={() => navigate("/")}>
                All
              </Button>
              {isAuthenticated && (
                <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-800 hover:text-yellow-500" onClick={() => navigate("/my-reviews")}>
                  My Reviews
                </Button>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="sm" className="hidden lg:flex" onClick={() => navigate("/wishlist")}>
              <Bell className="h-4 w-4 mr-1" />
              <span className="hidden xl:inline">Wishlist</span>
            </Button>

            {/* Authentication Section */}
            {isAuthenticated && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:bg-slate-800">
                    <Avatar className="h-6 w-6 border border-slate-600">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-xs bg-slate-700 text-yellow-500">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm">
                      {profile.first_name} {profile.last_name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
                  <DropdownMenuItem onClick={() => navigate("/my-reviews")} className="text-slate-300 hover:bg-slate-800 hover:text-yellow-500">
                    <User className="h-4 w-4 mr-2" />
                    My Reviews
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wishlist")} className="text-slate-300 hover:bg-slate-800 hover:text-yellow-500">
                    <Bell className="h-4 w-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      handleSignOut();
                    }} 
                    className="text-red-400 hover:bg-slate-800 hover:text-red-300"
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
                className="text-xs md:text-sm bg-slate-700 text-yellow-500 hover:bg-slate-600 border border-slate-600"
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
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
}
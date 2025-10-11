import { Film, Menu, Bell, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsername, setUsername as saveUsername } from "@/lib/localStorageService";

interface HeaderProps {
  // No props needed anymore since we removed search
}

export function Header({}: HeaderProps) {
  const [username, setUsernameState] = useState<string>("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setUsernameState(storedUsername);
    }
  }, []);

  const handleSaveUsername = () => {
    if (tempUsername.trim()) {
      saveUsername(tempUsername.trim());
      setUsernameState(tempUsername.trim());
      setIsEditingUsername(false);
      setTempUsername("");
    }
  };

  const startEditingUsername = () => {
    setTempUsername(username);
    setIsEditingUsername(true);
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
                  <Button variant="ghost" className="justify-start text-slate-300 hover:bg-slate-800 hover:text-yellow-500" onClick={() => navigate("/my-reviews")}>
                    <User className="h-4 w-4 mr-2" />
                    My Reviews
                  </Button>
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
              <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-800 hover:text-yellow-500" onClick={() => navigate("/my-reviews")}>
                My Reviews
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="sm" className="hidden lg:flex" onClick={() => navigate("/wishlist")}>
              <Bell className="h-4 w-4 mr-1" />
              <span className="hidden xl:inline">Wishlist</span>
            </Button>

            {/* Username Section */}
            {isEditingUsername ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveUsername()}
                  className="w-32 h-8 text-sm bg-slate-800 border-slate-600 text-slate-200"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveUsername} className="h-8 bg-yellow-600 hover:bg-yellow-700">
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingUsername(false)} className="h-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : username ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-slate-300 hover:bg-slate-800"
                onClick={startEditingUsername}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{username}</span>
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs md:text-sm bg-slate-700 text-yellow-500 hover:bg-slate-600 border border-slate-600"
                onClick={startEditingUsername}
              >
                Set Username
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
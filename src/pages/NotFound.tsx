import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, Film, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md animate-scaleIn">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Film className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-xl font-semibold mb-3">Movie Not Found</h2>
            <p className="text-muted-foreground mb-6">
              Oops! The page you're looking for seems to have disappeared like a movie reel in the dark.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/")}
              size="lg" 
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full"
              onClick={() => navigate("/?search=true")}
            >
              <Search className="mr-2 h-4 w-4" />
              Search Movies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

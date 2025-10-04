import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { testConnection } from "@/lib/supabase";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MovieDetailPage from "./pages/MovieDetail";
import { MyReviews } from "./pages/MyReviews";
import { Wishlist } from "./pages/Wishlist";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Test connection on app startup
    const testStartupConnection = async () => {
      console.log('🚀 App starting - testing Supabase connection...');
      const isConnected = await testConnection();
      if (isConnected) {
        console.log('✅ App startup: Supabase connection OK');
      } else {
        console.warn('⚠️ App startup: Supabase connection failed - app will run in offline mode');
      }
    };
    testStartupConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <OfflineIndicator />
          <div className="min-h-screen bg-slate-950">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
                <Route path="/my-reviews" element={<MyReviews />} />
                <Route path="/wishlist" element={<Wishlist />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

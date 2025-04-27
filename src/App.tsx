
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import Analysis from "./pages/Analysis";
import Search from "./pages/Search";
import StockDetail from "./pages/StockDetail";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";
import Settings from "./components/settings/Settings";
import { useState } from "react";
import AppLayout from "./components/layouts/AppLayout";

const queryClient = new QueryClient();

const App = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings open={true} onClose={() => setSettingsOpen(false)} />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/stocks" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Stocks />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/analysis" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Analysis />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Search />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/stocks/:symbol" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <StockDetail />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/ai-assistant" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AIAssistant />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

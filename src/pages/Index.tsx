import { useState } from "react";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import DiaryEntry from "./DiaryEntry";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<"auth" | "dashboard" | "diary">("auth");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("auth");
  };

  const navigateTo = (page: "dashboard" | "diary") => {
    setCurrentPage(page);
  };

  // Simple page routing for demo purposes
  if (currentPage === "auth" && !isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentPage === "dashboard") {
    return <Dashboard onNavigate={navigateTo} onLogout={handleLogout} />;
  }

  if (currentPage === "diary") {
    return <DiaryEntry onNavigate={navigateTo} onLogout={handleLogout} />;
  }

  // Default to dashboard if authenticated
  return <Dashboard onNavigate={navigateTo} onLogout={handleLogout} />;
};

export default Index;

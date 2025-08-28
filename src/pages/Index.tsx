import { useState } from "react";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import DiaryEntry from "./DiaryEntry";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<"auth" | "dashboard" | "diary">("auth");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple page routing for demo purposes
  if (currentPage === "auth" && !isAuthenticated) {
    return <Auth />;
  }

  if (currentPage === "dashboard") {
    return <Dashboard />;
  }

  if (currentPage === "diary") {
    return <DiaryEntry />;
  }

  // Default to dashboard if authenticated
  return <Dashboard />;
};

export default Index;

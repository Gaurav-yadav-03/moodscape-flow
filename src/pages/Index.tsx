import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DiaryEditor } from "@/components/entry/DiaryEditor";
import { Landing } from "./Landing";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "diary">("dashboard");
  const [editingEntryId, setEditingEntryId] = useState<string | undefined>();
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  const navigateTo = (page: "dashboard" | "diary", entryId?: string) => {
    setCurrentPage(page);
    if (page === "diary") {
      setEditingEntryId(entryId);
    }
  };

  const handleBack = () => {
    setCurrentPage("dashboard");
    setEditingEntryId(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center animate-pulse-soft mx-auto">
            <span className="text-white font-bold text-xl">J+</span>
          </div>
          <p className="text-muted-foreground">Loading MoodScape...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showAuth) {
      return <AuthForm onBack={() => setShowAuth(false)} />;
    }
    return <Landing onGetStarted={() => setShowAuth(true)} />;
  }

  if (currentPage === "diary") {
    return <DiaryEditor entryId={editingEntryId} onBack={handleBack} />;
  }

  return <Dashboard onNavigate={navigateTo} />;
};

export default Index;

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DiaryEditor } from "@/components/entry/DiaryEditor";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "diary">("dashboard");
  const [editingEntryId, setEditingEntryId] = useState<string | undefined>();
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
          <p className="text-muted-foreground">Loading Journal+...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (currentPage === "diary") {
    return <DiaryEditor entryId={editingEntryId} onBack={handleBack} />;
  }

  return <Dashboard onNavigate={navigateTo} />;
};

export default Index;

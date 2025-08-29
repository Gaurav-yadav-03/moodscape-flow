import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DiaryEditor } from "@/components/entry/DiaryEditor";
import { BookOpen } from "lucide-react";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "diary">("dashboard");
  const [editingEntryId, setEditingEntryId] = useState<string | undefined>();
  const { user, loading } = useAuth();

  const navigateTo = (page: "dashboard" | "diary", entryId?: string) => {
    setCurrentPage(page);
    if (page === "diary") {
      setEditingEntryId(entryId);
    } else {
      setEditingEntryId(undefined);
    }
  };

  const handleBack = () => {
    setCurrentPage("dashboard");
    setEditingEntryId(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h2 className="text-xl font-semibold text-gray-700">Loading Journal+</h2>
            <p className="text-gray-500">Preparing your personal space...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthForm />
        </motion.div>
      ) : currentPage === "diary" ? (
        <motion.div
          key="diary"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DiaryEditor entryId={editingEntryId} onBack={handleBack} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard onNavigate={navigateTo} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
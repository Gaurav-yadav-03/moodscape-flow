import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AIAction = 'summarize' | 'detect-mood' | 'reflect';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeEntry = async (content: string, action: AIAction): Promise<string | null> => {
    if (!content.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please write something in your diary entry first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-entry', {
        body: { content, action }
      });

      if (error) {
        console.error('AI analysis error:', error);
        const errorMessage = error.message || "Unable to analyze your entry. Please try again.";
        toast({
          title: "AI analysis failed",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      }

      return data.result;
    } catch (error) {
      console.error('Error calling AI function:', error);
      toast({
        title: "AI service error",
        description: "Something went wrong with the AI analysis",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTrendAnalysis = async (entries: any[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-entry', {
        body: { content: '', action: 'trend-analysis', entries }
      });

      if (error) {
        console.error('AI trend analysis error:', error);
        return null;
      }
      return data?.result;
    } catch (error) {
      console.error('Error calling trend analysis:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const summarizeEntry = (content: string) => analyzeEntry(content, 'summarize');
  const detectMood = (content: string) => analyzeEntry(content, 'detect-mood');
  const getReflection = (content: string) => analyzeEntry(content, 'reflect');

  return {
    loading,
    summarizeEntry,
    detectMood,
    getReflection,
    getTrendAnalysis,
  };
}
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { huggingFaceAI } from '@/lib/huggingface-ai';

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
      // Use local HuggingFace AI instead of edge function
      let result: string;
      
      switch (action) {
        case 'summarize':
          result = await huggingFaceAI.summarize(content);
          break;
        case 'detect-mood':
          const moodResult = await huggingFaceAI.detectMood(content);
          result = moodResult.emotion;
          break;
        case 'reflect':
          result = await huggingFaceAI.reflect(content);
          break;
        default:
          result = "Analysis not available for this action.";
      }

      return result;
    } catch (error) {
      console.error('Error with local AI analysis:', error);
      
      // Fallback to edge function if local AI fails
      try {
        const { data, error } = await supabase.functions.invoke('analyze-entry', {
          body: { content, action }
        });

        if (error) throw error;
        return data.result;
      } catch (fallbackError) {
        console.error('Fallback AI analysis also failed:', fallbackError);
        toast({
          title: "AI analysis failed",
          description: "Unable to analyze your entry. Please try again.",
          variant: "destructive",
        });
        return null;
      }
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
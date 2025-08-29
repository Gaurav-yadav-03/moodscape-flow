import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Entry } from '@/types/journal';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { getTodayDateString } from '@/lib/dateUtils';
import { analyzeEntry } from '@/lib/ai';

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      const entriesData = data || [];
      setEntries(entriesData);
      
      // Find today's entry
      const today = getTodayDateString();
      const todaysEntry = entriesData.find(entry => entry.date === today);
      setTodayEntry(todaysEntry || null);
      
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error loading entries",
        description: "Failed to load your journal entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createTodayEntry = async (entryData: Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date'>) => {
    if (!user) return { data: null, error: 'Not authenticated' };
    
    const today = getTodayDateString();
    
    // Check if entry already exists for today
    if (todayEntry) {
      return { data: null, error: 'Entry already exists for today' };
    }

    try {
      // Analyze with AI if content is substantial
      let aiAnalysis = null;
      if (entryData.content.length > 50) {
        aiAnalysis = await analyzeEntry(entryData.content);
      }

      const { data, error } = await supabase
        .from('entries')
        .insert([{
          ...entryData,
          user_id: user.id,
          date: today,
          ai_summary: aiAnalysis?.summary || null,
          ai_reflection: aiAnalysis?.reflection || null,
          mood: aiAnalysis?.detectedMood || entryData.mood
        }])
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => [data, ...prev]);
      setTodayEntry(data);
      
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved successfully",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating entry:', error);
      toast({
        title: "Failed to save",
        description: "Could not save your journal entry",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateTodayEntry = async (entryData: Partial<Entry>) => {
    if (!user || !todayEntry) return { data: null, error: 'No entry to update' };

    try {
      // Analyze with AI if content is substantial and changed
      let aiAnalysis = null;
      if (entryData.content && entryData.content.length > 50) {
        aiAnalysis = await analyzeEntry(entryData.content);
      }

      const updateData = {
        ...entryData,
        ...(aiAnalysis && {
          ai_summary: aiAnalysis.summary,
          ai_reflection: aiAnalysis.reflection,
          mood: aiAnalysis.detectedMood || entryData.mood || todayEntry.mood
        })
      };

      const { data, error } = await supabase
        .from('entries')
        .update(updateData)
        .eq('id', todayEntry.id)
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => prev.map(entry => entry.id === todayEntry.id ? data : entry));
      setTodayEntry(data);
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating entry:', error);
      return { data: null, error };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEntries(prev => prev.filter(entry => entry.id !== id));
      
      if (todayEntry?.id === id) {
        setTodayEntry(null);
      }
      
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Failed to delete",
        description: "Could not delete the entry",
        variant: "destructive",
      });
      return { error };
    }
  };

  const searchEntries = async (query: string) => {
    if (!user) return { data: [], error: 'Not authenticated' };
    
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .or(`content.ilike.%${query}%,title.ilike.%${query}%`)
        .order('date', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error searching entries:', error);
      return { data: [], error };
    }
  };

  const getStreak = () => {
    if (entries.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasEntry = entries.some(entry => entry.date === dateStr);
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  return {
    entries,
    todayEntry,
    loading,
    fetchEntries,
    createTodayEntry,
    updateTodayEntry,
    deleteEntry,
    searchEntries,
    getStreak,
  };
}
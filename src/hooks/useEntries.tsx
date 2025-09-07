import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Entry } from '@/types/journal';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
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
  };

  const createEntry = async (entryData: Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at'>, date?: string) => {
    try {
      // Fix timezone offset - get local date properly
      const now = new Date();
      const targetDate = date || new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      
      // Check if an entry already exists for the target date
      const { data: existingEntry } = await supabase
        .from('entries')
        .select('id')
        .eq('user_id', user?.id!)
        .eq('date', targetDate)
        .maybeSingle();

      if (existingEntry) {
        return { data: null, error: 'Entry already exists for this date', existingId: existingEntry.id };
      }

      const { data, error } = await supabase
        .from('entries')
        .insert([{
          ...entryData,
          date: targetDate,
          user_id: user?.id!
        }])
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating entry:', error);
      return { data: null, error };
    }
  };

  const getEntryByDate = async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user?.id!)
        .eq('date', date)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching entry for date:', error);
      return { data: null, error };
    }
  };

  const getTodaysEntry = async () => {
    const now = new Date();
    const todaysDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    return getEntryByDate(todaysDate);
  };

  const updateEntry = async (id: string, entryData: Partial<Entry>) => {
    try {
      // Filter out undefined values and ensure proper data types
      const cleanedData = Object.fromEntries(
        Object.entries(entryData).filter(([_, value]) => value !== undefined)
      );

      const { data, error } = await supabase
        .from('entries')
        .update(cleanedData)
        .eq('id', id)
        .eq('user_id', user?.id!) // Ensure user owns this entry
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      setEntries(prev => prev.map(entry => entry.id === id ? data : entry));
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating entry:', error);
      toast({
        title: "Failed to update",
        description: "Could not save your changes",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      // Hard delete for immediate removal
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id!); // Ensure user owns this entry

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      // Immediately remove from UI
      setEntries(prev => prev.filter(entry => entry.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting entry:', error);
      return { error };
    }
  };

  const searchEntries = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .or(`content.ilike.%${query}%,title.ilike.%${query}%`)
        .order('date', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error searching entries:', error);
      return { data: [], error };
    }
  };

  return {
    entries,
    loading,
    fetchEntries,
    createEntry,
      updateEntry,
      deleteEntry,
      searchEntries,
      getTodaysEntry,
      getEntryByDate,
  };
}
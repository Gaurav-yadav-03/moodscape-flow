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

  const createEntry = async (entryData: Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .insert([{
          ...entryData,
          user_id: user?.id!
        }])
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => [data, ...prev]);
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

  const updateEntry = async (id: string, entryData: Partial<Entry>) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .update(entryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => prev.map(entry => entry.id === id ? data : entry));
      toast({
        title: "Entry updated!",
        description: "Your changes have been saved",
      });
      
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
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEntries(prev => prev.filter(entry => entry.id !== id));
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
  };
}
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserSettings {
  id?: string;
  user_id: string;
  default_theme: string;
  default_font: string;
  notification_preferences: {
    autosave: boolean;
    daily_reminder: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id!)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          ...data,
          notification_preferences: typeof data.notification_preferences === 'string' 
            ? JSON.parse(data.notification_preferences) 
            : data.notification_preferences as { autosave: boolean; daily_reminder: boolean; }
        });
      } else {
        // Create default settings if none exist
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const defaultSettings = {
        user_id: user?.id!,
        default_theme: 'default',
        default_font: 'default',
        notification_preferences: { autosave: true, daily_reminder: false }
      };

      const { data, error } = await supabase
        .from('user_settings')
        .insert([defaultSettings])
        .select()
        .single();

      if (error) throw error;
      setSettings({
        ...data,
        notification_preferences: typeof data.notification_preferences === 'string' 
          ? JSON.parse(data.notification_preferences) 
          : data.notification_preferences as { autosave: boolean; daily_reminder: boolean; }
      });
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user?.id!)
        .select()
        .single();

      if (error) throw error;
      const updatedSettings = {
        ...data,
        notification_preferences: typeof data.notification_preferences === 'string' 
          ? JSON.parse(data.notification_preferences) 
          : data.notification_preferences as { autosave: boolean; daily_reminder: boolean; }
      };
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    fetchSettings
  };
}
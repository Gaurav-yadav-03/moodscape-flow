export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  title: string | null;
  content: string;
  mood: string;
  theme: string;
  font_style: string;
  ai_summary?: string | null;
  ai_reflection?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MoodOption {
  value: string;
  emoji: string;
  label: string;
  color: string;
}

export interface ThemeOption {
  value: string;
  name: string;
  background: string;
  text: string;
  preview: string;
}

export interface FontOption {
  value: string;
  name: string;
  className: string;
  preview: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 'happy', emoji: '😊', label: 'Happy', color: 'bg-emerald-500' },
  { value: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-orange-500' },
  { value: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-500' },
  { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-500' },
  { value: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-red-500' },
  { value: 'sad', emoji: '😢', label: 'Sad', color: 'bg-indigo-500' }
];

export const THEME_OPTIONS: ThemeOption[] = [
  { 
    value: 'default', 
    name: 'Clean', 
    background: 'bg-white', 
    text: 'text-gray-900',
    preview: 'bg-white border'
  },
  { 
    value: 'warm', 
    name: 'Warm', 
    background: 'bg-gradient-to-br from-orange-50 to-pink-50', 
    text: 'text-gray-800',
    preview: 'bg-gradient-to-br from-orange-100 to-pink-100'
  },
  { 
    value: 'dark', 
    name: 'Dark', 
    background: 'bg-gray-900', 
    text: 'text-gray-100',
    preview: 'bg-gray-800'
  }
];

export const FONT_OPTIONS: FontOption[] = [
  { 
    value: 'inter', 
    name: 'Inter', 
    className: 'font-sans', 
    preview: 'Modern & Clean'
  },
  { 
    value: 'serif', 
    name: 'Playfair', 
    className: 'font-serif', 
    preview: 'Elegant & Classic'
  },
  { 
    value: 'mono', 
    name: 'JetBrains Mono', 
    className: 'font-mono', 
    preview: 'Focus & Code'
  }
];

export interface AIFeatures {
  summary?: string;
  detectedMood?: string;
  reflection?: string;
}
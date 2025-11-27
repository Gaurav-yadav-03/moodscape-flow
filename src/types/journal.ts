export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  entry_theme?: string;
  entry_font?: string;
  images?: string[]; // Added images array support
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme_preference: string;
  font_preference: string;
  created_at: string;
  updated_at: string;
}

export const MOOD_OPTIONS = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: 'bg-green-500' },
  { value: 'sad', label: 'Sad', emoji: '😔', color: 'bg-blue-500' },
  { value: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-yellow-500' },
  { value: 'calm', label: 'Calm', emoji: '😌', color: 'bg-teal-500' },
  { value: 'stressed', label: 'Stressed', emoji: '😫', color: 'bg-red-500' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-gray-500' },
];

export const THEME_OPTIONS = [
  { value: 'clean', label: 'Clean White', class: 'theme-clean' },
  { value: 'minimal', label: 'Soft Gray', class: 'theme-minimal' },
  { value: 'dark', label: 'Midnight', class: 'theme-dark' },
  { value: 'vintage', label: 'Vintage Paper', class: 'theme-vintage' },
  { value: 'nature', label: 'Forest Green', class: 'theme-nature' },
  { value: 'ocean', label: 'Ocean Blue', class: 'theme-ocean' },
];

export const FONT_OPTIONS = [
  { value: 'sans', label: 'Modern Sans', class: 'font-sans' },
  { value: 'serif', label: 'Classic Serif', class: 'font-serif' },
  { value: 'mono', label: 'Typewriter', class: 'font-mono' },
];

export const getTodaysDate = () => {
  return new Date().toISOString().split('T')[0];
};
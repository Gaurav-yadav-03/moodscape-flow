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
  date: string;
  title: string | null;
  content: string;
  mood: string;
  theme: string;
  font_style: string;
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
}

export interface FontOption {
  value: string;
  name: string;
  className: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 'happy', emoji: '😊', label: 'Happy', color: 'mood-happy' },
  { value: 'excited', emoji: '🤩', label: 'Excited', color: 'mood-excited' },
  { value: 'calm', emoji: '😌', label: 'Calm', color: 'mood-calm' },
  { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'mood-neutral' },
  { value: 'stressed', emoji: '😰', label: 'Stressed', color: 'mood-stressed' },
  { value: 'sad', emoji: '😢', label: 'Sad', color: 'mood-sad' }
];

export const THEME_OPTIONS: ThemeOption[] = [
  { value: 'default', name: 'Default', background: 'bg-background', text: 'text-foreground' },
  { value: 'sunset', name: 'Sunset', background: 'bg-gradient-sunset', text: 'text-white' },
  { value: 'warm', name: 'Warm', background: 'bg-gradient-warm', text: 'text-white' }
];

export const FONT_OPTIONS: FontOption[] = [
  { value: 'default', name: 'Inter (Default)', className: 'font-inter' },
  { value: 'serif', name: 'Playfair (Elegant)', className: 'font-playfair' },
  { value: 'mono', name: 'Mono (Focus)', className: 'font-mono' }
];
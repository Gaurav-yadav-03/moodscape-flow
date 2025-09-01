import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  ArrowLeft, 
  Palette, 
  Type, 
  Smile,
  Clock,
  Calendar,
  Loader2,
  Sparkles,
  Brain,
  Heart,
  Wand2
} from 'lucide-react';
import { 
  Entry, 
  MOOD_OPTIONS, 
  THEME_OPTIONS, 
  FONT_OPTIONS,
  MoodOption,
  ThemeOption,
  FontOption,
  getTodaysDate
} from '@/types/journal';
import { useEntries } from '@/hooks/useEntries';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { StickyNotes } from './StickyNotes';
import { EmojiPicker } from './EmojiPicker';
import { cn } from '@/lib/utils';

interface DiaryEditorProps {
  entryId?: string;
  onBack: () => void;
}

export function DiaryEditor({ entryId, onBack }: DiaryEditorProps) {
  const [entry, setEntry] = useState<Partial<Entry>>({
    title: '',
    content: '',
    mood: 'neutral',
    theme: 'default',
    font_style: 'default',
    date: getTodaysDate()
  });
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiReflection, setAiReflection] = useState<string>('');
  const [customTheme, setCustomTheme] = useState<string>('default');
  const [stickyNotes, setStickyNotes] = useState<any[]>([]);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  
  const { entries, createEntry, updateEntry } = useEntries();
  const { summarizeEntry, detectMood, getReflection, loading: aiLoading } = useAI();
  const { toast } = useToast();

  // Load existing entry if editing
  useEffect(() => {
    if (entryId) {
      const existingEntry = entries.find(e => e.id === entryId);
      if (existingEntry) {
        setEntry(existingEntry);
      }
    }
  }, [entryId, entries]);

  // Auto-save functionality
  useEffect(() => {
    if (!entry.content?.trim() || !entryId) return;

    const autoSaveTimer = setTimeout(async () => {
      setAutoSaving(true);
      await updateEntry(entryId, entry);
      setAutoSaving(false);
      setLastSaved(new Date());
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [entry.content, entry.title, entry.mood, entry.theme, entry.font_style, entryId, updateEntry]);

  const handleSave = async () => {
    if (!entry.content?.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before saving",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (entryId) {
        await updateEntry(entryId, entry);
      } else {
        await createEntry({
          ...entry,
          date: getTodaysDate()
        } as Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
      }
      setLastSaved(new Date());
      onBack();
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAIMoodDetection = async () => {
    if (!entry.content?.trim()) return;
    const detectedMood = await detectMood(entry.content);
    if (detectedMood && MOOD_OPTIONS.find(m => m.value === detectedMood)) {
      setEntry(prev => ({ ...prev, mood: detectedMood }));
      toast({ title: "Mood detected!", description: `AI detected your mood as ${detectedMood}` });
    }
  };

  const selectedMood = MOOD_OPTIONS.find(m => m.value === entry.mood) || MOOD_OPTIONS[5];
  const selectedTheme = THEME_OPTIONS.find(t => t.value === entry.theme) || THEME_OPTIONS[0];
  const selectedFont = FONT_OPTIONS.find(f => f.value === entry.font_style) || FONT_OPTIONS[0];
  const wordCount = entry.content?.split(/\s+/).filter(word => word.length > 0).length || 0;

  const handleEmojiInsert = (emoji: string) => {
    if (textareaRef) {
      const start = textareaRef.selectionStart;
      const end = textareaRef.selectionEnd;
      const currentContent = entry.content || '';
      const newContent = currentContent.slice(0, start) + emoji + currentContent.slice(end);
      setEntry(prev => ({ ...prev, content: newContent }));
      
      // Restore cursor position after emoji
      setTimeout(() => {
        textareaRef.focus();
        textareaRef.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
  };

  const handleThemeChange = (theme: string, customBackground?: string) => {
    setCustomTheme(theme);
    setEntry(prev => ({ 
      ...prev, 
      theme: theme, 
      customBackground 
    }));
  };

  const getBackgroundStyle = () => {
    if (customTheme === 'custom' && entry.customBackground) {
      return {
        backgroundImage: `url(${entry.customBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    }
    
    const themeStyles = {
      default: 'gradient-bg',
      pastel: 'bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20',
      forest: 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20',
      sunset: 'bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20',
      minimal: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black'
    };
    
    return { className: themeStyles[customTheme as keyof typeof themeStyles] || themeStyles.default };
  };

  const backgroundStyle = getBackgroundStyle();

  return (
    <div 
      className={`min-h-screen ${backgroundStyle.className || ''}`}
      style={backgroundStyle.backgroundImage ? backgroundStyle : undefined}
    >
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Today's Entry</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {autoSaving && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </div>
              )}
              <Button 
                onClick={handleSave}
                disabled={saving || !entry.content?.trim()}
                className="bg-gradient-warm border-0 hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className="journal-card">
              <CardHeader>
                <Input
                  placeholder="Give your entry a title (optional)"
                  value={entry.title || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-medium border-none bg-transparent p-0 focus-visible:ring-0"
                />
                <div className="flex items-center justify-between">
                  <Badge className={`${selectedMood.color} text-white`}>
                    <span className="mr-1">{selectedMood.emoji}</span>
                    {selectedMood.label}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleAIMoodDetection} disabled={aiLoading}>
                      <Brain className="h-3 w-3 mr-1" />
                      AI Mood
                    </Button>
                    <EmojiPicker onEmojiSelect={handleEmojiInsert} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What's on your mind today?"
                  value={entry.content || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
                  ref={(ref) => setTextareaRef(ref)}
                  className={cn(
                    "min-h-[400px] resize-none border-none bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0",
                    selectedFont.className
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Selector */}
            <Card className="journal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smile className="h-5 w-5" />
                  <span>Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {MOOD_OPTIONS.map((mood: MoodOption) => (
                    <Button
                      key={mood.value}
                      variant={entry.mood === mood.value ? "default" : "outline"}
                      className={cn(
                        "justify-start h-auto p-3",
                        entry.mood === mood.value && `${mood.color} text-white`
                      )}
                      onClick={() => setEntry(prev => ({ ...prev, mood: mood.value }))}
                    >
                      <span className="mr-2">{mood.emoji}</span>
                      <span className="text-sm">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="journal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>AI Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={async () => {
                    const summary = await summarizeEntry(entry.content || '');
                    if (summary) setAiSummary(summary);
                  }}
                  disabled={aiLoading || !entry.content?.trim()}
                  className="w-full"
                  size="sm"
                >
                  <Wand2 className="h-3 w-3 mr-2" />
                  Summarize
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    const reflection = await getReflection(entry.content || '');
                    if (reflection) setAiReflection(reflection);
                  }}
                  disabled={aiLoading || !entry.content?.trim()}
                  className="w-full"
                  size="sm"
                >
                  <Heart className="h-3 w-3 mr-2" />
                  Reflect
                </Button>
                
                {/* Display AI Results */}
                {aiSummary && (
                  <div className="p-3 bg-primary/5 rounded-lg border">
                    <h4 className="font-medium text-sm mb-2">AI Summary:</h4>
                    <p className="text-sm text-muted-foreground">{aiSummary}</p>
                  </div>
                )}
                {aiReflection && (
                  <div className="p-3 bg-secondary/5 rounded-lg border">
                    <h4 className="font-medium text-sm mb-2">AI Reflection:</h4>
                    <p className="text-sm text-muted-foreground">{aiReflection}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Theme Selector */}
            <ThemeSelector 
              currentTheme={customTheme}
              onThemeChange={handleThemeChange}
            />

            {/* Sticky Notes */}
            <StickyNotes 
              notes={stickyNotes}
              onNotesChange={setStickyNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
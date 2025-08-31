import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  ArrowLeft, 
  Palette, 
  Type, 
  Smile,
  Clock,
  Calendar,
  Loader2 
} from 'lucide-react';
import { 
  Entry, 
  MOOD_OPTIONS, 
  THEME_OPTIONS, 
  FONT_OPTIONS,
  MoodOption,
  ThemeOption,
  FontOption 
} from '@/types/journal';
import { useEntries } from '@/hooks/useEntries';
import { useToast } from '@/hooks/use-toast';
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
    date: new Date().toISOString().split('T')[0]
  });
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { entries, createEntry, updateEntry } = useEntries();
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
    if (!entry.content?.trim()) return;

    const autoSaveTimer = setTimeout(async () => {
      if (entryId) {
        setAutoSaving(true);
        await updateEntry(entryId, entry);
        setAutoSaving(false);
        setLastSaved(new Date());
      }
    }, 2000);

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
        await createEntry(entry as Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
      }
      setLastSaved(new Date());
      onBack();
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const selectedMood = MOOD_OPTIONS.find(m => m.value === entry.mood) || MOOD_OPTIONS[5];
  const selectedTheme = THEME_OPTIONS.find(t => t.value === entry.theme) || THEME_OPTIONS[0];
  const selectedFont = FONT_OPTIONS.find(f => f.value === entry.font_style) || FONT_OPTIONS[0];

  const wordCount = entry.content?.split(/\s+/).filter(word => word.length > 0).length || 0;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date(entry.date || new Date()).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Auto-save indicator */}
              {autoSaving ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Saved {lastSaved.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              ) : null}

              <Button 
                onClick={handleSave}
                disabled={saving || !entry.content?.trim()}
                className="bg-gradient-warm border-0 hover:opacity-90"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="journal-card">
              <CardHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Give your entry a title (optional)"
                    value={entry.title || ''}
                    onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-medium border-none bg-transparent p-0 focus-visible:ring-0"
                  />
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={`${selectedMood.color} text-white`}>
                      <span className="mr-1">{selectedMood.emoji}</span>
                      {selectedMood.label}
                    </Badge>
                    
                    <span className="text-sm text-muted-foreground">
                      {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Textarea
                  placeholder="What's on your mind today? Start writing your thoughts..."
                  value={entry.content || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
                  className={cn(
                    "min-h-[400px] resize-none border-none bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0",
                    selectedFont.className,
                    selectedTheme.text
                  )}
                  style={{
                    background: selectedTheme.background.includes('gradient') 
                      ? `var(--gradient-${selectedTheme.value})` 
                      : undefined
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Mood Selector */}
            <Card className="journal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smile className="h-5 w-5" />
                  <span>Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {MOOD_OPTIONS.map((mood: MoodOption) => (
                    <Button
                      key={mood.value}
                      variant={entry.mood === mood.value ? "default" : "outline"}
                      className={cn(
                        "justify-start h-auto p-3",
                        entry.mood === mood.value && `${mood.color} text-white hover:opacity-90`
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

            {/* Theme Selector */}
            <Card className="journal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {THEME_OPTIONS.map((theme: ThemeOption) => (
                  <Button
                    key={theme.value}
                    variant={entry.theme === theme.value ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setEntry(prev => ({ ...prev, theme: theme.value }))}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mr-3 border"
                      style={{
                        background: theme.background.includes('gradient') 
                          ? `var(--gradient-${theme.value})`
                          : theme.background
                      }}
                    />
                    {theme.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Font Selector */}
            <Card className="journal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <span>Font Style</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {FONT_OPTIONS.map((font: FontOption) => (
                  <Button
                    key={font.value}
                    variant={entry.font_style === font.value ? "default" : "outline"}
                    className={cn("w-full justify-start", font.className)}
                    onClick={() => setEntry(prev => ({ ...prev, font_style: font.value }))}
                  >
                    {font.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Emojis */}
            <Card className="journal-card">
              <CardHeader>
                <CardTitle className="text-sm">Quick Emojis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {['❤️', '🌟', '🌈', '🎉', '💭', '✨', '🌸', '🍃'].map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-lg hover:scale-110 transition-transform"
                      onClick={() => {
                        const textarea = document.querySelector('textarea');
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const newContent = (entry.content || '').slice(0, start) + emoji + (entry.content || '').slice(end);
                          setEntry(prev => ({ ...prev, content: newContent }));
                          
                          // Restore cursor position
                          setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + emoji.length, start + emoji.length);
                          }, 0);
                        }
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
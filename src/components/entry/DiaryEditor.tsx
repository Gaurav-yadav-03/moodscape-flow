import { useState, useEffect, useCallback, useRef } from 'react';
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
  Calendar,
  Sparkles,
  Brain,
  Heart,
  Wand2,
  Trash2,
  Edit3,
  AlertTriangle
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
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { StickyNotes } from './StickyNotes';
import { EmojiPicker } from './EmojiPicker';
import { DateSelector } from './DateSelector';
import { AutosaveIndicator } from './AutosaveIndicator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface DiaryEditorProps {
  entryId?: string;
  selectedDate?: string;
  onBack: () => void;
}

export function DiaryEditor({ entryId, selectedDate, onBack }: DiaryEditorProps) {
  const [entry, setEntry] = useState<Partial<Entry>>({
    title: '',
    content: '',
    mood: 'neutral',
    theme: 'default',
    font_style: 'default',
    entry_theme: 'default',
    entry_font: 'default',
    date: selectedDate || getTodaysDate()
  });
  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiReflection, setAiReflection] = useState<string>('');
  const [customTheme, setCustomTheme] = useState<string>('default');
  const [stickyNotes, setStickyNotes] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentDate, setCurrentDate] = useState(selectedDate || getTodaysDate());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { entries, createEntry, updateEntry, deleteEntry, getEntryByDate } = useEntries();
  const { settings } = useUserSettings();
  const { summarizeEntry, detectMood, getReflection, loading: aiLoading } = useAI();
  const { toast } = useToast();

  // Load existing entry if editing or by date
  useEffect(() => {
    const loadEntry = async () => {
      if (entryId) {
        const existingEntry = entries.find(e => e.id === entryId);
        if (existingEntry) {
          setEntry(existingEntry);
          setCurrentDate(existingEntry.date);
          setCustomTheme(existingEntry.entry_theme || existingEntry.theme || 'default');
          // Load sticky notes
          try {
            const notes = existingEntry.stickyNotes ? JSON.parse(existingEntry.stickyNotes) : [];
            setStickyNotes(Array.isArray(notes) ? notes : []);
          } catch {
            setStickyNotes([]);
          }
        }
      } else if (currentDate) {
        const { data: dateEntry } = await getEntryByDate(currentDate);
        if (dateEntry) {
          setEntry(dateEntry);
          setCustomTheme(dateEntry.entry_theme || dateEntry.theme || 'default');
          // Load sticky notes
          try {
            const notes = dateEntry.stickyNotes ? JSON.parse(dateEntry.stickyNotes) : [];
            setStickyNotes(Array.isArray(notes) ? notes : []);
          } catch {
            setStickyNotes([]);
          }
        } else {
          // Apply user's default theme for new entries
          setEntry(prev => ({
            ...prev,
            theme: settings?.default_theme || 'default',
            font_style: settings?.default_font || 'default',
            entry_theme: settings?.default_theme || 'default',
            entry_font: settings?.default_font || 'default',
            date: currentDate
          }));
          setCustomTheme(settings?.default_theme || 'default');
          setStickyNotes([]);
        }
      }
    };
    
    loadEntry();
  }, [entryId, currentDate, entries, getEntryByDate, settings]);

  // Improved autosave with proper debouncing
  useEffect(() => {
    // Clear existing timeout
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Only autosave if we have an existing entry and content
    if (!entryId || !entry.content?.trim()) return;

    // Set new timeout for autosave
    autosaveTimeoutRef.current = setTimeout(async () => {
      setAutosaveStatus('saving');
      try {
        await updateEntry(entryId, entry);
        setAutosaveStatus('saved');
        setLastSaved(new Date());
        setTimeout(() => setAutosaveStatus('idle'), 2000);
      } catch (error) {
        setAutosaveStatus('error');
        setTimeout(() => setAutosaveStatus('idle'), 3000);
      }
    }, 1500); // Debounce for 1.5 seconds

    // Cleanup function
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [entry.content, entry.title, entry.mood, entryId, updateEntry]);

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
      const entryData = {
        ...entry,
        date: currentDate,
        stickyNotes: JSON.stringify(stickyNotes)
      };

      if (entryId) {
        await updateEntry(entryId, entryData);
        setLastSaved(new Date());
        onBack();
      } else {
        const result = await createEntry(entryData as Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at'>, currentDate);
        
        if (result.error && result.existingId) {
          // Entry exists, navigate to edit it
          window.history.replaceState(null, '', `?entry=${result.existingId}`);
          const existingEntry = entries.find(e => e.id === result.existingId);
          if (existingEntry) setEntry(existingEntry);
          return;
        }
        
        if (result.data) {
          setLastSaved(new Date());
          onBack();
        }
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
      toast({
        title: "Save failed",
        description: "Could not save your entry",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entryId) return;
    
    try {
      await deleteEntry(entryId);
      onBack();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete the entry",
        variant: "destructive",
      });
    }
  };

  const handleDateChange = (date: string) => {
    setCurrentDate(date);
    setEntry(prev => ({ ...prev, date }));
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

  const handleEmojiInsert = useCallback((emoji: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = entry.content || '';
      const newContent = currentContent.slice(0, start) + emoji + currentContent.slice(end);
      setEntry(prev => ({ ...prev, content: newContent }));
      
      // Restore cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
  }, [entry.content]);

  const handleThemeChange = (theme: string, customBackground?: string) => {
    setCustomTheme(theme);
    setEntry(prev => ({ 
      ...prev, 
      entry_theme: theme,
      theme: theme, 
      customBackground 
    }));
  };

  const handleFontChange = (font: string) => {
    setEntry(prev => ({ 
      ...prev, 
      entry_font: font,
      font_style: font
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
              <DateSelector 
                selectedDate={currentDate}
                onDateChange={handleDateChange}
              />
            </div>
            <div className="flex items-center space-x-4">
              <AutosaveIndicator status={autosaveStatus} lastSaved={lastSaved} />
              
              {entryId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline" 
                      size="sm"
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span>Delete Entry</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this diary entry? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Entry
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              <Button 
                onClick={handleSave}
                disabled={saving || !entry.content?.trim()}
                className="bg-gradient-warm border-0 hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                {entryId ? 'Update' : 'Save'} Entry
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
                  ref={textareaRef}
                  className={cn(
                    "min-h-[400px] resize-none border-none bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0",
                    FONT_OPTIONS.find(f => f.value === entry.entry_font)?.className || selectedFont.className
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
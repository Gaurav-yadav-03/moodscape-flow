import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  Loader2,
  Sparkles,
  Brain,
  CheckCircle
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
import { getTodayDateString, formatDateForDisplay } from '@/lib/dateUtils';

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
    font_style: 'inter',
    date: getTodayDateString()
  });
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  
  const { entries, todayEntry, createTodayEntry, updateTodayEntry } = useEntries();
  const { toast } = useToast();

  // Load today's entry if editing
  useEffect(() => {
    if (todayEntry) {
      setEntry(todayEntry);
      setShowAIFeatures(!!todayEntry.ai_summary || !!todayEntry.ai_reflection);
    }
  }, [todayEntry]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!entry.content?.trim() || entry.content.length < 10) return;

    setAutoSaving(true);
    try {
      if (todayEntry) {
        await updateTodayEntry(entry);
      } else {
        await createTodayEntry(entry as Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date'>);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [entry, todayEntry, createTodayEntry, updateTodayEntry]);

  useEffect(() => {
    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [entry.content, entry.title, entry.mood, entry.theme, entry.font_style, autoSave]);

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
      if (todayEntry) {
        await updateTodayEntry(entry);
      } else {
        await createTodayEntry(entry as Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date'>);
      }
      setLastSaved(new Date());
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved",
      });
      onBack();
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = (entry.content || '').slice(0, start) + emoji + (entry.content || '').slice(end);
      setEntry(prev => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
  };

  const selectedMood = MOOD_OPTIONS.find(m => m.value === entry.mood) || MOOD_OPTIONS[3];
  const selectedTheme = THEME_OPTIONS.find(t => t.value === entry.theme) || THEME_OPTIONS[0];
  const selectedFont = FONT_OPTIONS.find(f => f.value === entry.font_style) || FONT_OPTIONS[0];

  const wordCount = entry.content?.split(/\s+/).filter(word => word.length > 0).length || 0;
  const today = getTodayDateString();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="bg-white border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {formatDateForDisplay(today)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Auto-save indicator */}
              {autoSaving ? (
                <motion.div 
                  className="flex items-center space-x-2 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </motion.div>
              ) : lastSaved ? (
                <motion.div 
                  className="flex items-center space-x-2 text-sm text-green-600"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle className="h-3 w-3" />
                  <span>
                    Saved {lastSaved.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </span>
                </motion.div>
              ) : null}

              <Button 
                onClick={handleSave}
                disabled={saving || !entry.content?.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <motion.div 
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className={cn("shadow-sm border-0", selectedTheme.background)}>
              <CardHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Give your entry a title (optional)"
                    value={entry.title || ''}
                    onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                    className={cn(
                      "text-xl font-medium border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-gray-400",
                      selectedTheme.text
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={cn("text-white", selectedMood.color)}>
                        <span className="mr-1">{selectedMood.emoji}</span>
                        {selectedMood.label}
                      </Badge>
                      
                      <span className="text-sm text-gray-500">
                        {wordCount} {wordCount === 1 ? 'word' : 'words'}
                      </span>
                    </div>
                    
                    {(entry.ai_summary || entry.ai_reflection) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAIFeatures(!showAIFeatures)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        AI Insights
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Textarea
                  placeholder="What's on your mind today? Start writing your thoughts..."
                  value={entry.content || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
                  className={cn(
                    "min-h-[500px] resize-none border-none bg-transparent p-0 text-lg leading-relaxed focus-visible:ring-0 placeholder:text-gray-400",
                    selectedFont.className,
                    selectedTheme.text
                  )}
                />
              </CardContent>
            </Card>

            {/* AI Features Panel */}
            {showAIFeatures && (entry.ai_summary || entry.ai_reflection) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-purple-800">
                      <Brain className="h-5 w-5" />
                      <span>AI Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {entry.ai_summary && (
                      <div>
                        <Label className="text-sm font-medium text-purple-700">Summary</Label>
                        <p className="text-sm text-purple-800 mt-1">{entry.ai_summary}</p>
                      </div>
                    )}
                    
                    {entry.ai_reflection && (
                      <div>
                        <Label className="text-sm font-medium text-purple-700">Reflection</Label>
                        <p className="text-sm text-purple-800 mt-1">{entry.ai_reflection}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar Controls */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Mood Selector */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <Smile className="h-5 w-5" />
                  <span>Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {MOOD_OPTIONS.map((mood: MoodOption) => (
                    <motion.div
                      key={mood.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={entry.mood === mood.value ? "default" : "outline"}
                        className={cn(
                          "justify-start h-auto p-3 w-full",
                          entry.mood === mood.value && `${mood.color} text-white hover:opacity-90`
                        )}
                        onClick={() => setEntry(prev => ({ ...prev, mood: mood.value }))}
                      >
                        <span className="mr-2 text-lg">{mood.emoji}</span>
                        <span className="text-sm">{mood.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Theme Selector */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
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
                    <div className={cn("w-4 h-4 rounded-full mr-3", theme.preview)} />
                    {theme.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Font Selector */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
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
                    <Type className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{font.name}</div>
                      <div className="text-xs text-gray-500">{font.preview}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Emojis */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-sm text-gray-900">Quick Emojis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {['❤️', '🌟', '🌈', '🎉', '💭', '✨', '🌸', '🍃', '☀️', '🌙', '🦋', '🌺'].map((emoji) => (
                    <motion.div
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        className="h-10 w-10 p-0 text-lg hover:bg-gray-100"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Entry Stats */}
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500">Today's Progress</p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{wordCount}</p>
                    <p className="text-xs text-gray-500">words written</p>
                  </div>
                  
                  {wordCount > 50 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-2"
                    >
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Great progress!
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
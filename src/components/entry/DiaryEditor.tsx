import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Sparkles,
  StickyNote,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';
import { format } from 'date-fns';
import { useEntries } from '@/hooks/useEntries';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { WritingStats } from './WritingStats';
import { FloatingToolbar } from './FloatingToolbar';
import { AutoSaveStatus } from './AutoSaveStatus';
import { AIPanel } from './AIPanel';
import { QuickNotesPanel } from './QuickNotesPanel';
import { SettingsDropdown } from './SettingsDropdown';

interface DiaryEditorProps {
  entryId?: string;
  onBack: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function DiaryEditor({ entryId, onBack }: DiaryEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [date, setDate] = useState<Date>(new Date());
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showNotesPanel, setShowNotesPanel] = useState(true);
  const [fontFamily, setFontFamily] = useState('serif');
  const [theme, setTheme] = useState('light');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5);

  const { createEntry, updateEntry, getEntryById, loading: entriesLoading } = useEntries();

  useEffect(() => {
    if (entryId) {
      loadEntry(entryId);
    }
  }, [entryId]);

  useEffect(() => {
    if (!content && !title) return;
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 2000);
    return () => clearTimeout(timer);
  }, [content, title, mood]);

  const loadEntry = async (id: string) => {
    const { data, error } = await getEntryById(id);
    if (data && !error) {
      setTitle(data.title);
      setContent(data.content);
      setMood(data.mood || 'neutral');
      const [year, month, day] = data.date.split('-').map(Number);
      setDate(new Date(year, month - 1, day));
    }
  };

  const handleAutoSave = async () => {
    if (!content.trim() && !title.trim()) return;
    setSaveStatus('saving');
    try {
      const entryData = { title, content, mood, date: format(date, 'yyyy-MM-dd') };
      if (entryId) {
        await updateEntry(entryId, entryData);
      } else {
        const { data } = await createEntry(entryData);
        if (data) {
          window.history.replaceState({}, '', `/entry/${data.id}`);
        }
      }
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const handleFormat = (format: string) => {
    console.log('Format:', format);
  };

  const getFontClass = () => {
    switch (fontFamily) {
      case 'serif': return 'font-serif';
      case 'sans': return 'font-sans';
      case 'mono': return 'font-mono';
      default: return 'font-serif';
    }
  };

  if (entriesLoading && entryId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10">
        <div className="animate-pulse text-sm font-medium text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 relative">
      {backgroundImage && (
        <>
          <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})`, zIndex: 0 }} />
          <div className="fixed inset-0 bg-white z-[1]" style={{ opacity: Math.max(0.3, 1 - backgroundOpacity) }} />
        </>
      )}
      <div className="relative z-10 flex h-screen">
        <div className={cn("transition-all duration-300", showNotesPanel ? "w-72" : "w-0 overflow-hidden")}>
          {showNotesPanel && <QuickNotesPanel />}
        </div>
        <div className="flex-1 flex flex-col">
          <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} className="h-8 w-8 p-0 text-gray-600 hover:text-primary hover:bg-primary/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-gray-200" />
                <Button variant="ghost" size="sm" onClick={() => setShowNotesPanel(!showNotesPanel)} className={cn("h-8 w-8 p-0", showNotesPanel ? "text-primary bg-primary/10" : "text-gray-500 hover:text-primary hover:bg-primary/5")}>
                  {showNotesPanel ? <PanelLeftClose className="h-4 w-4" /> : <StickyNote className="h-4 w-4" />}
                </Button>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="h-8 px-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5">
                      {format(date, 'MMMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={(d) => { if (d) { setDate(d); setShowCalendar(false); } }} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-4">
                <AutoSaveStatus status={saveStatus} lastSaved={lastSaved} />
                <SettingsDropdown fontFamily={fontFamily} onFontChange={setFontFamily} theme={theme} onThemeChange={setTheme} backgroundImage={backgroundImage} onBackgroundChange={setBackgroundImage} backgroundOpacity={backgroundOpacity} onOpacityChange={setBackgroundOpacity} />
                <Button variant="ghost" size="sm" onClick={() => setShowAIPanel(!showAIPanel)} className={cn("h-8 w-8 p-0", showAIPanel ? "text-primary bg-primary/10" : "text-gray-500 hover:text-primary hover:bg-primary/5")}>
                  {showAIPanel ? <PanelRightClose className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>
          <FloatingToolbar onFormat={handleFormat} visible={showToolbar} />
          <main className="flex-1 overflow-y-auto">
            <div className={cn("max-w-[700px] mx-auto px-8 pt-16 pb-32", getFontClass())}>
              <div className="space-y-6">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} onFocus={() => setShowToolbar(true)} onBlur={() => setTimeout(() => setShowToolbar(false), 200)} placeholder="Entry Title" className="text-4xl font-bold border-none bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-gray-400" />
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} onFocus={() => setShowToolbar(true)} onBlur={() => setTimeout(() => setShowToolbar(false), 200)} placeholder="Start writing..." className="min-h-[60vh] resize-none border-none bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 text-lg leading-relaxed placeholder:text-gray-400" />
              </div>
            </div>
          </main>
          <div className="fixed bottom-4 right-6">
            <WritingStats content={content} />
          </div>
        </div>
        <div className={cn("transition-all duration-300", showAIPanel ? "w-80" : "w-0 overflow-hidden")}>
          {showAIPanel && <AIPanel content={content} onMoodDetected={(m) => setMood(m)} />}
        </div>
      </div>
    </div>
  );
}
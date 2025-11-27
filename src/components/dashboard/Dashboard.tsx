import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  List,
  Search,
  Plus,
  LogOut,
  Flame,
  BookOpen,
  Smile,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CalendarView } from './CalendarView';
import { EntriesListView } from './EntriesListView';
import { BadgeDisplay } from './BadgeDisplay';
import { MoodVisualization } from './MoodVisualization';
import { MoodInsights } from './MoodInsights';
import { useEntries } from '@/hooks/useEntries';
import { useStreaks } from '@/hooks/useStreaks';
import { MOOD_OPTIONS, getTodaysDate } from '@/types/journal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ExportMenu } from './ExportMenu';

interface DashboardProps {
  onNavigate: (page: "dashboard" | "diary", entryId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [view, setView] = useState<'calendar' | 'list' | 'mood' | 'badges'>('calendar');

  const { user, signOut } = useAuth();
  const { entries, loading, searchEntries, getTodaysEntry } = useEntries();
  const { currentStreak, longestStreak } = useStreaks(entries);

  const getMoodEmoji = (mood: string) => {
    return MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '😐';
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const { data } = await searchEntries(query);
    setSearchResults(data || []);
    setIsSearching(false);
  };

  const handleNewEntry = async () => {
    const { data: todaysEntry } = await getTodaysEntry();
    if (todaysEntry) {
      onNavigate('diary', todaysEntry.id);
    } else {
      onNavigate('diary');
    }
  };

  const handleEntrySelect = (entryId: string) => {
    onNavigate('diary', entryId);
  };

  const todaysEntry = entries.find(e => e.date === getTodaysDate());

  return (
    <div className="min-h-screen gradient-bg transition-colors duration-500">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 dark:bg-gray-900/80 dark:border-gray-800 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold text-foreground tracking-tight">MoodScape</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Your personal sanctuary
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Badge className="bg-primary/10 text-primary border-0 px-3 py-1 shadow-sm hidden sm:flex hover:bg-primary/20 transition-colors">
                <Flame className="h-3 w-3 mr-1" />
                {currentStreak} day streak
              </Badge>

              <Button
                onClick={handleNewEntry}
                className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-soft hover:shadow-medium transition-all"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {todaysEntry ? "Edit Today" : "New Entry"}
                </span>
                <span className="sm:hidden">Entry</span>
              </Button>

              <ExportMenu entries={entries} />
              <ThemeToggle />

              <Button variant="ghost" onClick={signOut} size="sm" className="hover:bg-muted rounded-xl">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="journal-card group cursor-pointer hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                {currentStreak}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentStreak > 0 ? "Days in a row! 🔥" : "Start your streak today!"}
              </p>
            </CardContent>
          </Card>

          <Card className="journal-card group cursor-pointer hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{entries.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Memories captured ✨
              </p>
            </CardContent>
          </Card>

          <Card className="journal-card group cursor-pointer hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Mood</CardTitle>
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {todaysEntry ? getMoodEmoji(todaysEntry.mood) : '❓'}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {todaysEntry ? 'Logged today' : 'Not logged yet'}
              </div>
              {longestStreak > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Best streak: {longestStreak} days
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-lg p-1 dark:bg-gray-800/50">
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              onClick={() => setView('calendar')}
              className="flex-1 text-xs px-2"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
              className="flex-1 text-xs px-2"
            >
              <List className="h-4 w-4 mr-1" />
              Entries
            </Button>
            <Button
              variant={view === 'mood' ? 'default' : 'outline'}
              onClick={() => setView('mood')}
              className="flex-1 text-xs px-2"
            >
              <Smile className="h-4 w-4 mr-1" />
              Mood
            </Button>
            <Button
              variant={view === 'badges' ? 'default' : 'outline'}
              onClick={() => setView('badges')}
              className="flex-1 text-xs px-2"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Badges
            </Button>
          </div>
        </div>

        {/* Views */}
        {view === 'calendar' && (
          <CalendarView
            entries={entries}
            loading={loading}
            onEntryClick={handleEntrySelect}
          />
        )}
        {view === 'list' && (
          <EntriesListView
            entries={searchQuery ? searchResults : entries}
            loading={loading || isSearching}
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onEntryClick={handleEntrySelect}
          />
        )}
        {view === 'mood' && (
          <div className="space-y-6">
            <MoodVisualization entries={entries} />
            <MoodInsights entries={entries} />
          </div>
        )}
        {view === 'badges' && (
          <BadgeDisplay entries={entries} />
        )}
      </main>
    </div>
  );
}
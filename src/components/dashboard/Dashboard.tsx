import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Loader2,
  Smile,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CalendarView } from './CalendarView';
import { EntriesListView } from './EntriesListView';
import { CompactMoodCalendar } from './CompactMoodCalendar';
import { MoodTrends } from './MoodTrends';
import { BadgeDisplay } from './BadgeDisplay';
import { MoodVisualization } from './MoodVisualization';
import { MoodInsights } from './MoodInsights';
import { useEntries } from '@/hooks/useEntries';
import { useStreaks } from '@/hooks/useStreaks';
import { MOOD_OPTIONS, getTodaysDate } from '@/types/journal';

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

  const handleDateSelect = (date: string) => {
    const entry = entries.find(e => e.date === date);
    if (entry) {
      onNavigate('diary', entry.id);
    }
  };

  const handleEntrySelect = (entryId: string) => {
    onNavigate('diary', entryId);
  };

  const todaysEntry = entries.find(e => e.date === getTodaysDate());

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center shadow-medium">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Journal+</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user?.email?.split('@')[0]}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-warm text-white border-0 px-3 py-1 shadow-soft hidden sm:flex">
                <Flame className="h-3 w-3 mr-1" />
                {currentStreak} day streak
              </Badge>

              <Button 
                onClick={handleNewEntry}
                className="bg-gradient-warm border-0 hover:opacity-90 shadow-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {todaysEntry ? "Edit Today's Entry" : "Today's Entry"}
                </span>
                <span className="sm:hidden">Entry</span>
              </Button>
              
              <Button variant="ghost" onClick={signOut} size="sm" className="hover:bg-white/20">
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
          <Card className="journal-card group cursor-pointer">
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
          
          <Card className="journal-card group cursor-pointer">
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
          
          <Card className="journal-card group cursor-pointer">
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
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-lg p-1">
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
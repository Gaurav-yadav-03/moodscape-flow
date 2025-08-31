import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  CalendarDays, 
  List, 
  Search, 
  Plus, 
  LogOut, 
  TrendingUp, 
  Flame,
  Target,
  BookOpen,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEntries } from '@/hooks/useEntries';
import { useStreaks } from '@/hooks/useStreaks';
import { CalendarView } from './CalendarView';
import { EntriesListView } from './EntriesListView';
import { MOOD_OPTIONS, getTodaysDate } from '@/types/journal';

interface DashboardProps {
  onNavigate: (page: "dashboard" | "diary", entryId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  
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
    // Check if today's entry already exists
    const { data: todaysEntry } = await getTodaysEntry();
    if (todaysEntry) {
      // Edit existing entry
      onNavigate('diary', todaysEntry.id);
    } else {
      // Create new entry
      onNavigate('diary');
    }
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
              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your entries..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64 bg-white/50 border-white/20"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Streak Badge */}
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

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-auto grid-cols-2 bg-white/50 backdrop-blur-sm">
                <TabsTrigger value="calendar" className="flex items-center space-x-2 data-[state=active]:bg-white">
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar View</span>
                  <span className="sm:hidden">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center space-x-2 data-[state=active]:bg-white">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Entries List</span>
                  <span className="sm:hidden">List</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calendar" className="space-y-4">
              <CalendarView 
                entries={entries} 
                loading={loading}
                onEntryClick={(entryId) => onNavigate('diary', entryId)}
              />
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <EntriesListView 
                entries={searchQuery ? searchResults : entries} 
                loading={loading || isSearching} 
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                onEntryClick={(entryId) => onNavigate('diary', entryId)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDays, List, Search, Plus, LogOut, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEntries } from '@/hooks/useEntries';
import { CalendarView } from './CalendarView';
import { EntriesListView } from './EntriesListView';
import { MOOD_OPTIONS } from '@/types/journal';

interface DashboardProps {
  onNavigate: (page: "dashboard" | "diary", entryId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');
  const { user, signOut } = useAuth();
  const { entries, loading } = useEntries();

  const getMoodEmoji = (mood: string) => {
    return MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '😐';
  };

  const getStreakCount = () => {
    // Simple streak calculation
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const hasEntry = entries.some(entry => entry.date === dateStr);
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be implemented in the list view
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-warm rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">J+</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Journal+</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </form>
              
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
              
              <Avatar>
                <AvatarFallback className="bg-gradient-warm text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="journal-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getStreakCount()} days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
            
            <Card className="journal-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entries.length}</div>
                <p className="text-xs text-muted-foreground">Memories captured</p>
              </CardContent>
            </Card>
            
            <Card className="journal-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Mood</CardTitle>
                <div className="text-2xl">
                  {entries.find(e => e.date === new Date().toISOString().split('T')[0]) 
                    ? getMoodEmoji(entries.find(e => e.date === new Date().toISOString().split('T')[0])?.mood || 'neutral')
                    : '❓'
                  }
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {entries.find(e => e.date === new Date().toISOString().split('T')[0]) 
                    ? 'Logged today' 
                    : 'Not logged yet'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="grid w-auto grid-cols-2">
                  <TabsTrigger value="calendar" className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Calendar</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center space-x-2">
                    <List className="h-4 w-4" />
                    <span>Entries</span>
                  </TabsTrigger>
                </TabsList>
                
                <Button 
                  className="bg-gradient-warm border-0 hover:opacity-90"
                  onClick={() => onNavigate("diary")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
              </div>

              <TabsContent value="calendar" className="space-y-4">
                <CalendarView entries={entries} loading={loading} />
              </TabsContent>

              <TabsContent value="list" className="space-y-4">
                <EntriesListView 
                  entries={entries} 
                  loading={loading} 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
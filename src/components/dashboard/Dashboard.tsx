import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDays, 
  List, 
  Search, 
  Plus, 
  LogOut, 
  Settings, 
  TrendingUp,
  BookOpen,
  Flame
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEntries } from '@/hooks/useEntries';
import { CalendarView } from './CalendarView';
import { EntriesListView } from './EntriesListView';
import { MOOD_OPTIONS } from '@/types/journal';
import { getTodayDateString, isDateToday } from '@/lib/dateUtils';

interface DashboardProps {
  onNavigate: (page: "dashboard" | "diary", entryId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');
  const { user, signOut } = useAuth();
  const { entries, todayEntry, loading, getStreak } = useEntries();

  const getMoodEmoji = (mood: string) => {
    return MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '😐';
  };

  const streak = getStreak();
  const todaysMood = todayEntry?.mood;

  const handleNewEntry = () => {
    onNavigate("diary");
  };

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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Journal+</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-10"
                />
              </div>
              
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={signOut} className="h-10 w-10">
                <LogOut className="h-4 w-4" />
              </Button>
              
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Stats Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{streak}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {streak === 0 ? 'Start your streak today!' : 'days in a row'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Entries</CardTitle>
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{entries.length}</div>
                  <p className="text-xs text-gray-500 mt-1">memories captured</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Today's Mood</CardTitle>
                  <div className="text-2xl">
                    {todaysMood ? getMoodEmoji(todaysMood) : '❓'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    {todayEntry ? 'Logged today' : 'Not logged yet'}
                  </div>
                  {todayEntry && (
                    <Badge variant="secondary" className="mt-2 capitalize">
                      {todaysMood}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-white shadow-sm">
                    <TabsTrigger value="calendar" className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>Calendar</span>
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center space-x-2">
                      <List className="h-4 w-4" />
                      <span>Entries</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                      onClick={handleNewEntry}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {todayEntry ? 'Edit Today' : 'New Entry'}
                    </Button>
                  </motion.div>
                </div>

                <TabsContent value="calendar" className="space-y-4">
                  <CalendarView entries={entries} loading={loading} onEntryClick={(entryId) => onNavigate("diary", entryId)} />
                </TabsContent>

                <TabsContent value="list" className="space-y-4">
                  <EntriesListView 
                    entries={entries} 
                    loading={loading} 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onEntryClick={(entryId) => onNavigate("diary", entryId)}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
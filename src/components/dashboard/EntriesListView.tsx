import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Clock, FileText } from 'lucide-react';
import { Entry, MOOD_OPTIONS } from '@/types/journal';
import { useEntries } from '@/hooks/useEntries';
import { formatDateForDisplay, formatDateShort } from '@/lib/dateUtils';

interface EntriesListViewProps {
  entries: Entry[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEntryClick: (entryId: string) => void;
}

export function EntriesListView({ 
  entries, 
  loading, 
  searchQuery, 
  onSearchChange,
  onEntryClick
}: EntriesListViewProps) {
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>(entries);
  const { searchEntries } = useEntries();

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        const { data } = await searchEntries(searchQuery);
        setFilteredEntries(data);
      } else {
        setFilteredEntries(entries);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, entries, searchEntries]);

  const getMoodData = (mood: string) => {
    return MOOD_OPTIONS.find(m => m.value === mood) || MOOD_OPTIONS[3];
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  const getWordCount = (content: string) => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm border-0">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i} 
                className="animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your journal entries..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {searchQuery ? 'No entries found' : 'No entries yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Try a different search term' 
                    : 'Start your journaling journey by creating your first entry'
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          filteredEntries.map((entry, index) => {
            const moodData = getMoodData(entry.mood);
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card 
                  className="bg-white shadow-sm border-0 cursor-pointer group hover:shadow-md transition-all duration-200"
                  onClick={() => onEntryClick(entry.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-medium text-gray-900">
                          {entry.title || formatDateForDisplay(entry.date)}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDateShort(entry.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(entry.created_at).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{getWordCount(entry.content)} words</span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        className={cn(
                          "text-white",
                          moodData.color
                        )}
                      >
                        <span className="mr-1">{moodData.emoji}</span>
                        {moodData.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {truncateContent(entry.content)}
                    </p>
                    
                    {/* AI Summary */}
                    {entry.ai_summary && (
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mb-4">
                        <p className="text-sm text-gray-700 italic">
                          <span className="font-medium">AI Summary:</span> {entry.ai_summary}
                        </p>
                      </div>
                    )}
                    
                    {/* AI Reflection */}
                    {entry.ai_reflection && (
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">💡 Reflection:</span> {entry.ai_reflection}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Click to read more</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
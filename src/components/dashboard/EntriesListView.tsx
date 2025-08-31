import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Clock } from 'lucide-react';
import { Entry, MOOD_OPTIONS } from '@/types/journal';
import { useEntries } from '@/hooks/useEntries';

interface EntriesListViewProps {
  entries: Entry[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function EntriesListView({ 
  entries, 
  loading, 
  searchQuery, 
  onSearchChange 
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
    return MOOD_OPTIONS.find(m => m.value === mood) || MOOD_OPTIONS[5];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Card className="journal-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="journal-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your journal entries..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="journal-card">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No entries found' : 'No entries yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Try a different search term' 
                  : 'Start your journaling journey by creating your first entry'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => {
            const moodData = getMoodData(entry.mood);
            
            return (
              <Card key={entry.id} className="journal-card cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-medium">
                        {entry.title || formatDate(entry.date)}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatTime(entry.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(entry.created_at).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary"
                        className={`${moodData.color} text-white`}
                      >
                        <span className="mr-1">{moodData.emoji}</span>
                        {moodData.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-foreground leading-relaxed">
                    {truncateContent(entry.content)}
                  </p>
                  
                  {/* Entry preview with fade effect */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{entry.content.split(' ').length} words</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to read more →
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
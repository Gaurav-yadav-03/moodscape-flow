import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMoodCalendar } from '@/hooks/useMoodCalendar';
import { Entry } from '@/types/journal';
import { Calendar, TrendingUp } from 'lucide-react';

interface MoodCalendarProps {
  entries: Entry[];
  onDateSelect?: (date: string) => void;
}

export function MoodCalendar({ entries, onDateSelect }: MoodCalendarProps) {
  const { calendar, moodStats } = useMoodCalendar(entries);

  const getDayName = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDateNumber = (date: string) => {
    return new Date(date).getDate();
  };

  return (
    <div className="space-y-6">
      {/* Mood Calendar Grid */}
      <Card className="journal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>30-Day Mood Journey</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendar.map((day, index) => {
              const dayOfWeek = new Date(day.date).getDay();
              const isToday = day.date === new Date().toISOString().split('T')[0];
              
              return (
                <div key={day.date} className="flex flex-col">
                  {index < 7 && (
                    <div className="h-2"></div>
                  )}
                  <button
                    onClick={() => onDateSelect?.(day.date)}
                    className={`
                      relative aspect-square rounded-lg border-2 transition-all
                      ${day.hasEntry 
                        ? 'border-primary bg-primary/10 hover:bg-primary/20' 
                        : 'border-border hover:border-primary/50'
                      }
                      ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {day.emoji && (
                        <span className="text-lg mb-1">{day.emoji}</span>
                      )}
                      <span className={`text-xs ${isToday ? 'font-bold' : ''}`}>
                        {getDateNumber(day.date)}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mood Statistics */}
      <Card className="journal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Mood Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{moodStats.totalEntries}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {moodStats.moodDistribution.find(m => m.mood === moodStats.mostCommonMood)?.emoji || '😐'}
              </div>
              <div className="text-sm text-muted-foreground">Most Common Mood</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Mood Distribution</h4>
            <div className="grid grid-cols-2 gap-2">
              {moodStats.moodDistribution
                .filter(m => m.count > 0)
                .sort((a, b) => b.count - a.count)
                .map(({ mood, count, percentage, emoji }) => (
                  <div key={mood} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <span>{emoji}</span>
                      <span className="text-sm capitalize">{mood}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count} ({percentage.toFixed(0)}%)
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Entry } from '@/types/journal';
import { Calendar, TrendingUp } from 'lucide-react';
import { useMoodTrends } from '@/hooks/useMoodTrends';

interface CompactMoodCalendarProps {
  entries: Entry[];
  onDateSelect?: (date: string) => void;
}

const MOOD_COLORS = {
  happy: 'bg-green-500',
  excited: 'bg-yellow-500', 
  calm: 'bg-blue-500',
  neutral: 'bg-gray-400',
  sad: 'bg-purple-500',
  stressed: 'bg-red-500'
};

export function CompactMoodCalendar({ entries, onDateSelect }: CompactMoodCalendarProps) {
  const { trendMessage, moodDistribution, averageMood } = useMoodTrends(entries);

  // Create a 30-day grid for the heatmap
  const generateCalendarData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const entry = entries.find(e => e.date === dateStr);
      days.push({
        date: dateStr,
        mood: entry?.mood || null,
        hasEntry: !!entry,
        dayOfMonth: date.getDate(),
        isToday: i === 0
      });
    }
    
    return days;
  };

  const calendarData = generateCalendarData();

  return (
    <div className="space-y-4">
      {/* Compact Heatmap Calendar */}
      <Card className="journal-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>30-Day Mood Journey</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {entries.length} entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-10 gap-1 mb-4">
            {calendarData.map((day, index) => (
              <button
                key={day.date}
                onClick={() => onDateSelect?.(day.date)}
                className={`
                  relative aspect-square rounded-sm transition-all duration-200 border
                  ${day.hasEntry 
                    ? `${MOOD_COLORS[day.mood as keyof typeof MOOD_COLORS] || 'bg-gray-300'} opacity-80 hover:opacity-100 border-gray-300` 
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                  }
                  ${day.isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                `}
                title={`${day.date}${day.hasEntry ? ` - ${day.mood}` : ''}`}
              >
                {day.isToday && (
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full border border-white" />
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-muted-foreground">Less</span>
            <div className="w-3 h-3 bg-gray-100 rounded-sm border"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-sm border"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-sm border"></div>
            <div className="w-3 h-3 bg-gray-700 rounded-sm border"></div>
            <span className="text-muted-foreground">More</span>
          </div>
        </CardContent>
      </Card>

      {/* Compact Mood Insights */}
      <Card className="journal-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <TrendingUp className="h-4 w-4" />
            <span>Mood Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Trend Message */}
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            {trendMessage}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-primary/5 rounded-lg">
              <div className="text-lg font-bold text-primary">{entries.length}</div>
              <div className="text-xs text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center p-2 bg-secondary/5 rounded-lg">
              <div className="text-lg font-bold capitalize">{averageMood}</div>
              <div className="text-xs text-muted-foreground">Most Common</div>
            </div>
          </div>

          {/* Top Moods */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Recent Patterns
            </h4>
            <div className="flex flex-wrap gap-1">
              {Object.entries(moodDistribution)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([mood, count]) => (
                  <Badge key={mood} variant="outline" className="text-xs capitalize">
                    {mood} ({count})
                  </Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
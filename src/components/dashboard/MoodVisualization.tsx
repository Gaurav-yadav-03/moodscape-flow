import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOOD_OPTIONS } from '@/types/journal';
import { useMoodCalendar } from '@/hooks/useMoodCalendar';
import { useMoodTrends } from '@/hooks/useMoodTrends';
import { useAI } from '@/hooks/useAI';
import { Entry } from '@/types/journal';

interface MoodVisualizationProps {
  entries: Entry[];
}

export function MoodVisualization({ entries }: MoodVisualizationProps) {
  const { calendar } = useMoodCalendar(entries);
  const { trendMessage, moodDistribution } = useMoodTrends(entries);
  const { getTrendAnalysis, loading } = useAI();
  const [aiMoodStory, setAiMoodStory] = React.useState<string>('');

  React.useEffect(() => {
    if (entries.length > 0) {
      getTrendAnalysis(entries.slice(-7)).then(result => {
        if (result) setAiMoodStory(result);
      });
    }
  }, [entries, getTrendAnalysis]);

  const getColorForMood = (mood?: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.value === mood);
    return moodOption ? `bg-${moodOption.color}` : 'bg-muted';
  };

  return (
    <div className="space-y-6">
      {/* Mood Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Heatmap (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {calendar.map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                {index < 7 && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </span>
                )}
                <div
                  className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs transition-colors
                    ${day.hasEntry ? getColorForMood(day.mood) : 'bg-muted/30'}
                    hover:scale-110`}
                  title={`${day.date}: ${day.mood || 'No entry'}`}
                >
                  {day.emoji}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Mood Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(moodDistribution) && moodDistribution.map((mood) => (
                <div key={mood.mood} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{mood.emoji}</span>
                    <span className="capitalize">{mood.mood}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${MOOD_OPTIONS.find(m => m.value === mood.mood)?.color || 'primary'}`}
                        style={{ width: `${mood.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {mood.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Mood Story */}
        <Card>
          <CardHeader>
            <CardTitle>AI Mood Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                {loading ? 'Analyzing your mood patterns...' : aiMoodStory || trendMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
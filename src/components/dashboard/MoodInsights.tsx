import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Sparkles, Target } from 'lucide-react';
import { Entry, MOOD_OPTIONS } from '@/types/journal';
import { format, subDays, isAfter, startOfWeek, endOfWeek } from 'date-fns';

interface MoodInsightsProps {
  entries: Entry[];
  aiInsight?: string;
}

export function MoodInsights({ entries, aiInsight }: MoodInsightsProps) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  
  // Get entries from last 7 days
  const recentEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return isAfter(entryDate, subDays(now, 7));
  });

  // Get this week's entries
  const thisWeekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  // Calculate mood distribution
  const moodCounts = recentEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = recentEntries.length;
  const moodStats = Object.entries(moodCounts)
    .map(([mood, count]) => {
      const percentage = Math.round((count / totalEntries) * 100);
      const moodOption = MOOD_OPTIONS.find(m => m.value === mood);
      return { mood, count, percentage, moodOption };
    })
    .sort((a, b) => b.count - a.count);

  // Find happiest day this week
  const happiestDay = thisWeekEntries
    .filter(entry => ['happy', 'excited'].includes(entry.mood))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Check for stress pattern
  const stressfulDays = recentEntries.filter(entry => 
    ['stressed', 'sad'].includes(entry.mood)
  ).length;

  const isStressPattern = stressfulDays >= 3;

  // Calculate streak
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let currentStreak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === currentStreak) {
      currentStreak++;
    } else if (daysDiff === currentStreak + 1 && currentStreak === 0) {
      // Allow for today not having an entry yet
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="space-y-6">
      {/* Weekly Mood Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Weekly Mood Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {moodStats.length > 0 ? (
              moodStats.map(({ mood, count, percentage, moodOption }) => (
                <div key={mood} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{moodOption?.emoji}</span>
                    <span className="font-medium capitalize">{mood}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${moodOption?.color || 'bg-primary'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Start writing entries to see your mood patterns!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Happiest Day */}
          {happiestDay && (
            <div className="flex items-center space-x-2 p-3 bg-mood-happy/10 rounded-lg">
              <span className="text-lg">🎉</span>
              <div>
                <p className="font-medium">Your happiest day this week</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(happiestDay.date), 'EEEE, MMM d')}
                  {happiestDay.title && ` - "${happiestDay.title}"`}
                </p>
              </div>
            </div>
          )}

          {/* Stress Pattern Alert */}
          {isStressPattern && (
            <div className="flex items-center space-x-2 p-3 bg-mood-stressed/10 rounded-lg">
              <span className="text-lg">💆</span>
              <div>
                <p className="font-medium">Stress levels rising</p>
                <p className="text-sm text-muted-foreground">
                  You've had {stressfulDays} challenging days recently. Consider taking a break.
                </p>
              </div>
            </div>
          )}

          {/* Writing Streak */}
          <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Writing Streak</p>
              <p className="text-sm text-muted-foreground">
                {currentStreak > 0 
                  ? `${currentStreak} day${currentStreak > 1 ? 's' : ''} in a row! Keep it up!`
                  : 'Start your writing journey today!'
                }
              </p>
            </div>
          </div>

          {/* AI Generated Insight */}
          {aiInsight && (
            <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <p className="text-sm leading-relaxed">{aiInsight}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Achievement Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentStreak >= 7 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                🏆 Week Warrior
              </Badge>
            )}
            {currentStreak >= 3 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                🔥 Consistency Champ
              </Badge>
            )}
            {moodStats[0]?.mood === 'happy' && moodStats[0]?.percentage >= 50 && (
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                😊 Optimist of the Week
              </Badge>
            )}
            {totalEntries >= 10 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                📚 Deep Thinker
              </Badge>
            )}
            {recentEntries.some(e => e.content.length > 500) && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                ✍️ Storyteller
              </Badge>
            )}
          </div>
          {/* Show message if no badges */}
          {currentStreak < 3 && totalEntries < 10 && (
            <p className="text-muted-foreground text-sm mt-2">
              Keep writing to unlock achievement badges! 🏆
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
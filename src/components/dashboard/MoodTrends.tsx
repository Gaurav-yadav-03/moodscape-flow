import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Brain, BarChart3 } from 'lucide-react';
import { useMoodTrends } from '@/hooks/useMoodTrends';
import { useAI } from '@/hooks/useAI';
import { Entry, MOOD_OPTIONS } from '@/types/journal';

interface MoodTrendsProps {
  entries: Entry[];
}

export function MoodTrends({ entries }: MoodTrendsProps) {
  const { trendMessage, moodDistribution, last7Days, last30Days, averageScore } = useMoodTrends(entries);
  const { getTrendAnalysis, loading: aiLoading } = useAI();
  const [aiInsight, setAiInsight] = useState<string>('');

  const getMoodEmoji = (mood: string) => {
    return MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '😐';
  };

  const getMoodColor = (mood: string) => {
    return MOOD_OPTIONS.find(m => m.value === mood)?.color || 'bg-gray-500';
  };

  const distributionEntries = Object.entries(moodDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const moodScoreColor = averageScore >= 4 ? 'text-green-600' : 
                        averageScore >= 3 ? 'text-blue-600' : 
                        averageScore >= 2.5 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* AI Trend Analysis */}
      <Card className="journal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Mood Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border">
              <p className="text-sm leading-relaxed text-foreground">{trendMessage}</p>
            </div>
            
            {last30Days.length >= 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const insight = await getTrendAnalysis(last30Days);
                  if (insight) setAiInsight(insight);
                }}
                disabled={aiLoading}
                className="w-full"
              >
                <Brain className="h-3 w-3 mr-2" />
                Get AI Trend Analysis
              </Button>
            )}
            
            {aiInsight && (
              <div className="p-4 bg-secondary/5 rounded-lg border">
                <h4 className="font-medium text-sm mb-2">AI Trend Analysis:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{aiInsight}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${moodScoreColor}`}>
                {averageScore.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Mood Score (7 days)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{last30Days.length}</div>
              <div className="text-xs text-muted-foreground">Entries (30 days)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mood Distribution */}
      <Card className="journal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Mood Distribution (30 days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {distributionEntries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No mood data yet. Start writing to see your patterns!
            </p>
          ) : (
            <div className="space-y-3">
              {distributionEntries.map(([mood, count]) => {
                const percentage = Math.round((count / last30Days.length) * 100);
                return (
                  <div key={mood} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getMoodEmoji(mood)}</span>
                      <span className="font-medium capitalize">{mood}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getMoodColor(mood)} transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs min-w-[60px] justify-center">
                        {count} ({percentage}%)
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="journal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split('T')[0];
              const entry = last7Days.find(e => e.date === dateStr);
              
              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
                    entry 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border bg-muted'
                  }`}>
                    {entry ? (
                      <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                    ) : (
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
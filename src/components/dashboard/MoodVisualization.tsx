import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Entry, MOOD_OPTIONS } from '@/types/journal';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MoodVisualizationProps {
  entries: Entry[];
}

export function MoodVisualization({ entries }: MoodVisualizationProps) {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 29);
  
  // Create array of last 30 days
  const days = eachDayOfInterval({
    start: thirtyDaysAgo,
    end: today
  });

  // Map entries to days
  const dayMoodMap = entries.reduce((acc, entry) => {
    const entryDate = startOfDay(new Date(entry.date));
    acc[entryDate.toISOString()] = entry;
    return acc;
  }, {} as Record<string, Entry>);

  // Prepare data for charts
  const recentEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= thirtyDaysAgo;
  });

  // Weekly mood data for bar chart
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = subDays(today, i * 7);
    const weekEnd = subDays(today, (i - 1) * 7);
    const weekEntries = recentEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate < weekEnd;
    });
    
    const moodCounts = weekEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    weeklyData.unshift({
      week: `Week ${4 - i}`,
      happy: moodCounts.happy || 0,
      excited: moodCounts.excited || 0,
      calm: moodCounts.calm || 0,
      neutral: moodCounts.neutral || 0,
      stressed: moodCounts.stressed || 0,
      sad: moodCounts.sad || 0,
    });
  }

  // Pie chart data for overall mood distribution
  const moodDistribution = MOOD_OPTIONS.map(mood => {
    const count = recentEntries.filter(entry => entry.mood === mood.value).length;
    return {
      name: mood.label,
      value: count,
      emoji: mood.emoji
    };
  }).filter(item => item.value > 0);

  const getMoodColor = (mood?: string) => {
    if (!mood) return 'bg-gray-100 dark:bg-gray-800';
    const moodOption = MOOD_OPTIONS.find(m => m.value === mood);
    return moodOption ? `${moodOption.color} opacity-80` : 'bg-gray-200';
  };

  const getMoodIntensity = (content?: string) => {
    if (!content) return 'opacity-20';
    const wordCount = content.split(' ').length;
    if (wordCount > 100) return 'opacity-100';
    if (wordCount > 50) return 'opacity-75';
    return 'opacity-50';
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  return (
    <div className="space-y-6">
      {/* GitHub-style Mood Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Heatmap - Last 30 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {/* Day labels */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-muted-foreground p-1">
                {day}
              </div>
            ))}
            
            {/* Mood squares */}
            {days.map((day, i) => {
              const dayKey = startOfDay(day).toISOString();
              const entry = dayMoodMap[dayKey];
              const isToday = startOfDay(day).getTime() === startOfDay(today).getTime();
              
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm border ${getMoodColor(entry?.mood)} ${getMoodIntensity(entry?.content)} 
                    ${isToday ? 'ring-2 ring-primary' : ''} 
                    hover:scale-110 transition-transform cursor-pointer`}
                  title={entry ? 
                    `${format(day, 'MMM d')}: ${entry.mood} ${entry.title ? `- ${entry.title}` : ''}` : 
                    `${format(day, 'MMM d')}: No entry`
                  }
                >
                  {entry && (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-xs">
                        {MOOD_OPTIONS.find(m => m.value === entry.mood)?.emoji}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>30 days ago</span>
            <div className="flex items-center space-x-1">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                <div className="w-2 h-2 bg-mood-calm opacity-25 rounded-sm"></div>
                <div className="w-2 h-2 bg-mood-happy opacity-50 rounded-sm"></div>
                <div className="w-2 h-2 bg-mood-excited opacity-75 rounded-sm"></div>
                <div className="w-2 h-2 bg-mood-happy opacity-100 rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Mood Trends Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Mood Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="happy" fill="#10b981" name="Happy" />
              <Bar dataKey="excited" fill="#f59e0b" name="Excited" />
              <Bar dataKey="calm" fill="#06b6d4" name="Calm" />
              <Bar dataKey="neutral" fill="#6b7280" name="Neutral" />
              <Bar dataKey="stressed" fill="#ef4444" name="Stressed" />
              <Bar dataKey="sad" fill="#8b5cf6" name="Sad" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Overall Mood Distribution Pie Chart */}
      {moodDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, emoji, value, percent }) => 
                    `${emoji} ${name}: ${value} (${(percent || 0).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
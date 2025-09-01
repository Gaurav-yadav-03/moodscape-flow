import { useMemo } from 'react';
import { Entry, MOOD_OPTIONS } from '@/types/journal';

export interface MoodCalendarDay {
  date: string;
  mood?: string;
  emoji?: string;
  hasEntry: boolean;
  entryId?: string;
}

export function useMoodCalendar(entries: Entry[]) {
  const moodCalendar = useMemo(() => {
    const calendar: MoodCalendarDay[] = [];
    const today = new Date();
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const entry = entries.find(e => e.date === dateStr);
      const moodOption = entry ? MOOD_OPTIONS.find(m => m.value === entry.mood) : null;
      
      calendar.push({
        date: dateStr,
        mood: entry?.mood,
        emoji: moodOption?.emoji,
        hasEntry: !!entry,
        entryId: entry?.id
      });
    }
    
    return calendar;
  }, [entries]);

  const moodStats = useMemo(() => {
    const stats = MOOD_OPTIONS.reduce((acc, mood) => {
      acc[mood.value] = entries.filter(e => e.mood === mood.value).length;
      return acc;
    }, {} as Record<string, number>);

    const totalEntries = entries.length;
    const mostCommonMood = Object.entries(stats).reduce((a, b) => 
      stats[a[0]] > stats[b[0]] ? a : b
    )[0];

    return {
      stats,
      totalEntries,
      mostCommonMood,
      moodDistribution: Object.entries(stats).map(([mood, count]) => ({
        mood,
        count,
        percentage: totalEntries > 0 ? (count / totalEntries) * 100 : 0,
        emoji: MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '😐'
      }))
    };
  }, [entries]);

  return {
    calendar: moodCalendar,
    moodStats
  };
}
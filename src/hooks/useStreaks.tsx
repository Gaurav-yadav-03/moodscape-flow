import { useMemo } from 'react';
import { Entry } from '@/types/journal';

export function useStreaks(entries: Entry[]) {
  const streakData = useMemo(() => {
    if (!entries.length) return { currentStreak: 0, longestStreak: 0 };

    // Sort entries by date
    const sortedEntries = entries
      .map(entry => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime());

    // Get unique dates
    const uniqueDates = Array.from(
      new Set(sortedEntries.map(date => date.toDateString()))
    ).map(dateStr => new Date(dateStr));

    if (!uniqueDates.length) return { currentStreak: 0, longestStreak: 0 };

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's an entry today
    const hasEntryToday = uniqueDates.some(date => {
      const entryDate = new Date(date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    // Start from today if there's an entry, or yesterday if not
    let checkDate = new Date(today);
    if (!hasEntryToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count backwards from today/yesterday
    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = new Date(uniqueDates[i]);
      entryDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const prevDate = new Date(uniqueDates[i - 1]);
      
      const dayDiff = Math.abs((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }, [entries]);

  return streakData;
}
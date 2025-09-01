import { useMemo } from 'react';
import { Entry } from '@/types/journal';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'streak' | 'depth' | 'mood' | 'special';
}

export function useBadges(entries: Entry[]) {
  const badges = useMemo(() => {
    const badgeList: Badge[] = [
      // Streak badges
      {
        id: 'first_entry',
        name: 'First Steps',
        description: 'Created your first journal entry',
        icon: '🌱',
        earned: false,
        category: 'streak'
      },
      {
        id: 'consistency_3',
        name: 'Getting Started',
        description: '3 days writing streak',
        icon: '🔥',
        earned: false,
        category: 'streak'
      },
      {
        id: 'consistency_7',
        name: 'Consistency Champ',
        description: '7 days writing streak',
        icon: '💪',
        earned: false,
        category: 'streak'
      },
      {
        id: 'consistency_30',
        name: 'Monthly Master',
        description: '30 days writing streak',
        icon: '👑',
        earned: false,
        category: 'streak'
      },
      // Depth badges
      {
        id: 'deep_thinker',
        name: 'Deep Thinker',
        description: 'Wrote an entry with 500+ words',
        icon: '🧠',
        earned: false,
        category: 'depth'
      },
      {
        id: 'novelist',
        name: 'Aspiring Novelist',
        description: 'Wrote an entry with 1000+ words',
        icon: '📚',
        earned: false,
        category: 'depth'
      },
      // Mood badges
      {
        id: 'resilient_soul',
        name: 'Resilient Soul',
        description: 'Logged entry despite difficult mood',
        icon: '💫',
        earned: false,
        category: 'mood'
      },
      {
        id: 'joy_spreader',
        name: 'Joy Spreader',
        description: 'Logged 5 happy entries',
        icon: '😊',
        earned: false,
        category: 'mood'
      },
      // Special badges
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Wrote entry before 6 AM',
        icon: '🌅',
        earned: false,
        category: 'special'
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Wrote entry after 10 PM',
        icon: '🦉',
        earned: false,
        category: 'special'
      }
    ];

    // Calculate badge earnings
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // First entry
    if (entries.length > 0) {
      const firstEntry = badgeList.find(b => b.id === 'first_entry');
      if (firstEntry) {
        firstEntry.earned = true;
        firstEntry.earnedDate = sortedEntries[0].date;
      }
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const uniqueDates = Array.from(
      new Set(entries.map(entry => entry.date))
    ).sort().reverse();

    let checkDate = new Date(today);
    const hasEntryToday = uniqueDates.includes(today.toISOString().split('T')[0]);
    if (!hasEntryToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (const dateStr of uniqueDates) {
      const entryDate = new Date(dateStr);
      entryDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Streak badges
    if (currentStreak >= 3) {
      const badge = badgeList.find(b => b.id === 'consistency_3');
      if (badge) badge.earned = true;
    }
    if (currentStreak >= 7) {
      const badge = badgeList.find(b => b.id === 'consistency_7');
      if (badge) badge.earned = true;
    }
    if (currentStreak >= 30) {
      const badge = badgeList.find(b => b.id === 'consistency_30');
      if (badge) badge.earned = true;
    }

    // Deep thinking badges
    const hasLongEntry = entries.some(entry => (entry.content?.length || 0) > 500);
    const hasVeryLongEntry = entries.some(entry => (entry.content?.length || 0) > 1000);
    
    if (hasLongEntry) {
      const badge = badgeList.find(b => b.id === 'deep_thinker');
      if (badge) badge.earned = true;
    }
    if (hasVeryLongEntry) {
      const badge = badgeList.find(b => b.id === 'novelist');
      if (badge) badge.earned = true;
    }

    // Mood badges
    const sadMoods = ['sad', 'stressed', 'angry'];
    const hasDifficultMoodEntry = entries.some(entry => sadMoods.includes(entry.mood));
    if (hasDifficultMoodEntry) {
      const badge = badgeList.find(b => b.id === 'resilient_soul');
      if (badge) badge.earned = true;
    }

    const happyEntries = entries.filter(entry => entry.mood === 'happy').length;
    if (happyEntries >= 5) {
      const badge = badgeList.find(b => b.id === 'joy_spreader');
      if (badge) badge.earned = true;
    }

    // Time-based badges (would need created_at timestamp for accurate detection)
    // For now, just mark as possible to earn

    return badgeList;
  }, [entries]);

  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = badges.length;

  return {
    badges,
    earnedBadges,
    totalBadges,
    earnedCount: earnedBadges.length
  };
}
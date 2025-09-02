import { useMemo } from 'react';
import { Entry } from '@/types/journal';

export function useMoodTrends(entries: Entry[]) {
  const analysis = useMemo(() => {
    if (entries.length === 0) {
      return {
        last7Days: [],
        last30Days: [],
        trendMessage: "Start writing to see your mood trends!",
        moodDistribution: {},
        averageMood: 'neutral'
      };
    }

    const today = new Date();
    const last7Days = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff < 7;
    });

    const last30Days = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff < 30;
    });

    // Mood scoring system
    const moodScores: Record<string, number> = {
      'excited': 5,
      'happy': 4,
      'calm': 3,
      'neutral': 3,
      'sad': 2,
      'stressed': 1,
      'angry': 1
    };

    // Calculate mood distribution
    const moodDistribution: Record<string, number> = {};
    last30Days.forEach(entry => {
      moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
    });

    // Calculate average mood for last 7 days
    const recentMoodScores = last7Days.map(entry => moodScores[entry.mood] || 3);
    const averageScore = recentMoodScores.length > 0 
      ? recentMoodScores.reduce((sum, score) => sum + score, 0) / recentMoodScores.length
      : 3;

    // Determine trend message based on analysis
    let trendMessage = "";
    const mostCommonMood = Object.entries(moodDistribution)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

    if (last7Days.length < 3) {
      trendMessage = "Write more entries to see your mood patterns!";
    } else if (averageScore >= 4) {
      trendMessage = "You've been feeling great lately! Keep up the positive energy! ✨";
    } else if (averageScore >= 3.5) {
      trendMessage = "Your mood has been pretty stable. You're doing well! 😊";
    } else if (averageScore >= 2.5) {
      trendMessage = "You seem to be going through some ups and downs. Take care of yourself! 💙";
    } else {
      trendMessage = "It looks like you've been having a tough time. Remember, it's okay to ask for help. 🤗";
    }

    // Add specific insights
    if (mostCommonMood === 'stressed' && last7Days.filter(e => e.mood === 'stressed').length >= 3) {
      trendMessage += " Try some relaxation techniques or take breaks when you can.";
    } else if (mostCommonMood === 'excited' || mostCommonMood === 'happy') {
      trendMessage += " Your positive energy is shining through!";
    }

    return {
      last7Days,
      last30Days,
      trendMessage,
      moodDistribution,
      averageMood: mostCommonMood,
      averageScore
    };
  }, [entries]);

  return analysis;
}
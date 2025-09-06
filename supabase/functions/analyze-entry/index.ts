import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/);
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
  
  const keywords = words
    .filter(word => word.length > 3 && !commonWords.has(word))
    .reduce((acc: Record<string, number>, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
    
  return Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);
}

function analyzeSentiment(text: string) {
  const positiveWords = ['happy', 'joy', 'love', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'good', 'beautiful', 'perfect', 'awesome', 'brilliant', 'excellent', 'pleased', 'grateful', 'thankful', 'blessed', 'content', 'peaceful', 'calm', 'relaxed', 'optimistic', 'hopeful', 'confident'];
  const negativeWords = ['sad', 'angry', 'hate', 'terrible', 'awful', 'horrible', 'bad', 'worse', 'worst', 'disappointed', 'frustrated', 'stressed', 'worried', 'anxious', 'depressed', 'upset', 'annoyed', 'irritated', 'lonely', 'hurt', 'pain', 'suffering', 'difficult', 'hard', 'struggle'];
  
  const words = text.toLowerCase().split(/\W+/);
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  const score = (positiveCount - negativeCount) / Math.max(words.length / 10, 1);
  
  let description = '';
  if (score > 0.3) description = 'This reflects a positive, uplifting tone.';
  else if (score < -0.3) description = 'This shows some challenging emotions.';
  else description = 'This has a balanced, neutral emotional tone.';
  
  return { 
    score, 
    positiveWords: words.filter(w => positiveWords.includes(w)),
    negativeWords: words.filter(w => negativeWords.includes(w)),
    description 
  };
}

async function getLocalSummary(content: string): Promise<string> {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length <= 2) return content.substring(0, 200) + (content.length > 200 ? '...' : '');
  
  const keywords = extractKeywords(content);
  const sentiment = analyzeSentiment(content);
  
  // Get key sentences with importance scoring
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    
    // First and last sentences are important
    if (index === 0 || index === sentences.length - 1) score += 2;
    
    // Sentences with keywords are important
    keywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword.toLowerCase())) score += 1;
    });
    
    // Emotional sentences are important
    if (sentiment.positiveWords.some(word => sentence.toLowerCase().includes(word)) ||
        sentiment.negativeWords.some(word => sentence.toLowerCase().includes(word))) {
      score += 1;
    }
    
    return { sentence: sentence.trim(), score };
  }).sort((a, b) => b.score - a.score);
  
  const topSentences = scoredSentences.slice(0, 2).map(s => s.sentence);
  const summary = topSentences.join('. ') + '.';
  
  return `${summary} Main themes include ${keywords.slice(0, 2).join(' and ')}. ${sentiment.description}`;
}

async function getLocalMoodAnalysis(content: string): Promise<string> {
  const words = content.toLowerCase().split(/\W+/);
  
  const moodPatterns = {
    happy: ['happy', 'joy', 'joyful', 'love', 'amazing', 'wonderful', 'great', 'awesome', 'fantastic', 'perfect', 'brilliant', 'delighted', 'cheerful', 'optimistic', 'grateful', 'blessed', 'smile', 'laugh'],
    excited: ['excited', 'thrilled', 'energetic', 'pumped', 'enthusiastic', 'adventure', 'party', 'celebration', 'achievement', 'success', 'victory', 'breakthrough', 'opportunity', 'ambitious', 'motivated'],
    calm: ['calm', 'peaceful', 'serene', 'quiet', 'tranquil', 'relaxed', 'meditation', 'mindful', 'balanced', 'centered', 'zen', 'gentle', 'soothing', 'comfortable', 'content'],
    stressed: ['stressed', 'pressure', 'deadline', 'busy', 'overwhelmed', 'anxious', 'worried', 'tense', 'frantic', 'rushing', 'chaos', 'burden', 'exhausted', 'tired', 'difficult'],
    sad: ['sad', 'down', 'depressed', 'lonely', 'hurt', 'disappointed', 'lost', 'empty', 'broken', 'crying', 'tears', 'grief', 'sorrow', 'melancholy', 'blue', 'heartbroken'],
    neutral: ['okay', 'fine', 'normal', 'regular', 'usual', 'routine', 'typical']
  };
  
  const scores: Record<string, number> = {};
  
  // Calculate mood scores with weighted importance
  Object.entries(moodPatterns).forEach(([mood, keywords]) => {
    scores[mood] = keywords.reduce((score, keyword) => {
      const matches = words.filter(word => word.includes(keyword) || keyword.includes(word)).length;
      return score + matches;
    }, 0);
  });
  
  // Apply contextual weights
  const textLength = words.length;
  if (textLength > 100) scores.calm += 0.5; // Longer entries suggest reflection
  
  // Find dominant mood
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'neutral';
  
  const dominantMood = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
  return dominantMood || 'neutral';
}

async function getLocalReflection(content: string): Promise<string> {
  const keywords = extractKeywords(content);
  const sentiment = analyzeSentiment(content);
  const wordCount = content.split(' ').length;
  const words = content.toLowerCase().split(/\W+/);
  
  // Enhanced context-aware reflections
  if (sentiment.score > 0.4) {
    const positiveTheme = keywords.find(k => ['success', 'achievement', 'happy', 'joy', 'love', 'grateful'].some(p => k.includes(p))) || 'growth';
    return `Your positive energy around ${positiveTheme} really shines through! This kind of mindset creates momentum for even more good things ahead.`;
  } 
  
  if (sentiment.score < -0.3) {
    const challenge = keywords.find(k => ['work', 'relationship', 'health', 'stress', 'difficult'].some(c => k.includes(c))) || 'this situation';
    return `I can sense you're working through some challenges with ${challenge}. Your ability to express these feelings shows emotional intelligence. Better days are coming.`;
  }
  
  if (words.some(w => ['goal', 'plan', 'future', 'want', 'hope', 'dream'].includes(w))) {
    return `Your forward-thinking approach and ${wordCount > 150 ? 'detailed planning' : 'clear intentions'} show great self-awareness. Small consistent steps lead to big changes.`;
  }
  
  if (wordCount > 200) {
    return `Your thoughtful, detailed reflection shows how much you value personal growth. This kind of self-examination is a powerful tool for positive change.`;
  }
  
  const mainTheme = keywords[0] || 'life';
  return `Your honest reflection on ${mainTheme} demonstrates mindfulness and emotional maturity. Keep nurturing this self-awareness—it's a real strength.`;
}

async function getLocalTrendAnalysis(entries: any[]): Promise<string> {
  if (entries.length === 0) return "Start writing more entries to see your patterns!";
  
  const recentEntries = entries.slice(-7);
  const moodCounts = recentEntries.reduce((acc: any, entry: any) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});
  
  const dominantMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];
  
  if (dominantMood === 'happy' || dominantMood === 'excited') {
    return "You've been in great spirits lately! Your positive energy is shining through your entries.";
  } else if (dominantMood === 'stressed' || dominantMood === 'sad') {
    return "You seem to be going through a challenging time. Remember to take care of yourself and reach out for support when needed.";
  } else {
    return "Your mood has been relatively balanced recently. You're managing life's ups and downs well.";
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, action, entries } = await req.json();

    if (!content && action !== 'trend-analysis') {
      return new Response(
        JSON.stringify({ error: 'Content is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Action is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let result = '';
    
    console.log('Using enhanced local AI');
    result = await getLocalFallback(action, content, entries);

    return new Response(
      JSON.stringify({ result }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-entry function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getLocalFallback(action: string, content: string, entries?: any[]): Promise<string> {
  switch (action) {
    case 'summarize':
      return await getLocalSummary(content);
    case 'detect-mood':
      return await getLocalMoodAnalysis(content);
    case 'reflect':
      return await getLocalReflection(content);
    case 'trend-analysis':
      return await getLocalTrendAnalysis(entries || []);
    default:
      return 'Action not supported.';
  }
}

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Local AI fallback functions
async function getLocalMoodAnalysis(content: string): Promise<string> {
  const moodKeywords = {
    happy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'fantastic', 'love', 'blessed'],
    sad: ['sad', 'depressed', 'down', 'upset', 'cry', 'tears', 'lonely', 'hurt', 'pain'],
    excited: ['excited', 'thrilled', 'pumped', 'energetic', 'anticipating', 'eager', 'hyped'],
    calm: ['calm', 'peaceful', 'relaxed', 'tranquil', 'serene', 'quiet', 'meditative'],
    stressed: ['stressed', 'anxious', 'worried', 'overwhelmed', 'pressure', 'tense', 'panic'],
    neutral: ['okay', 'fine', 'normal', 'regular', 'usual', 'standard']
  };
  
  const text = content.toLowerCase();
  let maxScore = 0;
  let detectedMood = 'neutral';
  
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    const score = keywords.reduce((acc, keyword) => {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      return acc + matches;
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      detectedMood = mood;
    }
  }
  
  return detectedMood;
}

async function getLocalSummary(content: string): Promise<string> {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const importantSentences = sentences
    .slice(0, 3)
    .map(s => s.trim())
    .join('. ');
  
  return importantSentences.length > 100 
    ? importantSentences.substring(0, 97) + '...'
    : importantSentences || 'A brief reflection on your day.';
}

async function getLocalReflection(content: string): Promise<string> {
  const positiveWords = ['accomplished', 'learned', 'grew', 'helped', 'succeeded', 'improved'];
  const hasPositive = positiveWords.some(word => content.toLowerCase().includes(word));
  
  if (hasPositive) {
    return "Great work today! You're making progress and growing. Keep focusing on the positive steps you're taking.";
  } else if (content.toLowerCase().includes('difficult') || content.toLowerCase().includes('hard')) {
    return "It sounds like today had its challenges. Remember that difficult days help us grow stronger. Be gentle with yourself.";
  } else {
    return "Every day is a step forward in your journey. Take time to appreciate the small moments and your efforts today.";
  }
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

    // Use local AI if OpenAI key is not available or if API fails
    const useLocalAI = !openAIApiKey;
    
    if (useLocalAI) {
      console.log('Using local AI fallback');
      let result = '';
      
      switch (action) {
        case 'summarize':
          result = await getLocalSummary(content);
          break;
        case 'detect-mood':
          result = await getLocalMoodAnalysis(content);
          break;
        case 'reflect':
          result = await getLocalReflection(content);
          break;
        case 'trend-analysis':
          result = await getLocalTrendAnalysis(entries || []);
          break;
        default:
          return new Response(
            JSON.stringify({ error: 'Invalid action' }), 
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
      }
      
      return new Response(
        JSON.stringify({ result }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'summarize':
        systemPrompt = 'You are a helpful assistant that creates concise, meaningful summaries of diary entries. Keep it under 100 words and capture the main emotions and events.';
        userPrompt = `Please summarize this diary entry: "${content}"`;
        break;
      case 'detect-mood':
        systemPrompt = 'You are an emotion detection assistant. Analyze the text and return only one of these exact mood values: happy, sad, excited, calm, stressed, neutral. Return only the mood word, nothing else.';
        userPrompt = `Analyze the mood of this diary entry: "${content}"`;
        break;
      case 'reflect':
        systemPrompt = 'You are a supportive reflection assistant. Provide a brief, encouraging reflection or tip based on the diary entry. Keep it under 150 words and be positive and supportive.';
        userPrompt = `Provide a supportive reflection for this diary entry: "${content}"`;
        break;
      case 'trend-analysis':
        systemPrompt = 'You are a mood trend analyst. Analyze the recent diary entries and provide insights about mood patterns, trends, and encouraging observations. Keep it under 200 words.';
        userPrompt = `Analyze these recent diary entries for mood trends: ${JSON.stringify(entries)}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: summarize, detect-mood, reflect, or trend-analysis' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: action === 'detect-mood' ? 10 : 200,
        temperature: action === 'detect-mood' ? 0.1 : 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      // Fallback to local AI if OpenAI fails
      console.log('OpenAI failed, falling back to local AI');
      let result = '';
      
      switch (action) {
        case 'summarize':
          result = await getLocalSummary(content);
          break;
        case 'detect-mood':
          result = await getLocalMoodAnalysis(content);
          break;
        case 'reflect':
          result = await getLocalReflection(content);
          break;
        case 'trend-analysis':
          result = await getLocalTrendAnalysis(entries || []);
          break;
        default:
          result = 'AI analysis temporarily unavailable';
      }
      
      return new Response(
        JSON.stringify({ result }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const result = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ result }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-entry function:', error);
    
    // Final fallback to local AI
    try {
      const { content, action, entries } = await req.json();
      let result = '';
      
      switch (action) {
        case 'summarize':
          result = await getLocalSummary(content || '');
          break;
        case 'detect-mood':
          result = await getLocalMoodAnalysis(content || '');
          break;
        case 'reflect':
          result = await getLocalReflection(content || '');
          break;
        case 'trend-analysis':
          result = await getLocalTrendAnalysis(entries || []);
          break;
        default:
          result = 'Analysis temporarily unavailable';
      }
      
      return new Response(
        JSON.stringify({ result }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return new Response(
        JSON.stringify({ result: 'AI analysis temporarily unavailable' }), 
        { 
          status: 200, // Return 200 to prevent client errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  }
});
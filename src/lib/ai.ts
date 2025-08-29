import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface AIAnalysis {
  summary: string;
  detectedMood: string;
  reflection: string;
}

export async function analyzeEntry(content: string): Promise<AIAnalysis | null> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return null;
  }

  if (!content.trim() || content.length < 50) {
    return null;
  }

  try {
    const prompt = `
Analyze this diary entry and provide:
1. A brief 1-2 sentence summary
2. The dominant mood (choose from: happy, excited, calm, neutral, stressed, sad)
3. A positive reflection or tip (1-2 sentences)

Diary entry: "${content}"

Respond in JSON format:
{
  "summary": "Brief summary here",
  "detectedMood": "mood_here",
  "reflection": "Positive reflection here"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) return null;

    return JSON.parse(result);
  } catch (error) {
    console.error('AI analysis failed:', error);
    return null;
  }
}
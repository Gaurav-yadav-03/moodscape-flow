import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { content, action } = await req.json();

    if (!content || !action) {
      return new Response(
        JSON.stringify({ error: 'Content and action are required' }), 
        { 
          status: 400, 
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
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: summarize, detect-mood, or reflect' }), 
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
      console.error('OpenAI API error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ error: 'AI service unavailable' }), 
        { 
          status: 500, 
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
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
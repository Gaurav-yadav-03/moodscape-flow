import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface MoodDetectionResult {
  emotion: string;
  confidence: number;
  emotions: Array<{ emotion: string; score: number }>;
}

export class HuggingFaceAI {
  private summarizer: any = null;
  private emotionClassifier: any = null;
  private textGenerator: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing HuggingFace AI models...');
      
      // Initialize models in parallel
      const [summarizer, emotionClassifier, textGenerator] = await Promise.all([
        pipeline('summarization', 'facebook/bart-large-cnn', { device: 'webgpu' }),
        pipeline('text-classification', 'j-hartmann/emotion-english-distilroberta-base', { device: 'webgpu' }),
        pipeline('text-generation', 'Xenova/gpt2', { device: 'webgpu' })
      ]);

      this.summarizer = summarizer;
      this.emotionClassifier = emotionClassifier;
      this.textGenerator = textGenerator;
      this.isInitialized = true;
      
      console.log('HuggingFace AI models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize HuggingFace models:', error);
      throw error;
    }
  }

  async summarize(text: string): Promise<string> {
    try {
      await this.initialize();
      
      if (!text.trim() || text.length < 50) {
        return text.substring(0, 100) + (text.length > 100 ? '...' : '');
      }

      // Clean and prepare text for summarization
      const cleanText = text.replace(/\n+/g, ' ').trim();
      
      const result = await this.summarizer(cleanText, {
        max_length: 150,
        min_length: 30,
        do_sample: false,
      });

      return result[0]?.summary_text || cleanText.substring(0, 200) + '...';
    } catch (error) {
      console.error('Summarization failed:', error);
      // Fallback to simple extraction
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
      return sentences.slice(0, 2).join('. ') + '.';
    }
  }

  async reflect(text: string): Promise<string> {
    try {
      await this.initialize();
      
      if (!text.trim()) {
        return "Take a moment to reflect on your thoughts and feelings today.";
      }

      const prompt = `Reflect on the following diary entry and give a short, empathetic reflection:\n\n"${text}"\n\nReflection:`;
      
      const result = await this.textGenerator(prompt, {
        max_new_tokens: 100,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false,
      });

      let reflection = result[0]?.generated_text || '';
      
      // Clean up the generated text
      reflection = reflection.replace(/^Reflection:\s*/i, '').trim();
      reflection = reflection.split('\n')[0]; // Take first line only
      
      if (reflection.length < 20) {
        return this.generateContextualReflection(text);
      }

      return reflection;
    } catch (error) {
      console.error('Reflection generation failed:', error);
      return this.generateContextualReflection(text);
    }
  }

  async detectMood(text: string): Promise<MoodDetectionResult> {
    try {
      await this.initialize();
      
      if (!text.trim()) {
        return {
          emotion: 'neutral',
          confidence: 0.5,
          emotions: [{ emotion: 'neutral', score: 0.5 }]
        };
      }

      const result = await this.emotionClassifier(text);
      
      // Map emotion labels to our mood system
      const emotionMapping: Record<string, string> = {
        'joy': 'happy',
        'happiness': 'happy',
        'excitement': 'excited',
        'love': 'happy',
        'sadness': 'sad',
        'fear': 'stressed',
        'anger': 'stressed',
        'anxiety': 'stressed',
        'disgust': 'sad',
        'surprise': 'excited',
        'calm': 'calm',
        'neutral': 'neutral'
      };

      const topEmotion = result[0];
      const mappedEmotion = emotionMapping[topEmotion.label.toLowerCase()] || 'neutral';
      
      // Convert all emotions to our format
      const emotions = result.map((emotion: any) => ({
        emotion: emotionMapping[emotion.label.toLowerCase()] || emotion.label,
        score: emotion.score
      }));

      return {
        emotion: mappedEmotion,
        confidence: topEmotion.score,
        emotions: emotions
      };
    } catch (error) {
      console.error('Mood detection failed:', error);
      return this.fallbackMoodDetection(text);
    }
  }

  private generateContextualReflection(text: string): string {
    const words = text.toLowerCase().split(/\W+/);
    const wordCount = text.split(' ').length;
    
    // Context-aware reflection templates
    if (words.some(w => ['work', 'job', 'meeting', 'deadline', 'project'].includes(w))) {
      return "Work challenges are opportunities for growth. Your dedication shows in your writing.";
    }
    
    if (words.some(w => ['family', 'friend', 'relationship', 'love'].includes(w))) {
      return "The connections you write about show how much you value relationships. That's beautiful.";
    }
    
    if (words.some(w => ['stress', 'worried', 'anxious', 'difficult'].includes(w))) {
      return "It takes courage to acknowledge difficult feelings. You're processing them thoughtfully.";
    }
    
    if (words.some(w => ['happy', 'excited', 'amazing', 'wonderful', 'great'].includes(w))) {
      return "Your positive energy radiates through your words. These moments of joy deserve celebration.";
    }
    
    if (wordCount > 150) {
      return "Your detailed reflection shows deep self-awareness. This kind of introspection is powerful.";
    }
    
    return "Your honest expression of thoughts and feelings shows emotional intelligence and growth.";
  }

  private fallbackMoodDetection(text: string): MoodDetectionResult {
    const words = text.toLowerCase().split(/\W+/);
    
    const moodKeywords = {
      happy: ['happy', 'joy', 'excited', 'amazing', 'wonderful', 'great', 'love', 'perfect'],
      sad: ['sad', 'down', 'disappointed', 'hurt', 'lonely', 'crying', 'upset'],
      stressed: ['stress', 'anxious', 'worried', 'overwhelmed', 'pressure', 'busy'],
      excited: ['excited', 'thrilled', 'energetic', 'adventure', 'party', 'celebration'],
      calm: ['calm', 'peaceful', 'relaxed', 'quiet', 'serene', 'meditation']
    };

    const scores: Record<string, number> = {};
    
    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      scores[mood] = keywords.reduce((count, keyword) => {
        return count + words.filter(word => word.includes(keyword)).length;
      }, 0);
    });

    const totalWords = words.length;
    const dominantMood = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0];

    const emotion = dominantMood?.[0] || 'neutral';
    const confidence = Math.min((dominantMood?.[1] || 0) / Math.max(totalWords / 10, 1), 1);

    return {
      emotion,
      confidence: confidence || 0.5,
      emotions: Object.entries(scores).map(([emotion, score]) => ({
        emotion,
        score: score / Math.max(totalWords / 10, 1)
      }))
    };
  }
}

export const huggingFaceAI = new HuggingFaceAI();
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
        return text.trim();
      }

      // Use actual Hugging Face summarization model
      const result = await this.summarizer(text, {
        max_length: 100,
        min_length: 30,
        do_sample: false
      });

      return result[0].summary_text;
    } catch (error) {
      console.error('Summarization failed, using fallback:', error);

      // Better fallback that extracts key themes and paraphrases
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
      if (sentences.length <= 2) return text.trim();

      // Extract themes and create a more intelligent summary
      const themes = this.extractThemes(text);
      const emotions = this.extractEmotions(text);

      // Create a factual summary based on content analysis
      if (themes.work && emotions.positive) {
        return `The entry describes productive work activities and successful outcomes.`;
      } else if (themes.relationships && emotions.mixed) {
        return `The text details interactions with others and the complexity of these relationships.`;
      } else if (emotions.stressed) {
        return `The entry outlines specific challenges faced and the difficulties encountered.`;
      } else if (emotions.excited) {
        return `The writing lists energetic activities and positive forward momentum.`;
      }

      // Generic factual fallback
      return `The entry discusses ${themes.main || 'personal experiences'} and records observations about these events.`;
    }
  }

  private extractThemes(text: string) {
    const words = text.toLowerCase();
    return {
      work: /work|job|meeting|project|deadline|office|career/.test(words),
      relationships: /family|friend|love|relationship|partner|social/.test(words),
      health: /health|exercise|tired|energy|sleep|medical/.test(words),
      travel: /travel|trip|vacation|journey|visit|explore/.test(words),
      learning: /learn|study|read|discover|understand|knowledge/.test(words),
      main: words.includes('work') ? 'professional development' :
        words.includes('friend') ? 'social connections' :
          words.includes('family') ? 'family bonds' : 'personal experiences'
    };
  }

  private extractEmotions(text: string) {
    const words = text.toLowerCase();
    return {
      positive: /happy|joy|excited|amazing|wonderful|great|love/.test(words),
      stressed: /stress|anxious|worried|overwhelmed|difficult|hard/.test(words),
      excited: /excited|thrilled|energetic|amazing|awesome/.test(words),
      mixed: /but|however|although|mixed|complex/.test(words),
      dominant: words.includes('stress') ? 'challenging' :
        words.includes('excited') ? 'enthusiastic' :
          words.includes('happy') ? 'uplifting' : 'reflective'
    };
  }

  async reflect(text: string): Promise<string> {
    if (!text.trim()) {
      return "Take a moment to reflect on your thoughts and feelings today.";
    }

    // Always generate contextual reflection based on content
    return this.generateContextualReflection(text);
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

      // Map emotion labels to our mood system - fixed excited mapping
      const emotionMapping: Record<string, string> = {
        'joy': 'excited',
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
    const trimmed = text.trim();
    // Extract sentences from the actual diary content
    const sentences = trimmed.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
    const words = trimmed.toLowerCase().split(/\W+/);

    // Pull out key phrases directly from the entry to personalize the reflection
    const firstSentence = sentences[0] || trimmed.slice(0, 80);
    const lastSentence = sentences[sentences.length - 1] || firstSentence;

    // Detect emotional tone
    const isPositive = /happy|joy|excited|amazing|wonderful|great|good|got|finally|love|proud|succeed|achiev|hired|job|won|passed/i.test(trimmed);
    const isNegative = /sad|down|disappoint|hurt|lonely|cry|upset|stress|anxious|worried|overwhelm|hard|difficult|struggle|tired|failed/i.test(trimmed);
    const isAchievement = /finally|got|hired|promoted|passed|won|achieved|succeeded|offer|milestone|dream/i.test(trimmed);
    const isReflective = /think|feel|realize|wonder|remind|remember|miss|hope|wish/i.test(trimmed);

    if (isAchievement && isPositive) {
      return `You wrote about something meaningful: "${firstSentence}". This kind of moment — where effort meets reward — is worth sitting with. What did it take to get here, and who supported you along the way?`;
    }

    if (isPositive) {
      return `Your entry captures a genuinely good moment: "${firstSentence}". What made today feel this way, and how can you carry this energy forward?`;
    }

    if (isNegative) {
      return `You wrote: "${firstSentence}". It sounds like today brought some weight. What's one small thing that could shift how you feel, even slightly?`;
    }

    if (isReflective) {
      return `You reflected: "${firstSentence}". These thoughts reveal what matters to you. What would you want to remember about this moment a year from now?`;
    }

    if (sentences.length > 1) {
      return `You captured two threads today — starting with "${firstSentence}" and ending on "${lastSentence}". What's the thread connecting these ideas?`;
    }

    return `You wrote: "${firstSentence}". What prompted this thought today, and what does it say about what you're currently focused on?`;
  }

  private fallbackMoodDetection(text: string): MoodDetectionResult {
    const words = text.toLowerCase().split(/\W+/);

    const moodKeywords = {
      excited: ['excited', 'thrilled', 'energetic', 'adventure', 'party', 'celebration', 'joy', 'amazing', 'finally', 'got', 'achieved', 'succeeded', 'hired', 'promotion', 'promoted', 'passed', 'won', 'milestone'],
      happy: ['happy', 'wonderful', 'great', 'love', 'perfect', 'good', 'pleased', 'glad', 'job', 'offer', 'accepted', 'blessed', 'lucky', 'proud', 'grateful'],
      sad: ['sad', 'down', 'disappointed', 'hurt', 'lonely', 'crying', 'upset', 'miss', 'lost', 'failed', 'rejected'],
      stressed: ['stress', 'anxious', 'worried', 'overwhelmed', 'pressure', 'busy', 'tired', 'exhausted', 'deadline', 'problem'],
      calm: ['calm', 'peaceful', 'relaxed', 'quiet', 'serene', 'meditation', 'easy', 'fine', 'okay']
    };

    const scores: Record<string, number> = {};

    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      scores[mood] = keywords.reduce((count, keyword) => {
        return count + words.filter(word => word.includes(keyword)).length;
      }, 0);
    });

    const totalWords = words.length;
    const dominantMood = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)[0];

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
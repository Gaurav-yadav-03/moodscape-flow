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
    const words = text.toLowerCase().split(/\W+/);
    const wordCount = text.split(' ').length;

    // Context-aware reflection templates - Strictly Analytical & Content-Based
    if (words.some(w => ['work', 'job', 'meeting', 'deadline', 'project', 'career'].includes(w))) {
      const workReflections = [
        "The entry centers on professional responsibilities and the specific challenges encountered in the work environment.",
        "This passage highlights a focus on career-related tasks and the outcomes of recent professional efforts.",
        "The writing describes a sequence of work-related events and the immediate reactions to professional demands."
      ];
      return workReflections[Math.floor(Math.random() * workReflections.length)];
    }

    if (words.some(w => ['family', 'friend', 'relationship', 'love', 'partner', 'connect'].includes(w))) {
      const relReflections = [
        "The text focuses on interpersonal dynamics and specific interactions with close connections.",
        "This entry details recent social exchanges and the specific nature of current relationships.",
        "The content describes the state of personal bonds and the events affecting them."
      ];
      return relReflections[Math.floor(Math.random() * relReflections.length)];
    }

    if (words.some(w => ['stress', 'worried', 'anxious', 'difficult', 'hard', 'struggle'].includes(w))) {
      const stressReflections = [
        "The entry describes a situation characterized by high pressure and the specific difficulties being faced.",
        "The tone indicates a response to challenging circumstances and details the stressors involved.",
        "The writing outlines current obstacles and the immediate impact of these difficulties."
      ];
      return stressReflections[Math.floor(Math.random() * stressReflections.length)];
    }

    if (words.some(w => ['happy', 'excited', 'amazing', 'wonderful', 'great', 'joy', 'grateful'].includes(w))) {
      const joyReflections = [
        "The entry records positive events and the specific favorable outcomes experienced today.",
        "The text describes a series of successful or enjoyable moments and the resulting satisfaction.",
        "The content highlights specific achievements or pleasant occurrences and the immediate positive reaction."
      ];
      return joyReflections[Math.floor(Math.random() * joyReflections.length)];
    }

    if (wordCount > 150) {
      return "The entry provides a detailed account of recent events, elaborating on specific thoughts and the sequence of occurrences.";
    }

    return "The entry records current thoughts and observations regarding recent experiences.";
  }

  private fallbackMoodDetection(text: string): MoodDetectionResult {
    const words = text.toLowerCase().split(/\W+/);

    const moodKeywords = {
      excited: ['excited', 'thrilled', 'energetic', 'adventure', 'party', 'celebration', 'joy', 'amazing'],
      happy: ['happy', 'wonderful', 'great', 'love', 'perfect', 'good', 'pleased'],
      sad: ['sad', 'down', 'disappointed', 'hurt', 'lonely', 'crying', 'upset'],
      stressed: ['stress', 'anxious', 'worried', 'overwhelmed', 'pressure', 'busy'],
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
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAI } from '@/hooks/useAI';
import { useState } from 'react';
import { toast } from 'sonner';

interface AIPanelProps {
    content: string;
    onMoodDetected?: (mood: string) => void;
}

export function AIPanel({ content, onMoodDetected }: AIPanelProps) {
    const { detectMood, getReflection, summarizeEntry, loading } = useAI();
    const [reflection, setReflection] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Validate if content is meaningful
    const isContentMeaningful = (text: string): boolean => {
        const trimmed = text.trim();
        if (trimmed.length < 10) return false;

        const words = trimmed.split(/\s+/).filter(w => w.length > 0);
        if (words.length < 3) return false;

        const alphaCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
        const ratio = alphaCount / trimmed.length;
        if (ratio < 0.5) return false;

        return true;
    };

    const handleDetectMood = async () => {
        if (!content.trim()) {
            toast.error('Write something first');
            return;
        }
        if (!isContentMeaningful(content)) {
            toast.error('Please write meaningful content for analysis');
            return;
        }
        setActiveSection('mood');
        const mood = await detectMood(content);
        if (mood && onMoodDetected) {
            onMoodDetected(mood);
            toast.success('Mood detected!');
        }
        setActiveSection(null);
    };

    const handleReflection = async () => {
        if (!content.trim()) {
            toast.error('Write something first');
            return;
        }
        if (!isContentMeaningful(content)) {
            toast.error('Please write meaningful content for reflection');
            return;
        }
        setActiveSection('reflection');
        const result = await getReflection(content);
        if (result) {
            setReflection(result);
        }
        setActiveSection(null);
    };

    const handleSummarize = async () => {
        if (!content.trim()) {
            toast.error('Write something first');
            return;
        }
        if (!isContentMeaningful(content)) {
            toast.error('Please write meaningful content to summarize');
            return;
        }
        setActiveSection('summary');
        const result = await summarizeEntry(content);
        if (result) {
            setSummary(result);
        }
        setActiveSection(null);
    };

    return (
        <div className="w-80 border-l border-primary/20 bg-white/95 backdrop-blur-md h-full overflow-y-auto shadow-lg">
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Detect Mood</h4>
                    <p className="text-sm text-gray-600">Analyze your entry's emotional tone</p>
                    <Button
                        onClick={handleDetectMood}
                        disabled={loading || !content.trim()}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-gray-700 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    >
                        {activeSection === 'mood' && loading ? (
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        ) : (
                            <Sparkles className="h-3 w-3 mr-2" />
                        )}
                        Detect Mood
                    </Button>
                </div>

                <div className="space-y-2 pt-4 border-t border-primary/10">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Get Reflection</h4>
                    <p className="text-sm text-gray-600">Receive thoughtful prompts</p>
                    <Button
                        onClick={handleReflection}
                        disabled={loading || !content.trim()}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-gray-700 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    >
                        {activeSection === 'reflection' && loading ? (
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        ) : (
                            <Sparkles className="h-3 w-3 mr-2" />
                        )}
                        Generate Reflection
                    </Button>
                    {reflection && (
                        <div className="mt-3 p-3 bg-primary/5 rounded-lg text-sm text-gray-700 leading-relaxed border border-primary/10">
                            {reflection}
                        </div>
                    )}
                </div>

                <div className="space-y-2 pt-4 border-t border-primary/10">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Summarize</h4>
                    <p className="text-sm text-gray-600">Get a concise summary</p>
                    <Button
                        onClick={handleSummarize}
                        disabled={loading || !content.trim()}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-gray-700 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    >
                        {activeSection === 'summary' && loading ? (
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        ) : (
                            <Sparkles className="h-3 w-3 mr-2" />
                        )}
                        Create Summary
                    </Button>
                    {summary && (
                        <div className="mt-3 p-3 bg-primary/5 rounded-lg text-sm text-gray-700 leading-relaxed border border-primary/10">
                            {summary}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

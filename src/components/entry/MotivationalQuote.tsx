import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const QUOTES = [
    "Every word you write is a step towards understanding yourself.",
    "Your thoughts matter. Your story matters. You matter.",
    "Writing is the mirror of the mind. Reflect freely.",
    "Today's feelings are tomorrow's wisdom.",
    "In these pages, you are safe to be completely yourself.",
    "Small moments, when captured, become treasured memories.",
    "Your journey is unique. Document it with love.",
    "Writing heals what words cannot express.",
    "This is your sanctuary. Write without judgment.",
    "Every entry is a gift to your future self.",
];

export function MotivationalQuote() {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Get quote based on day of year for daily rotation
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        setQuote(QUOTES[dayOfYear % QUOTES.length]);
    }, []);

    return (
        <div className="flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-700">
            <Sparkles className="h-4 w-4 text-primary/60 flex-shrink-0" />
            <p className="text-sm italic text-muted-foreground/80 font-light">
                {quote}
            </p>
        </div>
    );
}

interface WritingStatsProps {
    content: string;
}

export function WritingStats({ content }: WritingStatsProps) {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const charCount = content.length;

    return (
        <div className="text-xs font-medium text-gray-300 hover:text-gray-500 transition-colors cursor-default select-none">
            {wordCount} words
        </div>
    );
}

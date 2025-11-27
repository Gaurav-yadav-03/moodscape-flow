import { Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered, Highlighter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FloatingToolbarProps {
    onFormat: (format: string) => void;
    visible?: boolean;
}

export function FloatingToolbar({ onFormat, visible = true }: FloatingToolbarProps) {
    const tools = [
        { icon: Bold, format: 'bold', label: 'Bold' },
        { icon: Italic, format: 'italic', label: 'Italic' },
        { icon: Underline, format: 'underline', label: 'Underline' },
        { type: 'separator' },
        { icon: Heading1, format: 'h1', label: 'Heading 1' },
        { icon: Heading2, format: 'h2', label: 'Heading 2' },
        { type: 'separator' },
        { icon: List, format: 'bullet', label: 'Bullet List' },
        { icon: ListOrdered, format: 'number', label: 'Numbered List' },
        { type: 'separator' },
        { icon: Highlighter, format: 'highlight', label: 'Highlight' },
    ];

    return (
        <div
            className={cn(
                'fixed top-24 left-1/2 -translate-x-1/2 z-40 transition-all duration-200 ease-out',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            )}
        >
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-1 py-1 flex items-center gap-0.5">
                {tools.map((tool, index) => {
                    if (tool.type === 'separator') {
                        return <div key={index} className="w-px h-4 bg-gray-200 mx-1" />;
                    }

                    const Icon = tool.icon!;
                    return (
                        <Button
                            key={tool.format}
                            variant="ghost"
                            size="sm"
                            onClick={() => onFormat(tool.format!)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                            title={tool.label}
                        >
                            <Icon className="h-4 w-4" />
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}

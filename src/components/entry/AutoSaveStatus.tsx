import { Loader2, Check } from 'lucide-react';

interface AutoSaveStatusProps {
    status: 'idle' | 'saving' | 'saved' | 'error';
    lastSaved?: Date;
}

export function AutoSaveStatus({ status }: AutoSaveStatusProps) {
    if (status === 'idle') return null;

    return (
        <div className="flex items-center gap-1.5">
            {status === 'saving' && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Saving</span>
                </div>
            )}
            {status === 'saved' && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 animate-in fade-in duration-300">
                    <Check className="h-3 w-3" />
                    <span>Saved</span>
                </div>
            )}
            {status === 'error' && (
                <span className="text-xs text-red-500 font-medium">Save failed</span>
            )}
        </div>
    );
}

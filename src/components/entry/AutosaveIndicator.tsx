import React from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface AutosaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
}

export function AutosaveIndicator({ status, lastSaved }: AutosaveIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'saved':
        return <Check className="h-3 w-3" />;
      case 'error':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return lastSaved ? `All changes saved ✓` : 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  const getColorClass = () => {
    switch (status) {
      case 'saving':
        return 'text-primary';
      case 'saved':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  // Only show when actively saving or if there was an error
  if (status === 'idle') return null;
  
  // For saved status, show briefly then fade
  if (status === 'saved') {
    return (
      <div className={`flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 ${getColorClass()}`}>
        {getIcon()}
        <span>{getText()}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full bg-muted/50 backdrop-blur-sm border ${getColorClass()}`}>
      {getIcon()}
      <span>{getText()}</span>
    </div>
  );
}
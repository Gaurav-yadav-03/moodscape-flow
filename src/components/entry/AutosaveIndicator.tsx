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
        return lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  const getColorClass = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-600';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  if (status === 'idle') return null;

  return (
    <div className={`flex items-center space-x-2 text-xs ${getColorClass()}`}>
      {getIcon()}
      <span>{getText()}</span>
    </div>
  );
}
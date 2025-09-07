import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { THEME_OPTIONS } from '@/types/journal';
import { Check, Upload } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const handleThemeClick = (themeValue: string) => {
    console.log('Theme clicked:', themeValue);
    onThemeChange(themeValue);
    
    // Force immediate visual update
    setTimeout(() => {
      const writingArea = document.querySelector('.writing-area') as HTMLElement;
      if (writingArea) {
        const theme = THEME_OPTIONS.find(t => t.value === themeValue);
        if (theme) {
          writingArea.className = 'writing-area p-6 min-h-[600px] rounded-lg transition-all duration-300 ' + theme.background;
        }
      }
    }, 50);
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Choose Theme</h3>
        
        <div className="grid grid-cols-2 gap-2">
          {THEME_OPTIONS.map((theme) => (
            <Button
              key={theme.value}
              variant={currentTheme === theme.value ? "default" : "outline"}
              className="h-auto p-3 flex flex-col items-center space-y-1"
              onClick={() => handleThemeClick(theme.value)}
            >
              <div className={`w-8 h-8 rounded ${theme.background} border`} />
              <span className="text-xs">{theme.name}</span>
              {currentTheme === theme.value && <Check className="h-3 w-3" />}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
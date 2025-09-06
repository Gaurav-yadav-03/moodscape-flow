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
              onClick={() => onThemeChange(theme.value)}
            >
              <div className={`w-8 h-8 rounded ${theme.background} border`} />
              <span className="text-xs">{theme.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
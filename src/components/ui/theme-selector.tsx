import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Upload, Check } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  preview: string;
  background?: string;
  backgroundImage?: string;
}

const PRESET_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Clean',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800',
    background: 'default'
  },
  {
    id: 'pastel',
    name: 'Pastel Dreams',
    preview: 'bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100',
    background: 'pastel'
  },
  {
    id: 'forest',
    name: 'Forest Calm',
    preview: 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
    background: 'forest'
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    preview: 'bg-gradient-to-br from-orange-100 via-red-50 to-pink-100',
    background: 'sunset'
  },
  {
    id: 'minimal',
    name: 'Minimal Dark',
    preview: 'bg-gradient-to-br from-gray-900 to-black',
    background: 'minimal'
  }
];

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string, customBackground?: string) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [customImage, setCustomImage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomImageSubmit = () => {
    if (customImage.trim()) {
      onThemeChange('custom', customImage.trim());
      setCustomImage('');
      setShowCustomInput(false);
    }
  };

  return (
    <Card className="journal-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Theme & Background</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Themes */}
        <div className="grid grid-cols-2 gap-3">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`
                relative p-3 rounded-lg border-2 transition-all group
                ${currentTheme === theme.id 
                  ? 'border-primary shadow-md' 
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className={`w-full h-16 rounded ${theme.preview} mb-2`} />
              <div className="text-xs font-medium text-center">{theme.name}</div>
              {currentTheme === theme.id && (
                <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Background */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Custom Background
          </Button>

          {showCustomInput && (
            <div className="space-y-2">
              <Label htmlFor="custom-bg">Image URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-bg"
                  placeholder="https://example.com/image.jpg"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                />
                <Button 
                  onClick={handleCustomImageSubmit}
                  disabled={!customImage.trim()}
                >
                  Apply
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a URL to your custom background image
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { THEME_OPTIONS } from '@/types/journal';
import { Check, Upload } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string, customBackground?: string) => void;
  customBackground?: string;
}

export function ThemeSelector({ currentTheme, onThemeChange, customBackground }: ThemeSelectorProps) {
  const [uploadedImage, setUploadedImage] = React.useState<string>(customBackground || '');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        onThemeChange('custom', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Choose Theme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Default Themes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEME_OPTIONS.map((theme) => (
            <Button
              key={theme.value}
              variant={currentTheme === theme.value ? "default" : "outline"}
              className={`h-20 relative overflow-hidden ${theme.background} ${theme.text} hover:scale-105 transition-transform`}
              onClick={() => onThemeChange(theme.value)}
            >
              {currentTheme === theme.value && (
                <Check className="absolute top-2 right-2 h-4 w-4" />
              )}
              <span className="relative z-10 font-medium">{theme.name}</span>
            </Button>
          ))}
        </div>

        {/* Custom Background Upload */}
        <div className="space-y-3">
          <Label htmlFor="background-upload" className="text-sm font-medium">
            Custom Background
          </Label>
          <div className="flex items-center space-x-3">
            <Input
              id="background-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
            />
            <Button
              variant={currentTheme === 'custom' ? "default" : "outline"}
              size="sm"
              className="shrink-0"
              onClick={() => document.getElementById('background-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          
          {uploadedImage && (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Custom background preview"
                className="w-full h-24 object-cover rounded-md border"
              />
              {currentTheme === 'custom' && (
                <Check className="absolute top-2 right-2 h-4 w-4 text-white bg-black/50 rounded" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
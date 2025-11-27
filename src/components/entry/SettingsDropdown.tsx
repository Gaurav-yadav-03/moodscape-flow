import { Settings, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface SettingsDropdownProps {
    fontFamily: string;
    onFontChange: (font: string) => void;
    theme: string;
    onThemeChange: (theme: string) => void;
    backgroundImage?: string;
    onBackgroundChange: (url: string) => void;
    backgroundOpacity: number;
    onOpacityChange: (opacity: number) => void;
}

export function SettingsDropdown({
    fontFamily,
    onFontChange,
    theme,
    onThemeChange,
    backgroundImage,
    onBackgroundChange,
    backgroundOpacity,
    onOpacityChange,
}: SettingsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onBackgroundChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase">
                    Appearance
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Font Family */}
                <div className="px-2 py-2">
                    <p className="text-xs font-medium text-gray-500 mb-2">Font</p>
                    <DropdownMenuRadioGroup value={fontFamily} onValueChange={onFontChange}>
                        <DropdownMenuRadioItem value="serif" className="text-sm">
                            Serif
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="sans" className="text-sm">
                            Sans Serif
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="mono" className="text-sm">
                            Monospace
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </div>

                <DropdownMenuSeparator />

                {/* Theme */}
                <div className="px-2 py-2">
                    <p className="text-xs font-medium text-gray-500 mb-2">Theme</p>
                    <DropdownMenuRadioGroup value={theme} onValueChange={onThemeChange}>
                        <DropdownMenuRadioItem value="light" className="text-sm">
                            Light
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dark" className="text-sm">
                            Dark
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="auto" className="text-sm">
                            Auto
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </div>

                <DropdownMenuSeparator />

                {/* Background Image */}
                <div className="px-2 py-2 space-y-3">
                    <p className="text-xs font-medium text-gray-500">Background</p>
                    <label className="block">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="bg-upload"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => document.getElementById('bg-upload')?.click()}
                            type="button"
                        >
                            <Upload className="h-3 w-3 mr-2" />
                            {backgroundImage ? 'Change Image' : 'Upload Image'}
                        </Button>
                    </label>

                    {backgroundImage && (
                        <>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Opacity</span>
                                    <span>{Math.round(backgroundOpacity * 100)}%</span>
                                </div>
                                <Slider
                                    value={[backgroundOpacity]}
                                    onValueChange={(value) => onOpacityChange(value[0])}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    className="w-full"
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => onBackgroundChange('')}
                            >
                                Remove Background
                            </Button>
                        </>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

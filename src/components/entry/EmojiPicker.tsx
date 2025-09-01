import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const EMOJI_CATEGORIES = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'],
  nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌲', '🌳', '🌴', '🍀', '🌿', '🌱', '🌾', '🦋', '🐝', '🐞', '🦋', '🌈', '☀️', '🌙', '⭐', '✨', '🔥', '💧', '🌊'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🎿', '🛷', '⛸️', '🛼', '🛹', '⛹️', '🏋️', '🤸', '🧘', '🎨', '🎭', '🎪', '🎰'],
  food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕'],
  objects: ['💎', '🔮', '💰', '💳', '💸', '🎁', '🎀', '🎊', '🎉', '🎈', '🏆', '🥇', '🥈', '🥉', '⚽', '🏀', '🏈', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💾', '💿', '📀', '☎️', '📞', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏰', '⏱️', '⏲️', '⏰', '🕰️']
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('faces');

  const filteredEmojis = searchTerm 
    ? Object.values(EMOJI_CATEGORIES).flat().filter(emoji => 
        emoji.includes(searchTerm)
      )
    : EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Smile className="h-4 w-4 mr-2" />
          Emoji
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="bottom" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emojis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {!searchTerm && (
          <div className="flex border-b">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-1 p-2 text-xs capitalize transition-colors ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-8 gap-1 p-3 max-h-64 overflow-y-auto">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => onEmojiSelect(emoji)}
              className="aspect-square flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
        
        {filteredEmojis.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Smile className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No emojis found</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
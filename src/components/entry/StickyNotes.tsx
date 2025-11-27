import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, X } from 'lucide-react';

export interface StickyNoteType {
  id: string;
  text: string;
  color: string;
  timestamp: string;
}

interface StickyNotesProps {
  notes: StickyNoteType[];
  onNotesChange: (notes: StickyNoteType[]) => void;
}

const NOTE_COLORS = [
  'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700',
  'bg-pink-100 border-pink-300 dark:bg-pink-900/20 dark:border-pink-700',
  'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700',
  'bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700',
  'bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700'
];

export function StickyNotes({ notes, onNotesChange }: StickyNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      const note: StickyNoteType = {
        id: Date.now().toString(),
        text: newNote.trim(),
        color: NOTE_COLORS[notes.length % NOTE_COLORS.length],
        timestamp: new Date().toLocaleTimeString()
      };
      onNotesChange([...notes, note]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const removeNote = (id: string) => {
    onNotesChange(notes.filter(note => note.id !== id));
  };

  const updateNote = (id: string, text: string) => {
    onNotesChange(notes.map(note =>
      note.id === id ? { ...note, text } : note
    ));
  };

  return (
    <Card className="journal-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            <StickyNote className="h-4 w-4" />
            <span>Quick Notes</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add New Note */}
        {isAdding && (
          <div className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 animate-in fade-in slide-in-from-top-2 duration-200">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[60px] text-sm border-none bg-transparent p-0 resize-none focus-visible:ring-0"
              placeholder="Add a quick note..."
              autoFocus
            />
            <div className="flex space-x-2 mt-2">
              <Button onClick={addNote} size="sm" disabled={!newNote.trim()}>
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing Notes */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`relative p-3 rounded-lg border ${note.color} shadow-sm transition-all hover:shadow-md`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNote(note.id)}
                className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
              <Textarea
                value={note.text}
                onChange={(e) => updateNote(note.id, e.target.value)}
                className="min-h-[60px] text-sm border-none bg-transparent p-0 resize-none focus-visible:ring-0 text-foreground"
                placeholder="Quick thought..."
              />
              <div className="text-[10px] text-muted-foreground mt-1 text-right">
                {note.timestamp}
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No quick notes yet. Click + to add one!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

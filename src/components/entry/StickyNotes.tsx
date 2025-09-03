import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, X } from 'lucide-react';

interface StickyNote {
  id: string;
  content: string;
  color: string;
}

interface StickyNotesProps {
  notes: StickyNote[];
  onNotesChange: (notes: StickyNote[]) => void;
}

const NOTE_COLORS = [
  'bg-yellow-100 border-yellow-300',
  'bg-pink-100 border-pink-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-purple-100 border-purple-300'
];

export function StickyNotes({ notes, onNotesChange }: StickyNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      const note: StickyNote = {
        id: Date.now().toString(),
        content: newNote.trim(),
        color: NOTE_COLORS[notes.length % NOTE_COLORS.length]
      };
      onNotesChange([...notes, note]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const removeNote = (id: string) => {
    onNotesChange(notes.filter(note => note.id !== id));
  };

  const updateNote = (id: string, content: string) => {
    onNotesChange(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  return (
    <Card className="journal-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
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
        {/* Existing Notes */}
        {notes.map((note) => (
          <div
            key={note.id}
            className={`relative p-3 rounded-lg border-2 ${note.color} shadow-sm`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNote(note.id)}
              className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
            <Textarea
              value={note.content}
              onChange={(e) => updateNote(note.id, e.target.value)}
              className="min-h-[60px] text-sm border-none bg-transparent p-0 resize-none focus-visible:ring-0"
              placeholder="Quick thought..."
            />
          </div>
        ))}

        {/* Add New Note */}
        {isAdding && (
          <div className="p-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
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

        {notes.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No quick notes yet. Click + to add one!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

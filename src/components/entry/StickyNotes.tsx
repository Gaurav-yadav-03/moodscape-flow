import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, StickyNote } from 'lucide-react';

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
  'bg-yellow-200 border-yellow-300',
  'bg-pink-200 border-pink-300',
  'bg-blue-200 border-blue-300',
  'bg-green-200 border-green-300',
  'bg-purple-200 border-purple-300'
];

export function StickyNotes({ notes, onNotesChange }: StickyNotesProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const addNote = () => {
    if (newNoteContent.trim()) {
      const newNote: StickyNote = {
        id: Date.now().toString(),
        content: newNoteContent.trim(),
        color: NOTE_COLORS[notes.length % NOTE_COLORS.length]
      };
      onNotesChange([...notes, newNote]);
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  const removeNote = (noteId: string) => {
    onNotesChange(notes.filter(note => note.id !== noteId));
  };

  const updateNote = (noteId: string, content: string) => {
    onNotesChange(notes.map(note => 
      note.id === noteId ? { ...note, content } : note
    ));
  };

  return (
    <Card className="journal-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <StickyNote className="h-5 w-5" />
            <span>Quick Notes</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNote(true)}
            disabled={isAddingNote}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
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
              className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-black/10"
              onClick={() => removeNote(note.id)}
            >
              <X className="h-3 w-3" />
            </Button>
            <Textarea
              value={note.content}
              onChange={(e) => updateNote(note.id, e.target.value)}
              className="border-none bg-transparent p-0 text-sm resize-none focus-visible:ring-0 pr-8"
              placeholder="Quick thought..."
              rows={2}
            />
          </div>
        ))}

        {/* Add New Note */}
        {isAddingNote && (
          <div className={`p-3 rounded-lg border-2 ${NOTE_COLORS[notes.length % NOTE_COLORS.length]} shadow-sm`}>
            <Textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="border-none bg-transparent p-0 text-sm resize-none focus-visible:ring-0"
              placeholder="What's on your mind?"
              rows={2}
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent('');
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={addNote}
                disabled={!newNoteContent.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {notes.length === 0 && !isAddingNote && (
          <div className="text-center py-4 text-muted-foreground">
            <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Add quick notes and thoughts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

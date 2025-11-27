import { StickyNote, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface Note {
    id: string;
    content: string;
}

export function QuickNotesPanel() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const addNote = () => {
        if (!newNote.trim()) return;
        setNotes([...notes, { id: Date.now().toString(), content: newNote }]);
        setNewNote('');
        setIsAdding(false);
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    return (
        <div className="w-72 border-r border-primary/20 bg-white/95 backdrop-blur-md h-full overflow-y-auto shadow-lg">
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-primary/10">
                    <div className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900">Quick Notes</h3>
                    </div>
                    <Button
                        onClick={() => setIsAdding(!isAdding)}
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Add Note Form */}
                {isAdding && (
                    <div className="space-y-2">
                        <Textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Quick thought..."
                            className="min-h-[80px] text-sm resize-none"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button onClick={addNote} size="sm" className="flex-1 bg-primary hover:bg-primary-dark">
                                Add
                            </Button>
                            <Button onClick={() => setIsAdding(false)} variant="outline" size="sm">
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Notes List */}
                <div className="space-y-3">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="group relative p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:shadow-sm transition-shadow"
                        >
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3 text-gray-400 hover:text-gray-900" />
                            </button>
                            <p className="text-sm text-gray-700 leading-relaxed pr-4">
                                {note.content}
                            </p>
                        </div>
                    ))}
                </div>

                {notes.length === 0 && !isAdding && (
                    <p className="text-sm text-gray-400 text-center py-8">
                        No notes yet. Click + to add one.
                    </p>
                )}
            </div>
        </div>
    );
}

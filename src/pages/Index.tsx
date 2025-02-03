import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import NotesList from '@/components/NotesList';
import NoteEditor from '@/components/NoteEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      lastModified: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    toast({
      title: "Note created",
      description: "A new note has been created",
    });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, lastModified: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    setSelectedNoteId(null);
    toast({
      title: "Note deleted",
      description: "The note has been deleted",
      variant: "destructive",
    });
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <div className="h-screen flex">
      <div className="w-80 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={createNewNote} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Note
            </Button>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <NotesList
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          onNoteSelect={setSelectedNoteId}
        />
      </div>
      <div className="flex-1 p-6">
        {selectedNote ? (
          <div className="space-y-4">
            <Input
              value={selectedNote.title}
              onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
              className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
              placeholder="Note title..."
            />
            <NoteEditor
              content={selectedNote.content}
              onChange={(content) => updateNote(selectedNote.id, { content })}
            />
            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteNote(selectedNote.id)}
              >
                Delete Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
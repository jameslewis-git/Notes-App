import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import NotesList from '@/components/NotesList';
import NoteEditor from '@/components/NoteEditor';
import TodoList from '@/components/TodoList';
import DrawingCanvas from '@/components/DrawingCanvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, SortAsc, SortDesc, ListTodo, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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

  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const comparison = new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      return sortDirection === 'asc' ? -comparison : comparison;
    });

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <header className="border-b p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notes App</h1>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 flex flex-col border-r">
            <div className="p-4 space-y-4 border-b">
              <Button onClick={createNewNote} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="w-full"
              >
                {sortDirection === 'asc' ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                Sort by {sortDirection === 'asc' ? 'Oldest' : 'Newest'}
              </Button>
            </div>
            <NotesList
              notes={filteredNotes}
              selectedNoteId={selectedNoteId}
              onNoteSelect={setSelectedNoteId}
            />
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="todos">
                  <ListTodo className="w-4 h-4 mr-2" />
                  Todos
                </TabsTrigger>
                <TabsTrigger value="drawing">
                  <Pencil className="w-4 h-4 mr-2" />
                  Drawing
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="notes">
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
              </TabsContent>
              
              <TabsContent value="todos">
                <TodoList />
              </TabsContent>
              
              <TabsContent value="drawing">
                <DrawingCanvas />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
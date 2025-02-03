import { Note } from '@/types/note';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
}

const NotesList = ({ notes, selectedNoteId, onNoteSelect }: NotesListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)] border-r">
      <div className="p-4 space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note.id)}
            className={cn(
              'p-3 rounded-lg cursor-pointer hover:bg-secondary transition-colors',
              selectedNoteId === note.id ? 'bg-secondary' : ''
            )}
          >
            <h3 className="font-medium truncate">{note.title || 'Untitled'}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {note.content.replace(/<[^>]*>/g, '').slice(0, 100)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(note.lastModified).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotesList;

import React, { useState, useEffect } from 'react';
import { Plus, Trash, File } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  timestamp: number;
}

interface NotesAppProps {
  onClose: () => void;
}

const NotesApp: React.FC<NotesAppProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);

  const colors = [
    'bg-yellow-200/20 border-yellow-300/30',
    'bg-blue-200/20 border-blue-300/30',
    'bg-green-200/20 border-green-300/30',
    'bg-pink-200/20 border-pink-300/30',
    'bg-purple-200/20 border-purple-300/30'
  ];

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const saved = localStorage.getItem('os-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  };

  const saveNotes = (newNotes: Note[]) => {
    localStorage.setItem('os-notes', JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      timestamp: Date.now()
    };
    setEditingNote(newNote);
  };

  const saveNote = () => {
    if (!editingNote) return;

    const noteToSave: Note = {
      id: editingNote.id || Date.now().toString(),
      title: editingNote.title || 'New Note',
      content: editingNote.content || '',
      color: editingNote.color || colors[0],
      timestamp: editingNote.timestamp || Date.now()
    };

    const existingIndex = notes.findIndex(n => n.id === noteToSave.id);
    let newNotes: Note[];

    if (existingIndex >= 0) {
      newNotes = notes.map(n => n.id === noteToSave.id ? noteToSave : n);
    } else {
      newNotes = [...notes, noteToSave];
    }

    saveNotes(newNotes);
    setEditingNote(null);
    setSelectedNote(noteToSave.id);
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    saveNotes(newNotes);
    if (selectedNote === id) {
      setSelectedNote(null);
    }
  };

  const selectedNoteData = notes.find(n => n.id === selectedNote);

  return (
    <div className="h-full flex bg-white/5 backdrop-blur-sm">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Notes</h2>
          <button
            onClick={createNote}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Plus className="w-4 h-4 text-white/80" />
          </button>
        </div>

        <div className="space-y-2">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors border ${note.color} ${
                selectedNote === note.id ? 'ring-2 ring-white/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white/90 font-medium text-sm truncate">
                  {note.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-300"
                >
                  <Trash className="w-3 h-3" />
                </button>
              </div>
              <p className="text-white/60 text-xs line-clamp-2">
                {note.content || 'Empty note'}
              </p>
              <p className="text-white/40 text-xs mt-1">
                {new Date(note.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {editingNote ? (
          <div className="h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={editingNote.title || ''}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                className="text-white font-semibold bg-transparent border-none outline-none text-lg"
                placeholder="Note title"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingNote(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
            <textarea
              value={editingNote.content || ''}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              className="w-full h-full bg-transparent text-white resize-none outline-none"
              placeholder="Start typing your note..."
            />
          </div>
        ) : selectedNoteData ? (
          <div className="h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-white font-semibold text-lg">{selectedNoteData.title}</h1>
              <button
                onClick={() => setEditingNote(selectedNoteData)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Edit
              </button>
            </div>
            <div className="text-white/80 whitespace-pre-wrap">
              {selectedNoteData.content || 'This note is empty.'}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a note to view it</p>
              <p className="text-sm">or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;

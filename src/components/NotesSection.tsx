"use client";

import { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useNotes } from '@/hooks/useNotes';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PixelFrame } from './PixelFrame';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';

interface NotesSectionProps {
  contactId: Id<"contacts">;
  userId: Id<"users">;
}

export function NotesSection({ contactId, userId }: NotesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteBody, setNewNoteBody] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<Id<"notes"> | null>(null);
  const [editingBody, setEditingBody] = useState('');

  const { notes, isLoading } = useNotes(contactId);
  const addNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.deleteNote);

  const handleAddNote = async () => {
    if (!newNoteBody.trim()) return;
    
    try {
      await addNote({
        ownerId: userId,
        contactId,
        body: newNoteBody.trim(),
      });
      setNewNoteBody('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    try {
      await deleteNote({ noteId });
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleStartEdit = (noteId: Id<"notes">, currentBody: string) => {
    setEditingNoteId(noteId);
    setEditingBody(currentBody);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingBody('');
  };

  const handleUpdateNote = async () => {
    if (!editingBody.trim() || !editingNoteId) return;
    
    try {
      await updateNote({
        noteId: editingNoteId,
        body: editingBody.trim(),
      });
      setEditingNoteId(null);
      setEditingBody('');
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner text="Loading notes..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-pixel text-xl text-purple-600">Notes</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-purple-600 text-white font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <PixelFrame padding="p-4">
          <div className="space-y-4">
            <textarea
              value={newNoteBody}
              onChange={(e) => setNewNoteBody(e.target.value)}
              placeholder="Write a note about this contact..."
              className="w-full h-24 px-3 py-2 bg-white border border-gray-300 text-gray-900 font-pixel text-sm resize-none focus:outline-none focus:border-purple-500"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewNoteBody('');
                }}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNoteBody.trim()}
                className="px-4 py-2 bg-purple-600 text-white font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Note
              </button>
            </div>
          </div>
        </PixelFrame>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No notes yet. Click &quot;Add Note&quot; to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <PixelFrame key={note._id} padding="p-4">
              <div className="space-y-3">
                {editingNoteId === note._id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingBody}
                      onChange={(e) => setEditingBody(e.target.value)}
                      className="w-full h-20 px-3 py-2 bg-white border border-gray-300 text-gray-900 font-pixel text-sm resize-none focus:outline-none focus:border-purple-500"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateNote}
                        disabled={!editingBody.trim()}
                        className="px-3 py-1 bg-purple-600 text-white font-pixel text-xs tracking-wider pixel-border-outset transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-gray-900 font-pixel text-sm leading-relaxed">
                      {note.body}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {formatDate(note.createdAt)}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStartEdit(note._id, note.body)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Edit note"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </PixelFrame>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { PixelFrame } from './PixelFrame';
import { Plus, Trash2, Check, Clock, Calendar, X } from 'lucide-react';

interface ActionsSectionProps {
  contactId: Id<"contacts">;
  userId: Id<"users">;
}

export function ActionsSection({ contactId, userId }: ActionsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionKind, setNewActionKind] = useState<'todo' | 'followup'>('todo');
  const [newActionDueDate, setNewActionDueDate] = useState('');

  const actions = useQuery(api.notes.listOpenActions, { contactId });
  const addAction = useMutation(api.notes.addAction);
  const completeAction = useMutation(api.notes.completeAction);
  const deleteAction = useMutation(api.notes.deleteAction);

  const handleAddAction = async () => {
    if (!newActionTitle.trim()) return;
    
    try {
      await addAction({
        ownerId: userId,
        contactId,
        title: newActionTitle.trim(),
        kind: newActionKind,
        dueAt: newActionDueDate ? new Date(newActionDueDate).getTime() : undefined,
      });
      setNewActionTitle('');
      setNewActionDueDate('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add action:', error);
    }
  };

  const handleCompleteAction = async (actionId: Id<"actions">) => {
    try {
      await completeAction({ actionId });
    } catch (error) {
      console.error('Failed to complete action:', error);
    }
  };

  const handleDeleteAction = async (actionId: Id<"actions">) => {
    try {
      await deleteAction({ actionId });
    } catch (error) {
      console.error('Failed to delete action:', error);
    }
  };

  const formatDueDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) {
      return `Overdue (${Math.abs(diffInDays)} days ago)`;
    } else if (diffInDays === 0) {
      return 'Due today';
    } else if (diffInDays === 1) {
      return 'Due tomorrow';
    } else if (diffInDays <= 7) {
      return `Due in ${diffInDays} days`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getDueDateColor = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'text-red-400';
    if (diffInDays <= 1) return 'text-yellow-400';
    return 'text-neutral-400';
  };

  const isLoading = actions === undefined;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="font-pixel text-neutral-400">Loading actions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-pixel text-xl text-emerald-400">Actions</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-emerald-400 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Action
          </button>
        )}
      </div>

      {/* Add Action Form */}
      {isAdding && (
        <PixelFrame padding="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-pixel text-neutral-300 mb-2">
                Action Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setNewActionKind('todo')}
                  className={`px-3 py-2 font-pixel text-sm transition-colors ${
                    newActionKind === 'todo'
                      ? 'bg-emerald-500 text-neutral-900'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  Todo
                </button>
                <button
                  onClick={() => setNewActionKind('followup')}
                  className={`px-3 py-2 font-pixel text-sm transition-colors ${
                    newActionKind === 'followup'
                      ? 'bg-emerald-500 text-neutral-900'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  Follow-up
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-pixel text-neutral-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newActionTitle}
                onChange={(e) => setNewActionTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 text-neutral-200 font-pixel text-sm focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-pixel text-neutral-300 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={newActionDueDate}
                onChange={(e) => setNewActionDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 text-neutral-200 font-pixel text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewActionTitle('');
                  setNewActionDueDate('');
                }}
                className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleAddAction}
                disabled={!newActionTitle.trim()}
                className="px-4 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Action
              </button>
            </div>
          </div>
        </PixelFrame>
      )}

      {/* Actions List */}
      {actions.length === 0 ? (
        <div className="text-neutral-400 text-center py-8">
          No actions yet. Click "Add Action" to create a todo or followup.
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => (
            <PixelFrame key={action._id} padding="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {action.kind === 'todo' ? (
                        <Clock className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Calendar className="w-4 h-4 text-violet-400" />
                      )}
                      <span className={`text-xs font-pixel px-2 py-1 ${
                        action.kind === 'todo' 
                          ? 'bg-cyan-500 text-neutral-900' 
                          : 'bg-violet-500 text-neutral-900'
                      }`}>
                        {action.kind === 'todo' ? 'TODO' : 'FOLLOW-UP'}
                      </span>
                    </div>
                    <div className="text-neutral-200 font-pixel text-sm">
                      {action.title}
                    </div>
                    {action.dueAt && (
                      <div className={`text-xs mt-2 ${getDueDateColor(action.dueAt)}`}>
                        {formatDueDate(action.dueAt)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleCompleteAction(action._id)}
                      className="p-1 text-neutral-500 hover:text-emerald-400 transition-colors"
                      title="Mark as complete"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAction(action._id)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Delete action"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </PixelFrame>
          ))}
        </div>
      )}
    </div>
  );
}

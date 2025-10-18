"use client";

import { useState, useEffect } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { usePreferences } from '@/hooks/usePreferences';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PixelFrame } from './PixelFrame';
import { Plus, Save, X } from 'lucide-react';

interface PreferencesSectionProps {
  contactId: Id<"contacts">;
  userId: Id<"users">;
}

export function PreferencesSection({ contactId, userId }: PreferencesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [food, setFood] = useState<string[]>([]);
  const [music, setMusic] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  // Form inputs for adding new items
  const [newFood, setNewFood] = useState('');
  const [newMusic, setNewMusic] = useState('');
  const [newHobby, setNewHobby] = useState('');

  const { preferences, isLoading } = usePreferences(contactId);
  const upsertPreferences = useMutation(api.preferences.upsertPreferences);

  // Load existing preferences when they're available
  useEffect(() => {
    if (preferences) {
      setFood(preferences.food || []);
      setMusic(preferences.music || []);
      setHobbies(preferences.hobbies || []);
      setNotes(preferences.notes || '');
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      await upsertPreferences({
        ownerId: userId,
        contactId,
        food,
        music,
        hobbies,
        notes,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const handleCancel = () => {
    if (preferences) {
      setFood(preferences.food || []);
      setMusic(preferences.music || []);
      setHobbies(preferences.hobbies || []);
      setNotes(preferences.notes || '');
    } else {
      setFood([]);
      setMusic([]);
      setHobbies([]);
      setNotes('');
    }
    setIsEditing(false);
    setNewFood('');
    setNewMusic('');
    setNewHobby('');
  };

  const addItem = (category: 'food' | 'music' | 'hobbies', value: string) => {
    if (!value.trim()) return;
    
    const trimmedValue = value.trim();
    switch (category) {
      case 'food':
        if (!food.includes(trimmedValue)) {
          setFood([...food, trimmedValue]);
          setNewFood('');
        }
        break;
      case 'music':
        if (!music.includes(trimmedValue)) {
          setMusic([...music, trimmedValue]);
          setNewMusic('');
        }
        break;
      case 'hobbies':
        if (!hobbies.includes(trimmedValue)) {
          setHobbies([...hobbies, trimmedValue]);
          setNewHobby('');
        }
        break;
    }
  };

  const removeItem = (category: 'food' | 'music' | 'hobbies', value: string) => {
    switch (category) {
      case 'food':
        setFood(food.filter(item => item !== value));
        break;
      case 'music':
        setMusic(music.filter(item => item !== value));
        break;
      case 'hobbies':
        setHobbies(hobbies.filter(item => item !== value));
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, category: 'food' | 'music' | 'hobbies', value: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(category, value);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner text="Loading preferences..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-pixel text-xl text-emerald-400">Preferences</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-emerald-400 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Edit Preferences
          </button>
        )}
      </div>

      {isEditing ? (
        <PixelFrame padding="p-6">
          <div className="space-y-6">
            {/* Food Preferences */}
            <div>
              <label className="block text-sm font-pixel text-neutral-300 mb-3">
                Food Preferences
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'food', newFood)}
                    placeholder="Add a food preference..."
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-600 text-neutral-200 font-pixel text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => addItem('food', newFood)}
                    className="px-3 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm pixel-border-outset hover:bg-emerald-400 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {food.map((item, index) => (
                    <div key={index} className="flex items-center gap-1 px-3 py-1 bg-neutral-700 text-neutral-300 font-pixel text-sm">
                      <span>{item}</span>
                      <button
                        onClick={() => removeItem('food', item)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Music Preferences */}
            <div>
              <label className="block text-sm font-pixel text-neutral-300 mb-3">
                Music Preferences
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMusic}
                    onChange={(e) => setNewMusic(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'music', newMusic)}
                    placeholder="Add a music preference..."
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-600 text-neutral-200 font-pixel text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => addItem('music', newMusic)}
                    className="px-3 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm pixel-border-outset hover:bg-emerald-400 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {music.map((item, index) => (
                    <div key={index} className="flex items-center gap-1 px-3 py-1 bg-neutral-700 text-neutral-300 font-pixel text-sm">
                      <span>{item}</span>
                      <button
                        onClick={() => removeItem('music', item)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hobbies */}
            <div>
              <label className="block text-sm font-pixel text-neutral-300 mb-3">
                Hobbies & Interests
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'hobbies', newHobby)}
                    placeholder="Add a hobby or interest..."
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-600 text-neutral-200 font-pixel text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => addItem('hobbies', newHobby)}
                    className="px-3 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm pixel-border-outset hover:bg-emerald-400 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((item, index) => (
                    <div key={index} className="flex items-center gap-1 px-3 py-1 bg-neutral-700 text-neutral-300 font-pixel text-sm">
                      <span>{item}</span>
                      <button
                        onClick={() => removeItem('hobbies', item)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-pixel text-neutral-300 mb-3">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any other preferences or notes about this contact..."
                className="w-full h-24 px-3 py-2 bg-neutral-800 border border-neutral-600 text-neutral-200 font-pixel text-sm resize-none focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-emerald-400 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </div>
        </PixelFrame>
      ) : (
        <PixelFrame padding="p-6">
          <div className="space-y-6">
            {/* Food Preferences */}
            <div>
              <h4 className="font-pixel text-sm text-neutral-400 mb-3">Food Preferences</h4>
              {food.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {food.map((item, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-700 text-neutral-300 font-pixel text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500 text-sm">No food preferences set</div>
              )}
            </div>

            {/* Music Preferences */}
            <div>
              <h4 className="font-pixel text-sm text-neutral-400 mb-3">Music Preferences</h4>
              {music.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {music.map((item, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-700 text-neutral-300 font-pixel text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500 text-sm">No music preferences set</div>
              )}
            </div>

            {/* Hobbies */}
            <div>
              <h4 className="font-pixel text-sm text-neutral-400 mb-3">Hobbies & Interests</h4>
              {hobbies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((item, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-700 text-neutral-300 font-pixel text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500 text-sm">No hobbies set</div>
              )}
            </div>

            {/* Notes */}
            {notes && (
              <div>
                <h4 className="font-pixel text-sm text-neutral-400 mb-3">Additional Notes</h4>
                <div className="text-neutral-200 font-pixel text-sm leading-relaxed">
                  {notes}
                </div>
              </div>
            )}

            {food.length === 0 && music.length === 0 && hobbies.length === 0 && !notes && (
              <div className="text-neutral-400 text-center py-8">
                No preferences set yet. Click &quot;Edit Preferences&quot; to add food, music, hobbies, and other preferences.
              </div>
            )}
          </div>
        </PixelFrame>
      )}
    </div>
  );
}

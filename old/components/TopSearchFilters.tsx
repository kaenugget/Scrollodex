
import React, { useState } from 'react';
import { FriendType } from '../lib/types';
import { SearchIcon } from './Icons';
import { TypeChip } from './TypeChip';
import { PIXEL_BORDER_INSET_CLASSES } from '../lib/utils';

interface TopSearchFiltersProps {
  onFilterChange: (filters: { search: string; types: FriendType[] }) => void;
}

const ALL_TYPES: FriendType[] = ['ART', 'ELEC', 'NORM', 'PSY', 'STEEL', 'DARK', 'GRASS', 'WATER', 'FIRE'];

export const TopSearchFilters: React.FC<TopSearchFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<FriendType[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    onFilterChange({ search: newSearch, types: selectedTypes });
  };
  
  const toggleType = (type: FriendType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    onFilterChange({ search, types: newTypes });
  };


  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search friends..."
          value={search}
          onChange={handleSearchChange}
          className={`w-full bg-neutral-800 text-neutral-200 placeholder-neutral-500 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${PIXEL_BORDER_INSET_CLASSES}`}
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_TYPES.map(type => (
          <button 
            key={type} 
            onClick={() => toggleType(type)}
            className={`rounded-full transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-emerald-400 ${!selectedTypes.includes(type) ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}
          >
            <TypeChip type={type} />
          </button>
        ))}
      </div>
    </div>
  );
};

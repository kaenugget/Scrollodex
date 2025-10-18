
import React, { useState } from 'react';
import { useDexList } from '../lib/hooks';
import { FriendType } from '../lib/types';
import { DexCard, DexCardSkeleton } from '../components/DexCard';
import { TopSearchFilters } from '../components/TopSearchFilters';

interface DexIndexViewProps {
  onSelectFriend: (id: string) => void;
}

const DexIndexView: React.FC<DexIndexViewProps> = ({ onSelectFriend }) => {
  const [filters, setFilters] = useState<{ search: string; types: FriendType[] }>({ search: '', types: [] });
  const { loading, entries } = useDexList(filters);

  return (
    <div>
      <TopSearchFilters onFilterChange={setFilters} />
      
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <DexCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-20">
          <h2 className="font-pixel text-xl text-neutral-500">No friends found!</h2>
          <p className="text-neutral-600 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {entries.map(entry => (
            <DexCard key={entry.id} entry={entry} onSelect={onSelectFriend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DexIndexView;

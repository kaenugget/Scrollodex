
import { useState, useEffect } from 'react';
import { SCOLLODEX_ENTRIES } from './seed';
import { FriendEntry, FriendType } from './types';

interface DexListFilters {
  search: string;
  types: FriendType[];
}

export const useDexList = (filters: DexListFilters) => {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<FriendEntry[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filteredEntries = SCOLLODEX_ENTRIES;

      if (filters.search) {
        filteredEntries = filteredEntries.filter(entry =>
          entry.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.types.length > 0) {
        filteredEntries = filteredEntries.filter(entry =>
          filters.types.every(type => entry.types.includes(type))
        );
      }
      
      setEntries(filteredEntries);
      setLoading(false);
    }, 300); // Simulate network delay

    return () => clearTimeout(timer);
  }, [filters]);

  return { loading, entries };
};

export const useDexEntry = (id: string | null) => {
  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState<FriendEntry | null>(null);

  useEffect(() => {
    if (!id) {
        setEntry(null);
        setLoading(false);
        return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const foundEntry = SCOLLODEX_ENTRIES.find(e => e.id === id) || null;
      setEntry(foundEntry);
      setLoading(false);
    }, 200); // Simulate network delay

    return () => clearTimeout(timer);
  }, [id]);

  return { loading, entry };
};

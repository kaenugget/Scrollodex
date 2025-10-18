import { useState, useEffect } from 'react';
import { SOCIAL_CONTACTS } from './seedSocial';
import { Contact } from './types';

// TODO: Replace with real state management or API calls to Convex

export const useContacts = (filters: { search: string }) => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = SOCIAL_CONTACTS;
      if (filters.search) {
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      setContacts(filtered);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters]);

  return { loading, contacts };
};

export const useContact = (id: string | null) => {
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (!id) {
      setContact(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const found = SOCIAL_CONTACTS.find(c => c.id === id) || null;
      setContact(found);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [id]);

  return { loading, contact };
};

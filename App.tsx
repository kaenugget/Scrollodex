
import React, { useState } from 'react';

// Scollodex Views
import DexIndexView from './views/DexIndexView';
import DexDetailView from './views/DexDetailView';

// New Social Views
import ContactsIndexView from './views/ContactsIndexView';
import ContactDetailView from './views/ContactDetailView';

import { AppHeader } from './components/AppHeader';
import { PIXEL_BORDER_CLASSES } from './lib/utils';

type Page = 'dex' | 'contacts' | 'peer' | 'deck' | 'avatar' | 'settings';

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className={`m-auto mt-20 text-center max-w-md bg-neutral-800 ${PIXEL_BORDER_CLASSES} p-8`}>
        <h2 className="font-pixel text-2xl text-emerald-400">{title}</h2>
        <p className="text-neutral-400 mt-4">This screen is under construction. Check back later for more pixelated fun!</p>
    </div>
);

const App: React.FC = () => {
  // Fix: Replaced incorrect 'aistudio.useState' with 'useState'.
  const [currentPage, setCurrentPage] = useState<Page>('dex');
  
  // State for detail views
  // Fix: Replaced incorrect 'aistudio.useState' with 'useState'.
  const [selectedDexFriendId, setSelectedDexFriendId] = useState<string | null>(null);
  // Fix: Replaced incorrect 'aistudio.useState' with 'useState'.
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    // Reset detail views when switching main pages
    setSelectedDexFriendId(null);
    setSelectedContactId(null);
  }

  const renderPage = () => {
    switch (currentPage) {
        case 'dex':
            return selectedDexFriendId
                ? <DexDetailView friendId={selectedDexFriendId} onBack={() => setSelectedDexFriendId(null)} />
                : <DexIndexView onSelectFriend={setSelectedDexFriendId} />;
        case 'contacts':
            return selectedContactId
                ? <ContactDetailView contactId={selectedContactId} onBack={() => setSelectedContactId(null)} />
                : <ContactsIndexView onSelectContact={setSelectedContactId} />;
        case 'peer':
            return <PlaceholderView title="Peer Pages" />;
        case 'deck':
            return <PlaceholderView title="Card Decks" />;
        case 'avatar':
            return <PlaceholderView title="Avatar Hub" />;
        case 'settings':
            return <PlaceholderView title="Settings" />;
        default:
            return <DexIndexView onSelectFriend={setSelectedDexFriendId} />;
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 antialiased relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%224%22%20height%3D%224%22%20viewBox%3D%220%200%204%204%22%3E%3Cpath%20fill%3D%22%232d2d2d%22%20fill-opacity%3D%220.1%22%20d%3D%22M0%202h4v1H0z%22%2F%3E%3C%2Fsvg%3E')] opacity-50 pointer-events-none"></div>

      <AppHeader currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
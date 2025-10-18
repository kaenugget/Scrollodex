import React from 'react';

interface NavButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`font-pixel text-sm px-4 py-2 transition-colors duration-200 ${
            isActive 
                ? 'bg-emerald-500 text-neutral-900' 
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
        }`}
    >
        {label}
    </button>
)

interface AppHeaderProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="px-4 sm:px-6 lg:px-8 py-3 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-20 border-b-4 border-neutral-800">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-lg md:text-xl text-emerald-400 tracking-wider">Scollodex</h1>
        
        <nav className="border-2 border-t-neutral-600 border-l-neutral-600 border-b-neutral-800 border-r-neutral-800 flex items-center bg-neutral-900">
            <NavButton label="Dex" isActive={currentPage === 'dex'} onClick={() => onNavigate('dex')} />
            <NavButton label="Contacts" isActive={currentPage === 'contacts'} onClick={() => onNavigate('contacts')} />
            <NavButton label="Peer" isActive={currentPage === 'peer'} onClick={() => onNavigate('peer')} />
            <NavButton label="Deck" isActive={currentPage === 'deck'} onClick={() => onNavigate('deck')} />
            <NavButton label="Avatar" isActive={currentPage === 'avatar'} onClick={() => onNavigate('avatar')} />
            <NavButton label="Settings" isActive={currentPage === 'settings'} onClick={() => onNavigate('settings')} />
        </nav>

        {/* TODO: Implement Theme Toggle Button */}
      </div>
    </header>
  );
};

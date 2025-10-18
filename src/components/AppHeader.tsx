"use client";

import React from 'react';
import { UserDropdown } from './UserDropdown';

interface NavButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`font-medium text-sm px-4 py-2 transition-colors duration-200 ${
            isActive 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
        }`}
    >
        {label}
    </button>
)

interface AppHeaderProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    user?: { _id: string; displayName?: string; avatarUrl?: string };
    onSignOut?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentPage, onNavigate, user, onSignOut }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="font-bold text-xl text-gray-900">Scrollodex</h1>
            <p className="ml-3 text-sm text-gray-500">Your Personal Index of Amazing Contacts</p>
          </div>
          
          <nav className="flex items-center space-x-8">
            <NavButton label="Dex" isActive={currentPage === 'dex'} onClick={() => onNavigate('dex')} />
          </nav>

          {user && onSignOut && (
            <UserDropdown user={user} onSignOut={onSignOut} />
          )}
        </div>
      </div>
    </header>
  );
};

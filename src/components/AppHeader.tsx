"use client";

import React, { useState } from 'react';
import { UserDropdown } from './UserDropdown';
import { Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and tagline */}
          <div className="flex items-center">
            <h1 className="font-bold text-xl text-gray-900">Scrollodex</h1>
            <p className="hidden sm:block ml-3 text-sm text-gray-500">Your Personal Index of Amazing Contacts</p>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Dex menu removed - not essential to core functionality */}
          </nav>

          {/* Desktop User Menu */}
          {user && onSignOut && (
            <div className="hidden md:block">
              <UserDropdown user={user} onSignOut={onSignOut} />
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && onSignOut && (
              <UserDropdown user={user} onSignOut={onSignOut} />
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {/* Dex menu removed - not essential to core functionality */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

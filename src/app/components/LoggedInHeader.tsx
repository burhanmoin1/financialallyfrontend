// components/LoggedInHeader.tsx
'use client';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface LoggedInHeaderProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const LoggedInHeader: React.FC<LoggedInHeaderProps> = ({ setActiveTab }) => {
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const signOut = () => {
    // Remove cookies
    Cookies.remove('user_email');
    Cookies.remove('session_token');
    Cookies.remove('name');
    // Refresh the page
    window.location.reload();
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex items-center justify-between">
        {/* Desktop View */}
        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => setActiveTab('home')}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700"
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('text-summary')}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700"
          >
            Text Summary
          </button>
          <button
            onClick={() => setActiveTab('summaries')}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700"
          >
            Summaries
          </button>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-700"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveTab('text-summary');
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-700"
              >
                Text Summary
              </button>
              <button
                onClick={() => {
                  setActiveTab('summaries');
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-700"
              >
                Summaries
              </button>
              <button
                onClick={signOut}
                className="block px-4 py-2 text-sm text-left w-full bg-red-500 hover:bg-red-600"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={signOut}
          className="hidden md:inline-block px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
        >
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default LoggedInHeader;

import React from 'react';
import { Logo } from '../common/Logo';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#000000] text-neutral-300 py-8 border-t border-neutral-900 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Logo */}
        <button
          onClick={() => setActiveTab('landing')}
          className="cursor-pointer focus:outline-none"
        >
          <Logo size="md" />
        </button>

        {/* Center Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-neutral-300">
          <button
            onClick={() => setActiveTab('landing')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>

        {/* Right Social Icons */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer">
            f
          </span>
          <span className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer">
            X
          </span>
          <span className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer">
            in
          </span>
          <span className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer">
            yt
          </span>
        </div>

      </div>
    </footer>
  );
};

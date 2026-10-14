import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { User } from '../../types';
import {
  MessageSquare,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  isAuthModalOpen?: boolean;
  onCloseAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  unreadNotificationsCount,
  onOpenAuthModal,
  onLogout,
  isAuthModalOpen = false,
  onCloseAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLandingSection, setActiveLandingSection] = useState<
    'home' | 'features' | 'about' | 'contact'
  >('home');

  const authenticatedNavItems = [
    { id: 'home', label: 'Feed' },
    { id: 'channels', label: 'Campus' },
    { id: 'help', label: 'Smart Match' },
    { id: 'marketplace', label: 'Market' },
    { id: 'housing', label: 'Housing' },
    { id: 'events', label: 'Events' },
    { id: 'guides', label: 'Guides' },
    { id: 'people', label: 'People' },
  ];

  // Close auth modal (if open) before navigating
  const closeAuthIfOpen = () => {
    if (isAuthModalOpen && onCloseAuthModal) onCloseAuthModal();
  };

  const handleLandingNav = (section: 'home' | 'features' | 'about' | 'contact') => {
    closeAuthIfOpen();
    setActiveLandingSection(section);
    setActiveTab('landing');

    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'features') {
      const el = document.getElementById('features-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'about') {
      const el = document.getElementById('how-it-works-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    onOpenAuthModal('login');
  };

  const handleLoginClick = () => {
    onOpenAuthModal('login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl backdrop-saturate-150 border-b border-white/40 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: LINK UP Logo */}
        <button
          onClick={() => {
            closeAuthIfOpen();
            if (currentUser) {
              setActiveTab('home');
            } else {
              setActiveLandingSection('home');
              setActiveTab('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="cursor-pointer focus:outline-none shrink-0"
        >
          <Logo size="md" />
        </button>

        {/* Center Nav */}
        {currentUser ? (
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {authenticatedNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-sm sm:text-base font-semibold transition-all cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-[#CB0000] font-bold'
                      : 'text-neutral-800 hover:text-[#000000]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#CB0000] rounded-full" />
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all cursor-pointer border shadow-2xs ${
                activeTab === 'ai'
                  ? 'bg-[#CB0000] text-white border-[#CB0000]'
                  : 'bg-neutral-50/90 text-neutral-900 border-neutral-200/90 hover:border-[#CB0000] hover:bg-white'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'ai' ? 'text-white' : 'text-[#CB0000]'}`} />
              <span>BridgeAI</span>
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-8">
            {(['home', 'features', 'about', 'contact'] as const).map((section) => {
              const label = section.charAt(0).toUpperCase() + section.slice(1);
              const isActive = activeLandingSection === section;
              return (
                <button
                  key={section}
                  onClick={() => handleLandingNav(section)}
                  className={`text-sm font-semibold transition-all cursor-pointer relative py-1 ${
                    isActive ? 'text-[#CB0000] font-bold' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <span>{label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#CB0000] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('messages')}
                className={`relative p-2.5 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer ${
                  activeTab === 'messages' ? 'bg-neutral-100 text-[#000000]' : ''
                }`}
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#CB0000] rounded-full ring-2 ring-white" />
                )}
              </button>

              {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-5 h-5 text-[#CB0000]" />
                </button>
              )}

              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 rounded-full transition-colors cursor-pointer border border-neutral-200"
                title="Your Profile"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <span className="text-xs font-bold text-neutral-900 truncate max-w-[110px] hidden sm:inline">
                  {currentUser.fullName.split(' ')[0]}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Get Started — only when auth modal is CLOSED */
            !isAuthModalOpen && (
              <button
                onClick={handleGetStarted}
                className="px-6 py-2.5 bg-[#000000] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-white/50 px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {currentUser ? (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {authenticatedNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#000000] text-white'
                        : 'bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setActiveTab('ai');
                  setMobileMenuOpen(false);
                }}
                className={`col-span-2 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'ai' ? 'bg-[#CB0000] text-white' : 'bg-red-50 text-[#CB0000]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>BridgeAI</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {(['home', 'features', 'about', 'contact'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    handleLandingNav(section);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 rounded-xl"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}

              {!isAuthModalOpen && (
                <div className="pt-2 border-t border-neutral-200 flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleLoginClick();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2.5 text-center text-xs font-bold bg-neutral-100 rounded-xl text-neutral-800"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      handleGetStarted();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2.5 text-center text-xs font-bold bg-[#000000] text-white rounded-xl"
                  >
                    Get Started →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
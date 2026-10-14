import React, { useState } from 'react';
import { User } from './types';
import { removeStoredToken } from './services/api';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Pages
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { HelpMatchingPage } from './pages/HelpMatchingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { PeoplePage } from './pages/PeoplePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { HousingPage } from './pages/HousingPage';
import { EventsPage } from './pages/EventsPage';
import { GuidesPage } from './pages/GuidesPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { BridgeAIPage } from './pages/BridgeAIPage';
import { AdminPage } from './pages/AdminPage';
import { CampusChannelsPage } from './pages/CampusChannelsPage';

export default function App() {
  const [activeTab, setActiveTabState] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeDirectUser, setActiveDirectUser] = useState<User | null>(null);
  const [unreadMessagesCount] = useState(1);
  const [unreadNotificationsCount] = useState(1);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [pendingTargetTab, setPendingTargetTab] = useState<string | null>(null);

  // NAVIGATION
  const setActiveTab = (tab: string) => {
    const publicTabs = ['landing', 'guides'];

    if (!currentUser && !publicTabs.includes(tab)) {
      setPendingTargetTab(tab);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    setActiveTabState(tab);
  };

  // OPEN LOGIN / REGISTER
  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // LOGIN / REGISTER SUCCESS
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setPendingTargetTab(null);
    setIsAuthModalOpen(false);
    setActiveTabState('home');
  };

  // LOGOUT
  const handleLogout = () => {
    removeStoredToken();
    setCurrentUser(null);
    setActiveDirectUser(null);
    setActiveTabState('landing');
  };

  // DIRECT MESSAGE
  const handleOpenDirectMessage = (user: User) => {
    if (!currentUser) {
      setPendingTargetTab('messages');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setActiveDirectUser(user);
    setActiveTabState('messages');
  };

  // CLOSE AUTH MODAL
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingTargetTab(null);
  };

  const isLanding = activeTab === 'landing';

  return (
    <div className="min-h-screen bg-[#FEFEFE] text-neutral-900 flex flex-col font-sans selection:bg-[#CB0000] selection:text-white">

      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        isAuthModalOpen={isAuthModalOpen}
        onCloseAuthModal={handleCloseAuthModal}
      />

      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {currentUser && (
          <>
            {activeTab === 'home' && (
              <HomePage currentUser={currentUser} setActiveTab={setActiveTab} onOpenDirectMessage={handleOpenDirectMessage} />
            )}
            {activeTab === 'channels' && (
              <CampusChannelsPage currentUser={currentUser} onOpenDirectMessage={handleOpenDirectMessage} />
            )}
            {activeTab === 'help' && (
              <HelpMatchingPage currentUser={currentUser} setActiveTab={setActiveTab} onOpenDirectMessage={handleOpenDirectMessage} />
            )}
            {activeTab === 'discover' && (
              <DiscoverPage currentUser={currentUser} setActiveTab={setActiveTab} onOpenDirectMessage={handleOpenDirectMessage} />
            )}
            {activeTab === 'people' && (
              <PeoplePage currentUser={currentUser} setActiveTab={setActiveTab} onOpenDirectMessage={handleOpenDirectMessage} />
            )}
            {activeTab === 'marketplace' && (
              <MarketplacePage currentUser={currentUser} onOpenDirectMessage={handleOpenDirectMessage} />
            )}
            {activeTab === 'housing' && (
              <HousingPage currentUser={currentUser} onOpenDirectMessage={handleOpenDirectMessage} />
            )}
            {activeTab === 'events' && <EventsPage currentUser={currentUser} />}
            {activeTab === 'messages' && (
              <MessagesPage currentUser={currentUser} activeDirectUser={activeDirectUser} />
            )}
            {activeTab === 'notifications' && <NotificationsPage setActiveTab={setActiveTab} />}
            {activeTab === 'profile' && (
              <ProfilePage currentUser={currentUser} onOpenDirectMessage={handleOpenDirectMessage} />
            )}
            {activeTab === 'settings' && <SettingsPage currentUser={currentUser} />}
            {activeTab === 'admin' &&
              (currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                <AdminPage />
              )}
            {activeTab === 'ai' && <BridgeAIPage setActiveTab={setActiveTab} />}
          </>
        )}

        {activeTab === 'guides' && <GuidesPage />}
      </main>

      {!isLanding && <Footer setActiveTab={setActiveTab} />}

      {authModalMode === 'login' ? (
        <Login
          isOpen={isAuthModalOpen}
          initialMode="login"
          onClose={handleCloseAuthModal}
          onSuccess={handleAuthSuccess}
          onRegisterClick={() => setAuthModalMode('register')}
        />
      ) : (
        <Register
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
          onSuccess={handleAuthSuccess}
          onLoginClick={() => setAuthModalMode('login')}
        />
      )}
    </div>
  );
}
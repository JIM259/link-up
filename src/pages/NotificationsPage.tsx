import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { fetchNotifications } from '../services/api';
import { Bell, Sparkles, MessageSquare, Heart, ShieldCheck } from 'lucide-react';

interface NotificationsPageProps {
  setActiveTab: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ setActiveTab }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <h1 className="text-xl sm:text-2xl font-black font-display text-neutral-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#CB0000]" /> Notifications
        </h1>
        <span className="text-xs text-neutral-500 font-medium">All caught up</span>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => n.linkUrl && setActiveTab(n.linkUrl.replace('/', ''))}
            className="bg-[#FEFEFE] rounded-xl border border-neutral-200 p-4 shadow-xs hover:border-[#000000] transition-colors cursor-pointer flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#CB0000]/10 text-[#CB0000] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-neutral-900">{n.title}</h4>
              <p className="text-xs text-neutral-600">{n.message}</p>
              <div className="text-[10px] text-neutral-400">
                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, Settings, Bell, Lock, Globe, Check } from 'lucide-react';

interface SettingsPageProps {
  currentUser: User;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <h1 className="text-xl sm:text-2xl font-black font-display text-neutral-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#CB0000]" /> Account & Privacy Settings
        </h1>
      </div>

      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
        
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Privacy & Match Preferences</h3>
          
          <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-neutral-900">Smart Match Instant Alerts</div>
              <div className="text-[11px] text-neutral-500">Receive real-time match suggestions when senior student helpers answer your requests.</div>
            </div>
            <input
              type="checkbox"
              checked={matchAlerts}
              onChange={(e) => setMatchAlerts(e.target.checked)}
              className="accent-[#CB0000] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-neutral-900">Email Notifications</div>
              <div className="text-[11px] text-neutral-500">Receive digests for marketplace inquiries and event RSVPs.</div>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="accent-[#CB0000] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-xs text-neutral-500">LINK UP Security Enforcement Active</span>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {saved ? <Check className="w-4 h-4 text-white" /> : null}
            <span>{saved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

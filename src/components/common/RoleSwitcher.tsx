import React from 'react';
import { User } from '../../types';
import { ShieldCheck, UserCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  usersList: User[];
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentUser,
  onSelectUser,
  usersList
}) => {
  return (
    <div className="bg-[#000000] text-white text-xs px-4 py-2 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2 font-medium">
        <span className="inline-flex items-center gap-1.5 bg-[#CB0000] text-white px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" /> DEMO ROLE SWITCHER
        </span>
        <span className="text-neutral-400 hidden sm:inline">Test multi-role experience & permissions:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
        {usersList.slice(0, 4).map((u) => {
          const isActive = u.id === currentUser.id;
          return (
            <button
              key={u.id}
              onClick={() => onSelectUser(u)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all text-xs whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <img
                src={u.avatar}
                alt={u.fullName}
                className="w-4 h-4 rounded-full object-cover border border-neutral-700"
              />
              <span>{u.fullName.split(' ')[0]}</span>
              <span className={`text-[10px] px-1 rounded uppercase tracking-wider ${
                u.role === 'admin' ? 'bg-purple-900 text-purple-200' :
                u.role === 'moderator' ? 'bg-amber-900 text-amber-200' :
                u.role === 'senior_helper' ? 'bg-emerald-900 text-emerald-200' :
                'bg-neutral-800 text-neutral-300'
              }`}>
                {u.role.replace('_', ' ')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

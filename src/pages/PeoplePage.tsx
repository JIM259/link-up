import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { fetchUsers, toggleBlockUser } from '../services/api';
import { BlockUserModal } from '../components/BlockUserModal';
import { Search, MapPin, CheckCircle2, MessageSquare, ShieldCheck, Sparkles, Ban } from 'lucide-react';

interface PeoplePageProps {
  currentUser: User;
  setActiveTab: (tab: string) => void;
  onOpenDirectMessage?: (user: User) => void;
}

export const PeoplePage: React.FC<PeoplePageProps> = ({
  currentUser,
  setActiveTab,
  onOpenDirectMessage
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  // Block User state
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(currentUser.blockedUserIds || []);
  const [blockModalTarget, setBlockModalTarget] = useState<User | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleConfirmBlock = async (targetUser: User) => {
    const res = await toggleBlockUser(currentUser.id, targetUser.id);
    setBlockedUserIds(res.blockedUserIds);
  };

  const filteredUsers = users.filter((u) => {
    if (cityFilter && !u.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchUni = u.university.toLowerCase().includes(q);
      const matchLang = u.nativeLanguages.some(l => l.toLowerCase().includes(q));
      if (!matchName && !matchUni && !matchLang) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
            International Students & Senior Helpers
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            Discover language exchange partners, senior guides in Yiwu & Hangzhou, and fellow international peers.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('help')}
          className="px-4 py-2 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Need Match</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, university, language..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="text-xs bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 font-semibold cursor-pointer"
        >
          <option value="">All Cities</option>
          <option value="Yiwu">Yiwu</option>
          <option value="Hangzhou">Hangzhou</option>
          <option value="Shanghai">Shanghai</option>
          <option value="Beijing">Beijing</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 font-semibold cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="senior_helper">Senior Helper</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => {
          const isBlocked = blockedUserIds.includes(u.id);
          const isMe = u.id === currentUser.id;

          return (
            <div
              key={u.id}
              className={`bg-[#FEFEFE] rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                isBlocked ? 'border-red-200 bg-red-50/10' : 'border-neutral-200 hover:border-neutral-900'
              }`}
            >
              
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={u.avatar}
                        alt={u.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                      />
                      {isBlocked && (
                        <span className="absolute -bottom-0.5 -right-0.5 bg-red-600 text-white p-0.5 rounded-full">
                          <Ban className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-900">{u.fullName}</span>
                        {u.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">{u.university}</div>
                      <div className="text-[10px] text-neutral-400">{u.city}</div>
                    </div>
                  </div>

                  {!isMe && (
                    <button
                      onClick={() => {
                        setBlockModalTarget(u);
                        setIsBlockModalOpen(true);
                      }}
                      title={isBlocked ? 'Unblock User' : 'Block User'}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBlocked
                          ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                          : 'text-neutral-400 border-neutral-200 hover:text-red-600 hover:bg-red-50 hover:border-red-200'
                      }`}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {isBlocked && (
                  <div className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 flex items-center gap-1">
                    <Ban className="w-3 h-3" />
                    <span>User Blocked</span>
                  </div>
                )}

                <p className="text-xs text-neutral-700 leading-relaxed line-clamp-3">
                  {u.bio}
                </p>

                {/* Languages */}
                <div className="text-[11px] text-neutral-600 font-medium space-y-1">
                  <div>Native: <span className="font-bold text-neutral-900">{u.nativeLanguages.join(', ')}</span></div>
                  <div>Learning: <span className="font-bold text-neutral-900">{u.learningLanguages.join(', ') || 'N/A'}</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#CB0000]">
                  Reputation: {u.reputationScore} ★
                </span>
                
                {onOpenDirectMessage && !isMe && (
                  <button
                    disabled={isBlocked}
                    onClick={() => onOpenDirectMessage(u)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                      isBlocked
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-[#000000] text-white hover:bg-neutral-800 cursor-pointer'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isBlocked ? 'Blocked' : 'Connect'}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        user={blockModalTarget}
        isBlocked={blockModalTarget ? blockedUserIds.includes(blockModalTarget.id) : false}
        onClose={() => {
          setIsBlockModalOpen(false);
          setBlockModalTarget(null);
        }}
        onConfirmBlock={handleConfirmBlock}
      />

    </div>
  );
};

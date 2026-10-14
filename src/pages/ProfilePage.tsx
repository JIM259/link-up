import React, { useState } from 'react';
import { User } from '../types';
import { toggleBlockUser } from '../services/api';
import { BlockUserModal } from '../components/BlockUserModal';
import { CheckCircle2, MapPin, Building, ShieldCheck, Star, MessageSquare, Ban, ShieldAlert } from 'lucide-react';

interface ProfilePageProps {
  currentUser: User;
  viewedUser?: User | null;
  onOpenDirectMessage?: (user: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  viewedUser,
  onOpenDirectMessage
}) => {
  const profileUser = viewedUser || currentUser;
  const isSelf = profileUser.id === currentUser.id;

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(currentUser.blockedUserIds || []);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const isBlocked = blockedUserIds.includes(profileUser.id);

  const handleConfirmBlock = async (targetUser: User) => {
    const res = await toggleBlockUser(currentUser.id, targetUser.id);
    setBlockedUserIds(res.blockedUserIds);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Profile Card */}
      <div className="bg-[#FEFEFE] rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
        
        {/* Banner Cover */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-[#000000] via-[#1A1A1A] to-[#CB0000] relative" />

        <div className="p-6 sm:p-8 pt-0 relative space-y-6">
          
          {/* Avatar & Header row */}
          <div className="flex flex-wrap items-end justify-between gap-4 -mt-14 sm:-mt-16">
            <div className="relative">
              <img
                src={profileUser.avatar}
                alt={profileUser.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              {isBlocked && (
                <span className="absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-xs" title="User Blocked">
                  <Ban className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#CB0000]/10 text-[#CB0000] px-3 py-1 rounded-lg">
                {profileUser.role.replace('_', ' ')}
              </span>

              {!isSelf && (
                <button
                  onClick={() => setIsBlockModalOpen(true)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                    isBlocked
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                      : 'bg-red-50 text-[#CB0000] hover:bg-red-100 border-red-200'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{isBlocked ? 'Unblock User' : 'Block User'}</span>
                </button>
              )}

              {!isSelf && onOpenDirectMessage && (
                <button
                  disabled={isBlocked}
                  onClick={() => onOpenDirectMessage(profileUser)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                    isBlocked
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-[#000000] text-white hover:bg-neutral-800 cursor-pointer'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              )}
            </div>
          </div>

          {/* Blocked Notice Banner */}
          {isBlocked && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-[#CB0000] font-semibold">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>You have blocked {profileUser.fullName}. They cannot send you direct messages.</span>
              </div>
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className="underline font-bold hover:text-[#a60000] cursor-pointer"
              >
                Unblock
              </button>
            </div>
          )}

          {/* User Meta */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold font-display text-neutral-900">{profileUser.fullName}</h1>
              {profileUser.isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isBlocked && (
                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase">
                  Blocked
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-neutral-500">
              @{profileUser.username} · Joined September 2026
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-neutral-400" />
                {profileUser.university}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {profileUser.city}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-[#CB0000] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#CB0000]" />
                {profileUser.reputationScore} Reputation Score
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
            {profileUser.bio}
          </p>

          {/* Languages & Interests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Languages Spoken</h4>
              <p className="text-neutral-700">Native: <span className="font-semibold text-neutral-900">{profileUser.nativeLanguages.join(', ')}</span></p>
              <p className="text-neutral-700">Learning: <span className="font-semibold text-neutral-900">{profileUser.learningLanguages.join(', ') || 'N/A'}</span></p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Interests & Skills</h4>
              <p className="text-neutral-700">{profileUser.interests.join(' · ')}</p>
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        user={profileUser}
        isBlocked={isBlocked}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirmBlock={handleConfirmBlock}
      />

    </div>
  );
};

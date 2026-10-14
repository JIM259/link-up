import React from 'react';
import { User } from '../types';
import { Ban, ShieldAlert, X, Check } from 'lucide-react';

interface BlockUserModalProps {
  isOpen: boolean;
  user: User | null;
  isBlocked: boolean;
  onClose: () => void;
  onConfirmBlock: (user: User) => void;
}

export const BlockUserModal: React.FC<BlockUserModalProps> = ({
  isOpen,
  user,
  isBlocked,
  onClose,
  onConfirmBlock,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FEFEFE] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${isBlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-[#CB0000]'}`}>
            {isBlocked ? <Check className="w-6 h-6 stroke-[2.5]" /> : <Ban className="w-6 h-6 stroke-[2.5]" />}
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-neutral-900">
              {isBlocked ? `Unblock ${user.fullName}?` : `Block ${user.fullName}?`}
            </h3>
            <p className="text-xs text-neutral-500 font-normal mt-0.5">
              {user.university} · {user.city}
            </p>
          </div>
        </div>

        {/* User Card Snapshot */}
        <div className="flex items-center gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-12 h-12 rounded-full object-cover border border-neutral-300 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-neutral-900 truncate">{user.fullName}</h4>
            <p className="text-[11px] text-neutral-500 truncate">@{user.username}</p>
          </div>
        </div>

        {/* Warning / Details Notice */}
        {!isBlocked ? (
          <div className="space-y-2 bg-red-50/60 border border-red-100 rounded-2xl p-3.5 text-xs text-neutral-700">
            <div className="flex items-center gap-1.5 font-bold text-[#CB0000]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>What happens when you block:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-600 pl-1">
              <li>They will not be able to send you direct messages.</li>
              <li>Your chat thread will be locked and muted.</li>
              <li>You will no longer receive notifications from this user.</li>
              <li>You can unblock them at any time in your settings or chat view.</li>
            </ul>
          </div>
        ) : (
          <p className="text-xs text-neutral-600 leading-relaxed">
            Unblocking <span className="font-bold text-neutral-900">{user.fullName}</span> will restore their ability to send you messages and connect with you on LINK UP.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            onClick={() => {
              onConfirmBlock(user);
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
              isBlocked 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-[#CB0000] hover:bg-[#a60000]'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>{isBlocked ? 'Confirm Unblock' : 'Confirm Block'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

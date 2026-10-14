import React, { useState, useEffect } from 'react';
import { User, Conversation, Message } from '../types';
import { fetchConversations, fetchMessages, sendMessage, markConversationAsRead, toggleBlockUser } from '../services/api';
import { BlockUserModal } from '../components/BlockUserModal';
import { Send, CheckCircle2, User as UserIcon, Paperclip, Sparkles, Check, CheckCheck, Ban, ShieldAlert } from 'lucide-react';

interface MessagesPageProps {
  currentUser: User;
  activeDirectUser?: User | null;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  currentUser,
  activeDirectUser
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Block User State
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(currentUser.blockedUserIds || []);
  const [blockModalTarget, setBlockModalTarget] = useState<User | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const loadConvs = async () => {
    const data = await fetchConversations(currentUser.id);
    setConversations(data);
    if (data.length > 0 && !selectedConvId) {
      setSelectedConvId(data[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConvs();
  }, [currentUser.id]);

  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId, currentUser.id).then(msgs => {
        setActiveMessages(msgs);
        markConversationAsRead(selectedConvId, currentUser.id);
      });
    }
  }, [selectedConvId, currentUser.id]);

  // Handle direct message open request from other pages
  useEffect(() => {
    if (activeDirectUser) {
      const existingConv = conversations.find(c => 
        c.participantIds.includes(activeDirectUser.id)
      );
      if (existingConv) {
        setSelectedConvId(existingConv.id);
      }
    }
  }, [activeDirectUser, conversations]);

  const handleConfirmBlock = async (targetUser: User) => {
    const res = await toggleBlockUser(currentUser.id, targetUser.id);
    setBlockedUserIds(res.blockedUserIds);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    let targetUserId = 'u2';
    if (selectedConvId) {
      const conv = conversations.find(c => c.id === selectedConvId);
      if (conv) {
        const other = conv.participants.find(p => p.id !== currentUser.id);
        if (other) targetUserId = other.id;
      }
    } else if (activeDirectUser) {
      targetUserId = activeDirectUser.id;
    }

    if (blockedUserIds.includes(targetUserId)) {
      return; // Blocked guard
    }

    const res = await sendMessage({
      senderId: currentUser.id,
      receiverId: targetUserId,
      content: inputMessage
    });

    setActiveMessages(prev => [...prev, res.message]);
    setInputMessage('');
    loadConvs();

    // Simulate real-time read receipt transition after recipient views message
    setTimeout(() => {
      setActiveMessages(prev => prev.map(m => {
        if (m.id === res.message.id) {
          return { ...m, isRead: true };
        }
        return m;
      }));
    }, 1800);
  };

  const currentConv = conversations.find(c => c.id === selectedConvId);
  const otherParticipant = currentConv?.participants.find(p => p.id !== currentUser.id) || activeDirectUser;
  const isOtherBlocked = otherParticipant ? blockedUserIds.includes(otherParticipant.id) : false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 overflow-hidden shadow-xs h-[650px] flex">
        
        {/* Left Conversations Sidebar */}
        <div className="w-72 sm:w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/50">
          <div className="p-4 border-b border-neutral-200 font-bold font-display text-sm text-neutral-900 flex items-center justify-between">
            <span>Conversations</span>
            <span className="text-[11px] font-bold text-[#CB0000] bg-[#CB0000]/10 px-2 py-0.5 rounded">
              Real-time
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {conversations.map((c) => {
              const other = c.participants.find(p => p.id !== currentUser.id) || c.participants[0];
              const isSelected = selectedConvId === c.id;
              const isLastMessageMine = c.lastMessage?.senderId === currentUser.id;
              const isBlocked = blockedUserIds.includes(other.id);

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConvId(c.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-center gap-3 cursor-pointer ${
                    isSelected ? 'bg-white font-semibold shadow-xs border-l-4 border-l-[#CB0000]' : 'hover:bg-neutral-100/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={other.avatar}
                      alt={other.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {isBlocked && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-red-600 text-white p-0.5 rounded-full" title="User Blocked">
                        <Ban className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-neutral-900 truncate flex items-center gap-1">
                        <span className="truncate">{other.fullName}</span>
                        {isBlocked && <span className="text-[9px] uppercase font-bold text-red-600 bg-red-50 px-1 rounded">Blocked</span>}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {c.lastMessage ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 truncate mt-0.5">
                      {isBlocked ? (
                        <span className="text-red-500 font-medium truncate">Conversation muted (Blocked)</span>
                      ) : (
                        <>
                          {isLastMessageMine && (
                            c.lastMessage?.isRead ? (
                              <span title="Read"><CheckCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" /></span>
                            ) : (
                              <span title="Delivered"><Check className="w-3.5 h-3.5 text-neutral-400 shrink-0" /></span>
                            )
                          )}
                          <span className="truncate">{c.lastMessage?.content || 'Started conversation'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div className="flex-1 flex flex-col bg-[#FEFEFE]">
          {otherParticipant ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={otherParticipant.avatar}
                    alt={otherParticipant.fullName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>{otherParticipant.fullName}</span>
                      {otherParticipant.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {isOtherBlocked && (
                        <span className="text-[10px] font-extrabold uppercase bg-red-100 text-[#CB0000] px-2 py-0.5 rounded-md">
                          Blocked
                        </span>
                      )}
                    </h3>
                    <div className="text-[10px] text-neutral-500">{otherParticipant.university} · {otherParticipant.city}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBlockModalTarget(otherParticipant);
                      setIsBlockModalOpen(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                      isOtherBlocked
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                        : 'bg-red-50 text-[#CB0000] hover:bg-red-100 border-red-200'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isOtherBlocked ? 'Unblock User' : 'Block User'}</span>
                  </button>
                </div>
              </div>

              {/* Blocked Alert Banner */}
              {isOtherBlocked && (
                <div className="bg-red-50/90 border-b border-red-200 p-2.5 px-4 text-xs font-bold text-[#CB0000] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-[#CB0000]" />
                    <span>You have blocked {otherParticipant.fullName}. Messages are disabled.</span>
                  </div>
                  <button
                    onClick={() => {
                      setBlockModalTarget(otherParticipant);
                      setIsBlockModalOpen(true);
                    }}
                    className="text-[11px] underline hover:text-[#a60000] cursor-pointer"
                  >
                    Unblock
                  </button>
                </div>
              )}

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/30">
                {activeMessages.map((m) => {
                  const isMine = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs space-y-1.5 ${
                        isMine
                          ? 'bg-[#000000] text-white rounded-br-none shadow-xs'
                          : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-none shadow-xs'
                      }`}>
                        <p className="leading-relaxed font-normal">{m.content}</p>
                        
                        {/* Time & Read/Delivered Tick Indicator */}
                        <div className={`text-[10px] flex items-center justify-end gap-1.5 ${isMine ? 'text-neutral-400' : 'text-neutral-400'}`}>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          
                          {isMine && (
                            <span className="inline-flex items-center gap-0.5 ml-1" title={m.isRead ? 'Seen / Read' : 'Delivered'}>
                              {m.isRead ? (
                                <span className="flex items-center text-sky-400 font-bold" title="Read by recipient">
                                  <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span className="text-[9px] font-bold tracking-tight uppercase ml-0.5">Read</span>
                                </span>
                              ) : (
                                <span className="flex items-center text-neutral-400 font-medium" title="Delivered to recipient">
                                  <Check className="w-3.5 h-3.5 stroke-[2]" />
                                  <span className="text-[9px] font-normal tracking-tight uppercase ml-0.5">Delivered</span>
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input or Blocked Guard Footer */}
              {isOtherBlocked ? (
                <div className="p-4 border-t border-neutral-200 bg-neutral-100/90 text-center text-xs font-semibold text-neutral-600 flex items-center justify-center gap-2">
                  <Ban className="w-4 h-4 text-red-500" />
                  <span>You have blocked this user. You cannot send or receive messages.</span>
                  <button
                    onClick={() => {
                      setBlockModalTarget(otherParticipant);
                      setIsBlockModalOpen(true);
                    }}
                    className="font-bold text-[#CB0000] hover:underline ml-2 cursor-pointer"
                  >
                    Unblock User
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSend} className="p-3 border-t border-neutral-200 flex items-center gap-2 bg-white">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a real-time message..."
                    className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-900 focus:outline-none focus:border-[#CB0000]"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="px-4 py-2.5 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-neutral-400">
              Select a conversation to begin messaging.
            </div>
          )}
        </div>

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

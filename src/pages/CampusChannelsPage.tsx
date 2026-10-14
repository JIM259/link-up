import React, { useState, useEffect } from 'react';
import { User, UniversityChannel, CampusPost } from '../types';
import { fetchUniversityChannels, toggleJoinChannel, createCampusPost } from '../services/api';
import {
  GraduationCap,
  Users,
  Plus,
  CheckCircle2,
  MessageSquare,
  Search,
  Sparkles,
  MapPin,
  Pin,
  HelpCircle,
  Megaphone,
  Calendar,
  AlertCircle,
  Building
} from 'lucide-react';

interface CampusChannelsPageProps {
  currentUser: User;
  onOpenDirectMessage?: (user: User) => void;
}

export const CampusChannelsPage: React.FC<CampusChannelsPageProps> = ({
  currentUser,
  onOpenDirectMessage
}) => {
  const [channels, setChannels] = useState<UniversityChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<UniversityChannel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');

  // Post form
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'Question' | 'Announcement' | 'Campus Life' | 'Lost & Found' | 'Event'>('Question');
  const [isPosting, setIsPosting] = useState(false);

  const loadChannels = async () => {
    const data = await fetchUniversityChannels(currentUser.id);
    setChannels(data);

    // Default to user's university channel if found, otherwise first channel
    if (!selectedChannel && data.length > 0) {
      const userChan = data.find(c => c.name.toLowerCase() === currentUser.university.toLowerCase()) || data[0];
      setSelectedChannel(userChan);
    } else if (selectedChannel) {
      const updated = data.find(c => c.id === selectedChannel.id);
      if (updated) setSelectedChannel(updated);
    }
  };

  useEffect(() => {
    loadChannels();
  }, [currentUser.id]);

  const handleJoinToggle = async (channelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const res = await toggleJoinChannel(channelId, currentUser.id);
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        return { ...c, isJoined: res.isJoined, memberCount: res.memberCount };
      }
      return c;
    }));

    if (selectedChannel && selectedChannel.id === channelId) {
      setSelectedChannel(prev => prev ? { ...prev, isJoined: res.isJoined, memberCount: res.memberCount } : null);
    }
  };

  const handleCreateCampusPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || !postContent.trim()) return;

    setIsPosting(true);
    const newPost = await createCampusPost(selectedChannel.id, currentUser.id, postContent, postType);
    
    setSelectedChannel(prev => {
      if (!prev) return null;
      return {
        ...prev,
        posts: [newPost, ...prev.posts]
      };
    });

    setPostContent('');
    setIsPosting(false);
  };

  const filteredChannels = channels.filter(c => {
    if (cityFilter !== 'All' && c.city !== cityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchCn = c.chineseName.toLowerCase().includes(q);
      const matchBadge = c.badgeCode.toLowerCase().includes(q);
      if (!matchName && !matchCn && !matchBadge) return false;
    }
    return true;
  });

  const myCampusChannel = channels.find(c => c.name.toLowerCase().includes(currentUser.university.toLowerCase()) || currentUser.university.toLowerCase().includes(c.name.toLowerCase()));

  const postTypes = ['All', 'Question', 'Announcement', 'Campus Life', 'Lost & Found', 'Event'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#000000] text-white rounded-3xl p-6 sm:p-10 border border-neutral-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CB0000] text-white text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" /> UNIVERSITY CAMPUS CHANNELS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
            Your University Student Community
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            Join your university channel to receive official international student updates, ask seniors campus questions, trade dorm gear, and organize on-campus activities.
          </p>

          {/* Quick Enrolled University Callout */}
          {myCampusChannel && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs text-neutral-400 font-medium">Your Enrolled Campus:</span>
              <button
                onClick={() => setSelectedChannel(myCampusChannel)}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Building className="w-3.5 h-3.5 text-[#CB0000]" />
                <span>{myCampusChannel.name} ({myCampusChannel.badgeCode})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: University Channel Selector List */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Select Campus Channel
              </h3>
              <span className="text-[11px] font-bold text-[#CB0000]">{channels.length} Universities</span>
            </div>

            {/* Search & City Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search university name or code..."
                  className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#CB0000]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {['All', 'Yiwu', 'Hangzhou', 'Shanghai', 'Beijing'].map(city => (
                  <button
                    key={city}
                    onClick={() => setCityFilter(city)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                      cityFilter === city
                        ? 'bg-[#000000] text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Channel Directory Cards */}
          <div className="space-y-3">
            {filteredChannels.map((c) => {
              const isSelected = selectedChannel?.id === c.id;
              const isUserCampus = c.name.toLowerCase().includes(currentUser.university.toLowerCase()) || currentUser.university.toLowerCase().includes(c.name.toLowerCase());

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedChannel(c)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-[#000000] text-white border-[#000000] shadow-md'
                      : 'bg-[#FEFEFE] text-neutral-900 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wider ${
                          isSelected ? 'bg-[#CB0000] text-white' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {c.badgeCode}
                        </span>
                        {isUserCampus && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            Your Campus
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold leading-snug">{c.name}</h4>
                      <p className={`text-[11px] ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>{c.chineseName}</p>
                    </div>

                    <button
                      onClick={(e) => handleJoinToggle(c.id, e)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                        c.isJoined
                          ? isSelected
                            ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : isSelected
                            ? 'bg-[#CB0000] text-white hover:bg-[#a60000]'
                            : 'bg-[#000000] text-white hover:bg-neutral-800'
                      }`}
                    >
                      {c.isJoined ? 'Joined ✓' : '+ Join'}
                    </button>
                  </div>

                  <div className={`flex items-center justify-between text-[11px] pt-2 border-t ${
                    isSelected ? 'border-neutral-800 text-neutral-400' : 'border-neutral-100 text-neutral-500'
                  }`}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {c.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {c.memberCount} Members
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Active Channel Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {selectedChannel ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Channel Hero Header Card */}
              <div className="bg-[#FEFEFE] rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
                
                <div className="h-40 sm:h-52 relative overflow-hidden">
                  <img
                    src={selectedChannel.bannerImage}
                    alt={selectedChannel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#CB0000] text-white text-xs font-black px-2.5 py-1 rounded-md">
                          {selectedChannel.badgeCode}
                        </span>
                        <h2 className="text-lg sm:text-2xl font-black font-display">{selectedChannel.name}</h2>
                        {selectedChannel.isOfficialPartner && (
                          <span title="Official Verified Campus Channel">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleJoinToggle(selectedChannel.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          selectedChannel.isJoined
                            ? 'bg-neutral-800 text-white hover:bg-neutral-900 border border-neutral-700'
                            : 'bg-[#CB0000] text-white hover:bg-[#a60000]'
                        }`}
                      >
                        {selectedChannel.isJoined ? 'Joined Channel ✓' : 'Join University Channel'}
                      </button>
                    </div>

                    <div className="text-xs text-neutral-300 mt-1">{selectedChannel.chineseName} · {selectedChannel.city}</div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                    {selectedChannel.description}
                  </p>

                  {/* Hot Topics Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Popular Campus Topics
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedChannel.topics.map((top, idx) => (
                        <span key={idx} className="text-[11px] font-semibold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200">
                          #{top}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Channel Post Input Box */}
              <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#CB0000]" /> Post to {selectedChannel.badgeCode} Campus Channel
                  </h3>
                  <span className="text-[11px] text-neutral-500 font-medium">Visible to channel members</span>
                </div>

                <form onSubmit={handleCreateCampusPost} className="space-y-3">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={`Ask a campus question or share updates with fellow ${selectedChannel.badgeCode} students...`}
                    className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#CB0000] focus:ring-1 focus:ring-[#CB0000] min-h-[80px] resize-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 font-medium">Type:</span>
                      <select
                        value={postType}
                        onChange={(e: any) => setPostType(e.target.value)}
                        className="text-xs bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-800 font-semibold cursor-pointer"
                      >
                        <option value="Question">Question</option>
                        <option value="Announcement">Announcement</option>
                        <option value="Campus Life">Campus Life</option>
                        <option value="Lost & Found">Lost & Found</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isPosting || !postContent.trim()}
                      className="px-5 py-2 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isPosting ? 'Publishing...' : 'Share to Campus'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed Type Filter Segmented Control */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-[#E9E9E9]">
                {postTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTypeFilter === type
                        ? 'bg-[#000000] text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Campus Channel Feed Posts */}
              <div className="space-y-4">
                {selectedChannel.posts
                  .filter(p => activeTypeFilter === 'All' || p.type === activeTypeFilter)
                  .map((post) => (
                    <article key={post.id} className={`bg-[#FEFEFE] rounded-2xl border p-5 shadow-xs space-y-3 ${
                      post.isPinned ? 'border-2 border-[#CB0000]/40' : 'border-neutral-200'
                    }`}>
                      
                      {post.isPinned && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#CB0000]">
                          <Pin className="w-3.5 h-3.5 fill-[#CB0000]" />
                          <span>PINNED ANNOUNCEMENT</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-neutral-900">{post.author.fullName}</span>
                              {post.author.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <div className="text-[10px] text-neutral-500">{post.author.university} · {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          post.type === 'Announcement' ? 'bg-[#CB0000] text-white' :
                          post.type === 'Question' ? 'bg-amber-100 text-amber-800' :
                          post.type === 'Lost & Found' ? 'bg-purple-100 text-purple-800' :
                          'bg-neutral-100 text-neutral-800'
                        }`}>
                          {post.type}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line font-normal">
                        {post.content}
                      </p>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
                        <div className="flex items-center gap-4">
                          <span>{post.likesCount} Helpful</span>
                          <span>{post.commentsCount} Replies</span>
                        </div>

                        {onOpenDirectMessage && post.author.id !== currentUser.id && (
                          <button
                            onClick={() => onOpenDirectMessage(post.author)}
                            className="text-xs text-[#000000] font-bold hover:underline cursor-pointer"
                          >
                            Message Author
                          </button>
                        )}
                      </div>

                    </article>
                  ))}

                {selectedChannel.posts.filter(p => activeTypeFilter === 'All' || p.type === activeTypeFilter).length === 0 && (
                  <div className="text-center py-12 text-xs text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-200">
                    No posts yet under {activeTypeFilter}. Be the first to share in {selectedChannel.badgeCode}!
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-xs text-neutral-400">
              Select a university channel on the left to view campus information.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

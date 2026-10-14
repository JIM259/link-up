import React, { useState, useEffect } from 'react';
import { User, Post, AppComment } from '../types';
import {
  fetchPosts, createPost, toggleLikePost, fetchPostComments, addPostComment
} from '../services/api';
import {
  Heart, MessageSquare, Bookmark, Share2, Sparkles, Send, MapPin, Tag, Image as ImageIcon, CheckCircle2, User as UserIcon
} from 'lucide-react';

interface HomePageProps {
  currentUser: User;
  setActiveTab: (tab: string) => void;
  onOpenDirectMessage?: (user: User) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  setActiveTab,
  onOpenDirectMessage
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // New Post Form
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Help Request');
  const [newPostLocation, setNewPostLocation] = useState(currentUser.city || 'Yiwu');
  const [isPublishing, setIsPublishing] = useState(false);

  // Active Comment Post ID
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, AppComment[]>>({});
  const [commentInput, setCommentInput] = useState('');

  const categories = [
    'All',
    'Help Request',
    'Housing',
    'Second-hand',
    'Language Exchange',
    'Campus Life',
    'Events'
  ];

  const loadFeedPosts = async () => {
    setLoading(true);
    const data = await fetchPosts(selectedCategory === 'All' ? undefined : selectedCategory);
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFeedPosts();
  }, [selectedCategory]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPublishing(true);
    const created = await createPost({
      authorId: currentUser.id,
      content: newPostContent,
      category: newPostCategory,
      location: newPostLocation
    });

    setPosts([created, ...posts]);
    setNewPostContent('');
    setIsPublishing(false);
  };

  const handleLike = async (postId: string) => {
    const res = await toggleLikePost(postId);
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: res.isLiked, likesCount: res.likesCount };
      }
      return p;
    }));
  };

  const toggleComments = async (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
    } else {
      setActiveCommentPostId(postId);
      if (!commentsMap[postId]) {
        const postComments = await fetchPostComments(postId);
        setCommentsMap(prev => ({ ...prev, [postId]: postComments }));
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentInput.trim()) return;
    const newComment = await addPostComment(postId, currentUser.id, commentInput);
    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    setPosts(posts.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    setCommentInput('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Category Segmented Controls (Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-[#E9E9E9]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#000000] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Smart Post Creation Box */}
      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-5 shadow-xs">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
            />
            <div className="flex-1 space-y-2">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Publish a post or help request in natural language (e.g., 'Looking for a roommate in Yiwu near YICC campus under 1500 RMB...')"
                className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#CB0000] focus:ring-1 focus:ring-[#CB0000] min-h-[90px] resize-none"
              />
              
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="text-xs bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="Help Request">Help Request</option>
                    <option value="Housing">Housing</option>
                    <option value="Second-hand">Second-hand</option>
                    <option value="Language Exchange">Language Exchange</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Events">Events</option>
                  </select>

                  <div className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2.5 py-1.5 rounded-lg border border-neutral-200">
                    <MapPin className="w-3.5 h-3.5 text-[#CB0000]" />
                    <input
                      type="text"
                      value={newPostLocation}
                      onChange={(e) => setNewPostLocation(e.target.value)}
                      className="bg-transparent border-none text-xs text-neutral-800 focus:outline-none w-24 font-medium"
                      placeholder="Location"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPublishing || !newPostContent.trim()}
                  className="px-5 py-2 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPublishing ? 'Analyzing AI...' : 'Post & Smart Match'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-neutral-400">Loading social feed...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-xs text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-200">
          No posts in this category yet. Be the first to share or ask for help!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-4">
              
              {/* Unboxed Header Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">{post.author.fullName}</span>
                      {post.author.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    {/* Unboxed Metadata (NO PILLS) */}
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium mt-0.5">
                      <span>{post.author.university}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.location || post.author.city}</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {post.category}
                  </span>
                  {onOpenDirectMessage && post.author.id !== currentUser.id && (
                    <button
                      onClick={() => onOpenDirectMessage(post.author)}
                      className="text-xs px-2.5 py-1 bg-neutral-100 hover:bg-[#000000] hover:text-white rounded-lg text-neutral-700 font-medium transition-colors cursor-pointer"
                    >
                      Message
                    </button>
                  )}
                </div>
              </div>

              {/* Post Content Body */}
              <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal whitespace-pre-line">
                {post.content}
              </p>

              {/* AI Structured Intent Banner (If Present) */}
              {post.aiAnalysis && (
                <div className="bg-[#000000] text-white p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#CB0000] font-bold text-[11px] uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> NEXORA AI POST INTENT
                    </span>
                    <span>Urgency: {post.aiAnalysis.urgency}</span>
                  </div>
                  <div className="text-neutral-200 font-medium">
                    {post.aiAnalysis.intent} · <span className="text-neutral-400">{post.aiAnalysis.extractedNeed}</span>
                  </div>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('help')}
                      className="text-[11px] text-[#CB0000] font-bold hover:underline cursor-pointer"
                    >
                      View Smart Matches for this request →
                    </button>
                  </div>
                </div>
              )}

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-neutral-200">
                  <img
                    src={post.images[0]}
                    alt="Post attachment"
                    className="w-full max-h-[360px] object-cover"
                  />
                </div>
              )}

              {/* Tags (Unboxed Text) */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 font-medium pt-1">
                  <Tag className="w-3 h-3 text-neutral-400" />
                  {post.tags.map((t, i) => (
                    <span key={i}>#{t}</span>
                  ))}
                </div>
              )}

              {/* Interactive Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-medium text-neutral-600">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    post.isLiked ? 'text-[#CB0000] font-bold' : 'hover:text-[#CB0000]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#CB0000]' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount} Comments</span>
                </button>

                <button className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentPostId === post.id && (
                <div className="pt-4 border-t border-neutral-200 space-y-3 bg-neutral-50/50 p-3 rounded-xl">
                  <div className="space-y-2">
                    {(commentsMap[post.id] || []).map((c) => (
                      <div key={c.id} className="flex items-start gap-2 text-xs">
                        <img
                          src={c.author.avatar}
                          alt={c.author.fullName}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <div className="bg-white p-2.5 rounded-lg border border-neutral-200 flex-1">
                          <span className="font-bold text-neutral-900">{c.author.fullName}</span>: {c.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:border-[#000000]"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-2 bg-[#000000] text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

            </article>
          ))}
        </div>
      )}

    </div>
  );
};

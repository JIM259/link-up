import React, { useState, useEffect } from 'react';
import { Guide } from '../types';
import { fetchGuides } from '../services/api';
import { BookOpen, CheckCircle2, ThumbsUp, Clock, Tag } from 'lucide-react';

export const GuidesPage: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  useEffect(() => {
    fetchGuides().then((data) => {
      setGuides(data);
      if (data.length > 0) setActiveGuide(data[0]);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
          Knowledge Hub & Survival Guides
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-normal">
          Verified guides for arrival checklists, police registration (JW202), WeChat Pay setup, SIM cards, high-speed rail, and Yiwu market navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {guides.map((g) => {
            const isSelected = activeGuide?.id === g.id;
            return (
              <div
                key={g.id}
                onClick={() => setActiveGuide(g)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-[#000000] text-white border-[#000000] shadow-md'
                    : 'bg-[#FEFEFE] text-neutral-900 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? 'text-[#CB0000]' : 'text-[#CB0000]'}>
                    {g.category}
                  </span>
                  <span className={isSelected ? 'text-neutral-400' : 'text-neutral-500'}>
                    {g.readTimeMinutes} min read
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold leading-snug">{g.title}</h3>

                <p className={`text-xs line-clamp-2 ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {g.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        {activeGuide && (
          <div className="lg:col-span-7 bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
            
            {activeGuide.image && (
              <img
                src={activeGuide.image}
                alt={activeGuide.title}
                className="w-full h-48 sm:h-56 object-cover rounded-xl border border-neutral-200"
              />
            )}

            <div className="space-y-3 border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>OFFICIAL VERIFIED GUIDE</span>
                <span aria-hidden="true">·</span>
                <span className="text-neutral-500 font-normal">Updated {activeGuide.updatedAt}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display text-neutral-900">
                {activeGuide.title}
              </h2>

              <div className="text-xs text-neutral-500 font-medium">
                Authored by <span className="font-bold text-neutral-800">{activeGuide.authorName}</span>
              </div>
            </div>

            {/* Markdown-style content view */}
            <div className="prose prose-xs sm:prose-sm max-w-none text-neutral-800 space-y-3 leading-relaxed whitespace-pre-line text-xs sm:text-sm font-normal">
              {activeGuide.content}
            </div>

            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-neutral-400" />
                <span>{activeGuide.upvotes} Students found this helpful</span>
              </div>

              <button className="px-3.5 py-1.5 bg-neutral-100 hover:bg-[#000000] hover:text-white text-neutral-800 font-bold rounded-lg transition-colors cursor-pointer">
                Upvote Guide
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { User, SmartMatchResult } from '../types';
import { executeSmartMatch } from '../services/api';
import {
  Sparkles,
  Search,
  Building,
  ShoppingBag,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface HelpMatchingPageProps {
  currentUser: User;
  setActiveTab: (tab: string) => void;
  onOpenDirectMessage?: (user: User) => void;
}

export const HelpMatchingPage: React.FC<HelpMatchingPageProps> = ({
  currentUser,
  setActiveTab,
  onOpenDirectMessage
}) => {
  const [prompt, setPrompt] = useState(
    "I'm new in Yiwu and need a roommate near YICC campus and someone who can help me practice Chinese and set up WeChat Pay."
  );
  const [matchResult, setMatchResult] = useState<SmartMatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "I'm new in Yiwu and need a roommate and someone who can help me practice Chinese.",
    "Looking for a cheap bicycle under 400 RMB in Yiwu and senior student for campus guide.",
    "Need private studio flat in Hangzhou near ZJU and guide for JW202 visa registration.",
    "Looking for a second-hand M2 MacBook in Shanghai and basketball friends at Fudan."
  ];

  const handleMatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const result = await executeSmartMatch({
      prompt,
      userId: currentUser.id,
      city: currentUser.city,
      university: currentUser.university
    });
    setMatchResult(result);
    setLoading(false);
  };

  useEffect(() => {
    handleMatch();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Signature Header Banner */}
      <div className="bg-[#000000] text-white rounded-3xl p-6 sm:p-10 border border-neutral-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CB0000] text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> SIGNATURE FEATURE: SMART NEED → SMART MATCH
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
            Describe Your Need in Plain English
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            No long form inputs required. Tell NEXORA AI what you're looking for — housing, language exchange, second-hand items, or visa advice — and get instant structured matches across the entire platform.
          </p>
        </div>
      </div>

      {/* Input Box & Quick Prompt Chips */}
      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <form onSubmit={handleMatch} className="space-y-4">
          <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Describe what you need:
          </label>
          
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'I'm new in Yiwu and need a roommate and someone who can help me practice Chinese.'"
              className="w-full text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#CB0000] focus:ring-1 focus:ring-[#CB0000] min-h-[100px] resize-none"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute bottom-3 right-3 px-5 py-2.5 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'NEXORA Matching...' : 'Run Smart Match'}</span>
            </button>
          </div>

          {/* Quick Preset Prompts */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Try a sample scenario:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(sp);
                  }}
                  className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer"
                >
                  "{sp}"
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Matching Results Output */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="inline-block w-8 h-8 border-3 border-[#CB0000] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-500 font-medium">
            NEXORA AI is extracting intent, budget, location, and scanning platform databases...
          </p>
        </div>
      ) : matchResult ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* AI Analysis Summary Banner */}
          <div className="bg-[#FEFEFE] rounded-2xl border-2 border-[#CB0000]/30 p-6 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#CB0000]">
                <Sparkles className="w-4 h-4" />
                <span>NEXORA MATCHING ANALYSIS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#000000] text-white text-xs font-black px-2.5 py-1 rounded-md">
                  {matchResult.matchScore}% MATCH SCORE
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  City: {matchResult.locationMatched}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed">
              {matchResult.matchReason}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 pt-1 font-medium">
              <span>Detected Intent:</span>
              {matchResult.detectedIntent.map((di, i) => (
                <span key={i} className="text-[#000000] font-bold">
                  {di}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Housing */}
          {matchResult.suggestedHousing && matchResult.suggestedHousing.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold font-display text-neutral-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#CB0000]" />
                  <span>Matched Housing & Roommates</span>
                </h3>
                <button
                  onClick={() => setActiveTab('housing')}
                  className="text-xs text-[#CB0000] font-bold hover:underline cursor-pointer"
                >
                  View All Housing →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchResult.suggestedHousing.slice(0, 2).map((h) => (
                  <div key={h.id} className="bg-[#FEFEFE] rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#000000] transition-all flex flex-col justify-between p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#CB0000]">¥{h.rentRmbPerMonth} / month</span>
                        <span className="text-neutral-500 text-[11px]">{h.roomType}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">{h.title}</h4>
                      <p className="text-xs text-neutral-600 line-clamp-2">{h.description}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>{h.city}</span>
                      </div>
                      {onOpenDirectMessage && (
                        <button
                          onClick={() => onOpenDirectMessage(h.host)}
                          className="px-3 py-1 bg-[#000000] text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          Contact Host
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Senior Helpers & Language Partners */}
          {matchResult.suggestedSeniorHelpers && matchResult.suggestedSeniorHelpers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold font-display text-neutral-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#CB0000]" />
                  <span>Matched Senior Helpers & Language Partners</span>
                </h3>
                <button
                  onClick={() => setActiveTab('people')}
                  className="text-xs text-[#CB0000] font-bold hover:underline cursor-pointer"
                >
                  View All People →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchResult.suggestedSeniorHelpers.slice(0, 2).map((u) => (
                  <div key={u.id} className="bg-[#FEFEFE] rounded-xl border border-neutral-200 p-4 shadow-xs flex items-start gap-3">
                    <img
                      src={u.avatar}
                      alt={u.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">{u.fullName}</span>
                        <span className="text-[10px] font-bold bg-[#CB0000]/10 text-[#CB0000] px-2 py-0.5 rounded">
                          Rep: {u.reputationScore} ★
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-medium">{u.university} · {u.city}</p>
                      <p className="text-xs text-neutral-700 line-clamp-2">{u.bio}</p>
                      
                      <div className="pt-2 flex items-center justify-between">
                        <div className="text-[11px] text-neutral-500 font-medium">
                          Speaks: {u.nativeLanguages.join(', ')}
                        </div>
                        {onOpenDirectMessage && (
                          <button
                            onClick={() => onOpenDirectMessage(u)}
                            className="px-3 py-1 bg-[#CB0000] text-white text-xs font-bold rounded-lg hover:bg-[#a60000] transition-colors cursor-pointer"
                          >
                            Message
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Knowledge Guides */}
          {matchResult.suggestedGuides && matchResult.suggestedGuides.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold font-display text-neutral-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#CB0000]" />
                  <span>Matched Verified Guides</span>
                </h3>
                <button
                  onClick={() => setActiveTab('guides')}
                  className="text-xs text-[#CB0000] font-bold hover:underline cursor-pointer"
                >
                  View All Guides →
                </button>
              </div>

              <div className="space-y-3">
                {matchResult.suggestedGuides.slice(0, 2).map((g) => (
                  <div key={g.id} className="bg-[#FEFEFE] rounded-xl border border-neutral-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                        <span className="text-emerald-700 font-bold">Verified Guide</span>
                        <span aria-hidden="true">·</span>
                        <span>{g.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{g.readTimeMinutes} min read</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{g.title}</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">{g.summary}</p>
                    </div>

                    <button
                      onClick={() => setActiveTab('guides')}
                      className="px-4 py-2 bg-neutral-100 hover:bg-[#000000] hover:text-white text-neutral-800 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer text-center"
                    >
                      Read Guide
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};

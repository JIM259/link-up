import React, { useState } from 'react';
import { User, Post, MarketplaceListing, HousingListing, Event } from '../types';
import { executeAISearch } from '../services/api';
import { Search, Sparkles, Building, ShoppingBag, Calendar, MessageSquare, MapPin } from 'lucide-react';

interface DiscoverPageProps {
  currentUser: User;
  setActiveTab: (tab: string) => void;
  onOpenDirectMessage?: (user: User) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  currentUser,
  setActiveTab,
  onOpenDirectMessage
}) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{
    posts?: Post[];
    marketplace?: MarketplaceListing[];
    housing?: HousingListing[];
    events?: Event[];
    extractedKeywords?: string[];
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    const data = await executeAISearch(query);
    setResults(data);
    setSearching(false);
  };

  const sampleSearches = [
    'cheap bike in Yiwu under 400 yuan',
    'MacBook laptop for sale in Shanghai',
    'Language exchange coffee meetup this weekend',
    'Furnished dorm room near ZJU Zijingang'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
          AI Natural-Language Search & Discovery
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-normal">
          Type queries like you would ask a friend. AI converts your phrase into structured parameters and searches real posts, marketplace listings, and housing records.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything e.g., 'cheap bike near YICC campus under 400 RMB'..."
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#000000]"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="px-6 py-3 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CB0000]" />
            <span>{searching ? 'AI Parsing...' : 'Search'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Popular searches:
          </span>
          {sampleSearches.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(s);
              }}
              className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium"
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>

      {/* Search Output Results */}
      {searching ? (
        <div className="text-center py-12 text-xs text-neutral-500">
          Searching platform database with natural language filters...
        </div>
      ) : results ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {results.extractedKeywords && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium bg-neutral-50 p-3 rounded-xl border border-neutral-200">
              <Sparkles className="w-3.5 h-3.5 text-[#CB0000]" />
              <span>Extracted Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {results.extractedKeywords.map((k, i) => (
                  <span key={i} className="bg-white px-2 py-0.5 rounded text-neutral-800 border border-neutral-200 font-bold">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Housing Results */}
          {results.housing && results.housing.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-[#CB0000]" /> Housing Matches ({results.housing.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.housing.map((h) => (
                  <div key={h.id} className="bg-[#FEFEFE] rounded-xl border border-neutral-200 p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#CB0000]">¥{h.rentRmbPerMonth} / month</span>
                      <span className="text-neutral-500 font-normal">{h.roomType}</span>
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900">{h.title}</h4>
                    <p className="text-xs text-neutral-600 line-clamp-2">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketplace Results */}
          {results.marketplace && results.marketplace.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#CB0000]" /> Marketplace Items ({results.marketplace.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.marketplace.map((m) => (
                  <div key={m.id} className="bg-[#FEFEFE] rounded-xl border border-neutral-200 p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-neutral-900">¥{m.priceRmb}</span>
                      <span className="text-neutral-500 font-normal">{m.condition}</span>
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900">{m.title}</h4>
                    <p className="text-xs text-neutral-600 line-clamp-2">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-16 text-xs text-neutral-400">
          Enter a query above to start AI natural-language discovery.
        </div>
      )}

    </div>
  );
};

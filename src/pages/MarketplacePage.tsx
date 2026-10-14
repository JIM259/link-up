import React, { useState, useEffect } from 'react';
import { User, MarketplaceListing } from '../types';
import { fetchMarketplace, createMarketplaceItem } from '../services/api';
import { ShoppingBag, Plus, Tag, MapPin, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

interface MarketplacePageProps {
  currentUser: User;
  onOpenDirectMessage?: (user: User) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  currentUser,
  onOpenDirectMessage
}) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Listing Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Electronics' | 'Bicycles' | 'Dorm Essentials' | 'Books' | 'Clothing' | 'Other'>('Electronics');
  const [priceRmb, setPriceRmb] = useState('');
  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair'>('Like New');
  const [location, setLocation] = useState(currentUser.city || 'Yiwu');

  const categories = ['All', 'Electronics', 'Bicycles', 'Dorm Essentials', 'Books', 'Clothing', 'Other'];

  const loadMarketplace = async () => {
    const data = await fetchMarketplace();
    setListings(data);
  };

  useEffect(() => {
    loadMarketplace();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceRmb) return;

    await createMarketplaceItem({
      sellerId: currentUser.id,
      title,
      description,
      category,
      priceRmb: Number(priceRmb),
      condition,
      location,
      university: currentUser.university
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setPriceRmb('');
    loadMarketplace();
  };

  const filtered = listings.filter((m) => {
    if (categoryFilter !== 'All' && m.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
            Student Second-Hand Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            Buy and sell bicycles, laptops, dorm lamps, textbooks, and gear peer-to-peer.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Post Listing</span>
        </button>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-b border-[#E9E9E9]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#000000] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div key={item.id} className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#000000] transition-all flex flex-col justify-between">
            
            <div>
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-44 object-cover border-b border-neutral-200"
                />
              )}

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-[#CB0000]">
                    ¥{item.priceRmb} RMB
                  </span>
                  <span className="text-[11px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                    {item.condition}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Location & Seller Metadata (Unboxed) */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium pt-1">
                  <span>{item.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>Expires in 20 days</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={item.seller.avatar}
                  alt={item.seller.fullName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-neutral-800">{item.seller.fullName.split(' ')[0]}</span>
              </div>

              {onOpenDirectMessage && item.sellerId !== currentUser.id && (
                <button
                  onClick={() => onOpenDirectMessage(item.seller)}
                  className="px-3 py-1.5 bg-[#000000] text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Seller</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold font-display text-neutral-900">Post Second-Hand Listing</h3>
            
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700">Item Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. GIANT Mountain Bicycle + Helmet"
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700">Price (RMB ¥)</label>
                  <input
                    type="number"
                    required
                    value={priceRmb}
                    onChange={(e) => setPriceRmb(e.target.value)}
                    placeholder="380"
                    className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Bicycles">Bicycles</option>
                    <option value="Dorm Essentials">Dorm Essentials</option>
                    <option value="Books">Books</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700">Condition</label>
                <select
                  value={condition}
                  onChange={(e: any) => setCondition(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe condition, specifications, accessories, pickup location..."
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1 h-20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CB0000] text-white text-xs font-bold rounded-lg hover:bg-[#a60000]"
                >
                  Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

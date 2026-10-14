import React, { useState, useEffect } from 'react';
import { User, HousingListing } from '../types';
import { fetchHousing, createHousingItem } from '../services/api';
import { Building, Plus, MapPin, CheckCircle2, MessageSquare, ShieldCheck, Users } from 'lucide-react';

interface HousingPageProps {
  currentUser: User;
  onOpenDirectMessage?: (user: User) => void;
}

export const HousingPage: React.FC<HousingPageProps> = ({
  currentUser,
  onOpenDirectMessage
}) => {
  const [listings, setListings] = useState<HousingListing[]>([]);
  const [cityFilter, setCityFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rentRmbPerMonth, setRentRmbPerMonth] = useState('');
  const [roomType, setRoomType] = useState<'Private Room' | 'Shared Room' | 'Entire Studio' | 'Roommate Needed'>('Roommate Needed');
  const [city, setCity] = useState(currentUser.city || 'Yiwu');
  const [location, setLocation] = useState('');

  const loadHousing = async () => {
    const data = await fetchHousing();
    setListings(data);
  };

  useEffect(() => {
    loadHousing();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rentRmbPerMonth) return;

    await createHousingItem({
      hostId: currentUser.id,
      title,
      description,
      rentRmbPerMonth: Number(rentRmbPerMonth),
      roomType,
      city,
      location,
      universityProximity: `Near ${currentUser.university}`,
      amenities: ['Air Conditioning', 'Wi-Fi', 'Washing Machine']
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setRentRmbPerMonth('');
    loadHousing();
  };

  const filtered = listings.filter((h) => {
    if (cityFilter !== 'All' && !h.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
            Student Housing & Roommate Finder
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            Find verified student apartments, dorm rooms, and international roommates in Yiwu, Hangzhou, and Shanghai.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#CB0000] text-white text-xs font-bold rounded-xl hover:bg-[#a60000] transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Post Room or Need</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9E9E9] pb-3">
        {['All', 'Yiwu', 'Hangzhou', 'Shanghai', 'Beijing'].map((c) => (
          <button
            key={c}
            onClick={() => setCityFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              cityFilter === c ? 'bg-[#000000] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div key={item.id} className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#000000] transition-all flex flex-col justify-between">
            
            <div>
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover border-b border-neutral-200"
                />
              )}

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-[#CB0000]">
                    ¥{item.rentRmbPerMonth} RMB / mo
                  </span>
                  <span className="text-[11px] font-bold bg-[#000000] text-white px-2.5 py-1 rounded-md">
                    {item.roomType}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.amenities.map((am, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                      {am}
                    </span>
                  ))}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium pt-2 border-t border-neutral-100">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{item.city} ({item.universityProximity})</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={item.host.avatar}
                  alt={item.host.fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900">{item.host.fullName}</span>
                  <div className="text-[10px] text-neutral-400">Host / Roommate</div>
                </div>
              </div>

              {onOpenDirectMessage && item.hostId !== currentUser.id && (
                <button
                  onClick={() => onOpenDirectMessage(item.host)}
                  className="px-3.5 py-1.5 bg-[#000000] text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold font-display text-neutral-900">Post Housing Listing or Roommate Need</h3>
            
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700">Listing Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Furnished 2-Bed Flat near YICC - Roommate Wanted"
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700">Rent (RMB ¥ / month)</label>
                  <input
                    type="number"
                    required
                    value={rentRmbPerMonth}
                    onChange={(e) => setRentRmbPerMonth(e.target.value)}
                    placeholder="1350"
                    className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700">Type</label>
                  <select
                    value={roomType}
                    onChange={(e: any) => setRoomType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                  >
                    <option value="Roommate Needed">Roommate Needed</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Entire Studio">Entire Studio</option>
                    <option value="Shared Room">Shared Room</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700">Specific Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Chouzhou North Road"
                    className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include details about furniture, utilities, roommate preferences..."
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
                  Publish Housing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

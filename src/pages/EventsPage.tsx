import React, { useState, useEffect } from 'react';
import { User, Event } from '../types';
import { fetchEvents, joinEvent } from '../services/api';
import { Calendar, MapPin, Users, CheckCircle2, Plus } from 'lucide-react';

interface EventsPageProps {
  currentUser: User;
}

export const EventsPage: React.FC<EventsPageProps> = ({ currentUser }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const loadEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleJoinToggle = async (eventId: string) => {
    await joinEvent(eventId, currentUser.id);
    loadEvents();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
          International Student Events & Meetups
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-normal">
          Join language exchanges, city tours, sports pickup games, and cultural events across China.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {events.map((e) => {
          const isUserJoined = e.participantIds.includes(currentUser.id);
          return (
            <div key={e.id} className="bg-[#FEFEFE] rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#000000] transition-all flex flex-col justify-between">
              
              <div>
                {e.image && (
                  <img
                    src={e.image}
                    alt={e.title}
                    className="w-full h-44 object-cover border-b border-neutral-200"
                  />
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#CB0000]">
                    <span>{e.category}</span>
                    <span className="text-neutral-500 font-normal">{e.city}</span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                    {e.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {e.description}
                  </p>

                  <div className="space-y-1 text-xs text-neutral-700 pt-2 border-t border-neutral-100 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{e.date} · {e.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{e.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{e.participantIds.length} / {e.maxParticipants} Joined</span>
                </div>

                <button
                  onClick={() => handleJoinToggle(e.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isUserJoined
                      ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                      : 'bg-[#CB0000] text-white hover:bg-[#a60000]'
                  }`}
                >
                  {isUserJoined ? 'Going (Joined)' : 'Join Event'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

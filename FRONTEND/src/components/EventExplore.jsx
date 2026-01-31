import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket, User, Film, Music, Cpu, Palette, Activity } from 'lucide-react';
import axios from 'axios';

const EventExplore = () => {
  // IDs ටික DB එකේ values වලට සමාන කළා (Music, Technology, etc.)
  const categories = [
    { id: 'Music', name: 'Music', icon: <Music size={20} /> },
    { id: 'Technology', name: 'Technology', icon: <Cpu size={20} /> },
    { id: 'Arts', name: 'Arts', icon: <Palette size={20} /> },
    { id: 'Sports', name: 'Sports', icon: <Activity size={20} /> },
    { id: 'Movies', name: 'Movies', icon: <Film size={20} /> },
    { id: 'Education', name: 'Education', icon: <User size={20} /> },
  ];

  const [activeTab, setActiveTab] = useState('Music');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  // Filter Logic
  const filteredEvents = events.filter(event => 
    event.category === activeTab 
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-purple-700">Evgo Explore</h1>
          
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 border
                  ${activeTab === cat.id 
                    ? 'bg-purple-600 text-white border-purple-600' 
                    : 'bg-white dark:bg-gray-700 border-gray-200'
                  }`}
              >
                {cat.icon}
                <span className="font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Upcoming {activeTab} Events</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 dark:border-gray-700">
                
                {/* Image (Fix: `event.image` + Backend Path) */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image ? `/uploads/${event.image}` : "https://via.placeholder.com/400x250"} 
                    alt={event.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-purple-700">
                    {event.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 truncate">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar size={16} />
                      {/* Fix: `date` column */}
                      <span>{event.date ? event.date.split('T')[0] : 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Starting from</span>
                      {/* Fix: `ticket_price` column */}
                      <span className="text-lg font-bold text-purple-600">
                        {event.ticket_price > 0 ? `LKR ${event.ticket_price}` : 'Free'}
                      </span>
                    </div>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700">
                        Buy Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <p>No events found in {activeTab}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventExplore;
import React, { useState, useEffect } from 'react'; // 1. useEffect එකතු කරා
import { Calendar, MapPin, Ticket, User, Film, Music, Cpu, Palette, Activity } from 'lucide-react';

const EventExplore = () => {
  const categories = [
    { id: 'music', name: 'Music', icon: <Music size={20} /> },
    { id: 'tech', name: 'Technology', icon: <Cpu size={20} /> },
    { id: 'arts', name: 'Arts', icon: <Palette size={20} /> },
    { id: 'sports', name: 'Sports', icon: <Activity size={20} /> },
    { id: 'movies', name: 'Movies', icon: <Film size={20} /> },
    { id: 'educational', name: 'Education', icon: <User size={20} /> }, // DB එකේ Educational තිබ්බ නිසා මේකත් දැම්මා
  ];

  const [activeTab, setActiveTab] = useState('music');
  
  // --- NEW: Events තියාගන්න State එක ---
  const [events, setEvents] = useState([]);

  // --- NEW: Featured Artists (මේක තාම hardcoded, පස්සේ DB එකට දාගන්න පුළුවන්) ---
  const featuredArtists = [
    { id: 1, name: "Bathiya & Santhush", image: "https://i.scdn.co/image/ab6761610000e5eb46e6e2254330617ba8531066" },
    { id: 2, name: "Umara", image: "https://yt3.googleusercontent.com/ytc/AIdro_k6k8C3f3y5j53k5j53k5j53k5j53k5j53k5j=s900-c-k-c0x00ffffff-no-rj" },
    { id: 3, name: "Ridma", image: "https://i.scdn.co/image/ab67616d0000b2734a7065913d85441865918749" },
    { id: 4, name: "Dhanith Sri", image: "https://i.scdn.co/image/ab6761610000e5eb006f006f006f006f006f006f" },
  ];

  // --- NEW: Backend එකෙන් Data ගන්න කොටස ---
  useEffect(() => {
    fetch('http://localhost:5000/events') // ඔයාගේ Backend Port එක Check කරන්න
      .then(res => res.json())
      .then(data => {
        console.log("Fetched Events:", data); // Console එකේ Data පෙන්නනවා
        setEvents(data);
      })
      .catch(err => console.log(err));
  }, []);

  // --- NEW: Filtering Logic (Case Insensitive) ---
  // Database එකේ "Music" තිබිලා Tab එක "music" වුනත් මැච් වෙන්න හදල තියෙන්නේ
  const filteredEvents = events.filter(event => 
    event.category.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            Evgo <span className="text-gray-400 dark:text-gray-500 text-sm font-normal">| Discover Local Events</span>
          </h1>
          
          {/* Navigation Categories */}
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 whitespace-nowrap border
                  ${activeTab === cat.id 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md transform scale-105' 
                    : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400'
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
        
        {/* Special Section for MUSIC: Top Artists */}
        {activeTab === 'music' && (
          <div className="mb-10 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Top Trending Artists</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {featuredArtists.map((artist) => (
                <div key={artist.id} className="flex flex-col items-center min-w-[100px] cursor-pointer group">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-900 group-hover:border-purple-600 dark:group-hover:border-purple-500 transition-colors">
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-400 text-center">{artist.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Header based on Category */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">Upcoming {activeTab} Events</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Explore the best events happening around you.</p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                    {/* DB Column Name: image_url */}
                  <img 
                    src={event.image_url || "https://via.placeholder.com/400x250?text=No+Image"} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-700 dark:text-purple-400 shadow-sm">
                    {event.category.toUpperCase()}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate">{event.title}</h3>
                  
                  {/* Artist / Organizer Info */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <User size={16} className="text-purple-500" />
                    {/* අපේ DB එකේ artist කියලා column එකක් නෑ, ඒ නිසා නිකන් text එකක් දානවා හෝ description එකෙන් කොටසක් */}
                    <span>Organizer</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar size={16} />
                      {/* DB Column Name: event_date */}
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin size={16} />
                      {/* DB Column Name: location */}
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 dark:text-gray-500">Starting from</span>
                      {/* DB Column Name: price */}
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {event.price === 'Free' ? 'Free' : `LKR ${event.price}`}
                      </span>
                    </div>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200 dark:shadow-none"
                    >
                       Buy Ticket <Ticket size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400 dark:text-gray-500">
              <p>No events found in this category right now.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Styles */}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default EventExplore;